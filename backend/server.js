// import userRoutes from './routes/users.js'


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Process the form data

app.get('/api', (req, res) => { 
    // res.json({"workouts": ["Monday"]});
    var arr = Array.from(Array(0), () => new Array(0));
    res.json([{workoutName: "Monday", arr}]);
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});