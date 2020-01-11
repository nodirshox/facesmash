const express = require('express')
const fileUpload = require('express-fileupload');

const app = express()
app.use(fileUpload());


const router = require('./router')



app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))

app.set('views', 'views') // second argument is folder to render webpages
app.set('view engine', 'ejs')

app.use('/', router)


module.exports = app