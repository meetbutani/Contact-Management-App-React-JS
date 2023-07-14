require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    key: 'userId',
    secret: 'this site is unsecure',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24 * 1, // milliseconds/second seconds/minute minutes/hour hours/day days 
    }
}));

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const routes = require('./routes/routes');

app.use('/api', routes)

app.use('/uploads', express.static('uploads'));

const LISTENINGPORT = 3001;
app.listen(LISTENINGPORT, () => {
    console.log(`Server Started at ${LISTENINGPORT}`)
})