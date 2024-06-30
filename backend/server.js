// import userRoutes from './routes/users.js'


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Process the form data

app.get('/api', (req, res) => { 
    res.json({"users": ["userOne", "userTwo", "userThree"]});
});

// Start the server
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});