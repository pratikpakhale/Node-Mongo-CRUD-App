//imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const serverless = require('serverless-http')
const path = require('path')

//init express app
const app = express()
const PORT = process.env.PORT || 4000

//db connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
})

//init database connection
const db = mongoose.connection

db.on('error', error => {
  console.log(error)
})
db.once('open', () => {
  console.log('connection to db successfully')
})

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(
  session({
    secret: 'my_secret_key',
    saveUninitialized: true,
    resave: false,
  })
)

app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

const uploads_path = path.join('..', 'uploads')
console.log(uploads_path)
app.use(express.static(uploads_path))

//set template engine
app.set('view engine', 'ejs')

//attach router
const routes = require('../routes/routes')
app.use('', routes)

module.exports.handler = serverless(app)
