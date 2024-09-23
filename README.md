# Project Concept
This project is my 2024 summer project, the goal was to create an application that simulated a full stack web application. The project is a fitness tracker which is
used to keep track of workouts and rememeber all previous exercises and sets for each workout finished. The frontend and backend are being deployed on seperate heroku apps
where one is the dynamic frontend and the other is the Restful API.

## Frontend
The frontend of the program is written using React in combination with JavaScipt and also makes use of Spotify's free web API service to provide
a reccomended song for each time the user plans on working out. The spotify API requires OAuth 2.0. The frontend makes regular API calls to the backend to delete workouts, add workouts,
update workouts. 

## Backend
The backend of the program is written in Node.js and Express, it is also hooked up to a mySQL server which is being used to store information related
to Workouts, Exercises, Sets on three seperate table. Queries are made to grab the appropiate data from frontend and server, manipulate and foward to
server or frontend.

## Languages/MarkUp/Styling
JavaScript, Node.js, Html, CSS

## Libraries/Frameworks
React, Express

## Concepts
Restful API, API Requests (POST, PUT, GET, DELETE), OAuth 2.0, Cors, Queries, MySQL
