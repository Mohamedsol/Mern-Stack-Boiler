const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./model/user');


// DB Config

const db = require('./config/dev').mongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// body-parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes 
app.post('/api/user/register', (req, res) => {
    const user = new User(req.body)

    user.save( (err, userData) => {
        if(err) return res.json ({success: false, err})
        return res.status(200).json ({success: true })
    })
})


const PORT =  5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))