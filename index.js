const express = require('express');
const loans = require('./routes/loans');
const { initDb } = require('./db/loan');
const app = express();

const PORT = process.env.PORT || 3000;

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/loans', loans);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(PORT, ()=> {console.log(`loanstreet api running on ${PORT}`)});