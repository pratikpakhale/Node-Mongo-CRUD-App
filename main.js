//imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

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

app.use(express.static('uploads'))

//set template engine
app.set('view engine', 'ejs')

//attach router
const routes = require('./routes/routes')
app.use('', routes)

app.listen(PORT, () => {
  console.log(`Server is now live on http://localhost:${PORT}`)
})
