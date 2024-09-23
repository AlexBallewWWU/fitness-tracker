# Link To Deployed Program
<b>Access Here: </b> https://fitness-tracker-frontend-c27dcf177753.herokuapp.com/

# Project Concept
This project is my 2024 summer project, the goal was to create an application that simulated a full-stack web application. The project is a fitness tracker 
used to keep track of workouts and remember all previous data (exercises names, each sets lbs and reps, workoutnames) through storing on a server. The frontend and backend are being deployed on separate Heroku apps; one is the dynamic frontend and the other is the Restful API.

## Frontend
The frontend of the program is written using React in combination with JavaScipt and also makes use of Spotify's free web API service to provide
a recommended song for each time the user plans on working out. The Spotify API also requires OAuth 2.0. The frontend makes regular Restful API calls to the backend to delete workouts, add workouts,
and update workouts. 

## Backend
The backend of the program is written in Node.js and Express, it is also hooked up to a MySQL server which is being used to store information related
to Workouts, Exercises, and Sets on three separate tables. Queries are made to grab the appropriate data from the server, manipulate it, and forward it to
the frontend. The reverse is also true, as queries are applied here to grab data from the frontend and update the server.

## Languages/MarkUp/Styling
JavaScript, Node.js, Html, CSS

## Libraries/Frameworks
React, Express

## Concepts
Restful API, API Requests (POST, PUT, GET, DELETE), OAuth 2.0, Cors, Queries, MySQL
