# LightBnB Project

A simple mulit-page Airbnb clone that uses a server-side Javascript to display the information from queries to web pages via SQL queries.

## Dependencies

- Node.js
- Express
- pg
- bcryptjs
- cookie-session

## Getting Started

- From the psql terminal:
  - Create a database called lightbnb (using the `CREATE DATABASE lightbnb;` command).
  - Enter the lightbnb database (using the `\c lightbnb` command).
  - Create the tables (using the `\i ./migrations/01_schema.sql` command).
  - Seed the tables with sample data (using the `\i ./seeds/02_seeds.sql` command).
- Install all dependencies (using the `./LightBnB_WebApp/npm install` command).
- Run the development web server using the `./LightBnB_WebApp/npm run local` command.
