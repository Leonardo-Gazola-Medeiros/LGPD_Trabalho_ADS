//IMPORT REQUIREMENTS

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require("path");
const http = require('http');



// IMPORTAÇÕES DE ROTAS DO BACKEND
const userRoutes = require('./routes/userRoute');



// SERVER CONFIG

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000 // limit each IP to 100 requests per windowMs
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './')));
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
}));
app.set('view engine', 'ejs');
app.use(cookieParser());



// COOKIES

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 // Um dia
    },
    name: 'userLogged'
}));



// ROTAS BACKEND
app.use('/us', userRoutes);

const con = require('./connect/dbconnect');

con.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection established successfully.');
  }
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)})