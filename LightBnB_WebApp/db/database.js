const { Pool } = require("pg");

const properties = require("./json/properties.json");
const users = require("./json/users.json");

//Connect to ligntBnB database
const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

// Query lightBnB postgreSQL database
//  * Get a single user from the database given their email.
//  * @param {String} email The email of the user.
//  * @return {Promise<{}>} A promise to the user.
//  */

const getUserWithEmail = (email) => {
  const values = [`%${email}%`];
  const queryString = `
  SELECT id, name, email, password
  FROM users
  WHERE users.email LIKE $1`;

  return pool.query(queryString, values).then((user) => user.rows[0]);
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const values = [id];
  const queryString = `
  SELECT id, name, email, password
  FROM users
  WHERE users.id = $1
  `;

  return pool.query(queryString, values).then((user) => user.rows[0]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  const values = [name, email, password];
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3) RETURNING * 
  `;
  return pool.query(queryString, values).then((user) => user.rows[0]);
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const values = [guest_id, limit];
  const queryString = `
  SELECT reservations.id AS id, properties.*, reservations.start_date,reservations.end_date, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id 
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY reservations.start_date
  LIMIT $2
  `;

  return pool
    .query(queryString, values)
    .then((reservation) => reservation.rows);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
//Query lightBnB postgresSQL database
const getAllProperties = (options, limit = 10) => {
  const values = [limit];
  const queryString = `
  SELECT *
  FROM properties
  LIMIT $1;`;
  return pool
    .query(queryString, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return err.message;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
