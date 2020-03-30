const express = require('express');
const app = express();
const mongoose = require('mongoose');


// DB Config


// Connect to MongoDB
mongoose.connect('mongodb+srv://Mohamed:Mohamed123@mernstack-qgev4.mongodb.net/test?retryWrites=true&w=majority', 
{
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));



// Routes 
app.get('/', (req, res) => {
    res.send('hello word')
})


const PORT =  5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`))