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
  const values = [];
  let queryString = `
  SELECT properties.*, AVG(rating) AS average_rating 
  FROM property_reviews
  RIGHT JOIN properties ON properties.id = property_reviews.property_id
  `;
  // add option to query using WHERE
  if (options.city) {
    //trim whitespace, remove first letter(s) from words,and replace space with wildcard, and ensure all chars are lowercase
    const location = options.city
      .trim()
      .split(" ")
      .map((word) => word.slice(1))
      .join("%")
      .toLowerCase();

    values.push(`%${location}%`);
    queryString += `WHERE city LIKE $${values.length} `;
  }

  // add option to query using WHERE or AND
  if (options.minimum_price_per_night) {
    values.push(`${options.minimum_price_per_night * 100}`);
    queryString +=
      values.length > 1
        ? `AND cost_per_night >= $${values.length} `
        : `WHERE cost_per_night >= $${values.length} `;
  }

  // add option to query using WHERE or AND
  if (options.maximum_price_per_night) {
    values.push(`${options.maximum_price_per_night * 100}`);
    queryString +=
      values.length > 1
        ? `AND cost_per_night <= $${values.length} `
        : `WHERE cost_per_night <= $${values.length} `;
  }

  // add option to query using WHERE
  if (options.owner_id) {
    values.push(options.owner_id);
    queryString += `WHERE owner_id = $${values.length} `;
  }

  // add option to query using HAVING to filter on GROUP BY
  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    values.push(limit);
    queryString += `
  GROUP BY properties.id
  HAVING AVG(property_reviews.rating) >= $${values.length - 1}
  ORDER BY cost_per_night
  LIMIT $${values.length} `;
  } else {
    values.push(limit);
    queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${values.length} `;
  }

  return pool.query(queryString, values).then((result) => {
    return result.rows;
  });
};

/*
SELECT properties.*, AVG(rating) AS average_rating 
FROM property_reviews
RIGHT JOIN properties ON properties.id = property_reviews.property_id
WHERE city LIKE '%ancouv%' 
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
*/

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
