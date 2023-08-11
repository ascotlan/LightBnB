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
- From the LightBnB_WebApp directory, install all dependencies (using the `npm install` command).
- From the LightBnB_WebApp directory, run the development web server (using the `npm run local` command).

## ERD

!["Screenshot of ERD"]()
