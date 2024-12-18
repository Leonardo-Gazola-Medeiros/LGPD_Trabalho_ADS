//IMPORT REQUIREMENTS
require('dotenv').config();
require('./connect/dbCreate');

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
const termRoutes = require('./routes/termsRoute')
const userRoutes = require('./routes/userRoute');
const homeRoute = require('./routes/homeRoute');
const cookieRoute = require('./routes/cookieRoute')

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
    methods: ['POST', 'GET', 'PUT', 'DELETE','PATCH'],
    credentials: true
}));
app.set('view engine', 'ejs');
app.use(cookieParser());



// COOKIES
//app.use(session({
//    secret: 'secret',
//    resave: false,
//    saveUninitialized: true,
//    cookie: {
//        secure: false,
//       maxAge: 1000 * 60 * 60 * 24 // Um dia
//    },
//    name: 'userLogged'
//}));

// ROTAS BACKEND
app.use('/us', userRoutes);
app.use('/msg', homeRoute);
app.use('/term',termRoutes);
// app.use('/ck', cookieRoute)

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
