SELECT properties.id AS id, title, cost_per_night, AVG(rating) AS average_rating 
FROM property_reviews
RIGHT JOIN properties ON properties.id = property_reviews.property_id
WHERE city LIKE '%ancouv%' 
GROUP BY properties.id
HAVING AVG(property_reviews.rating) >= 4
ORDER BY cost_per_night
LIMIT 10;
