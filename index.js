const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { User } = require('./model/user');
const { auth } = require("./middleware/auth");


// DB Config

const db = require('./config/key').mongoURI;

// Connect to MongoDB
mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// body-parser
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());



app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});


// Routes 
app.post('/api/user/register', (req, res) => {
    const user = new User(req.body)

    user.save( (err, userData) => {
        if(err) return res.json ({success: false, err})
        return res.status(200).json ({success: true })
    })
})

app.post("/api/user/login", (req, res) => {
    // find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
        });
            // Compare passwordd
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });
            //Generate token
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res
                .cookie("w_auth", user.token)
                .status(200)
                .json({
                    loginSuccess: true, userId: user._id
                });
        });
        });
    });
});

app.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});


const PORT =  5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))