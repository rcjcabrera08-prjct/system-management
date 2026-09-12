const express = require('express');
const app = express();
const supabase = require('./db_connection');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {title: "System Status Dashboard"});
});

app.get('/signin', (req, res) => {
    res.render('sign_in', {title: "Sign In"});
});

app.get('/logout', (req, res) => {
    res.render('logout', { title: "Logged Out" });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});