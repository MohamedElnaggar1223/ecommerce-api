require('dotenv').config()
require('express-error-handler')
const path = require('path')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3001

connectDB()
app.use(express.json({ limit: "50mb" }))
app.use(logger)
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use('/', require(path.join(__dirname, 'routes', 'root')))
app.use('/products', require(path.join(__dirname, 'routes', 'productsRoutes')))
app.use('/admins', require(path.join(__dirname, 'routes', 'adminsRoutes')))
app.use('/customers', require(path.join(__dirname, 'routes', 'customersRoutes')))
app.use('/delivery', require(path.join(__dirname, 'routes', 'deliveryRoutes')))
app.use('/orders', require(path.join(__dirname, 'routes', 'ordersRoutes')))
app.use('/category', require(path.join(__dirname, 'routes', 'categoryRoutes')))
app.use('/categories', require(path.join(__dirname, 'routes', 'categoryRoutes')))
app.use('/auth', require(path.join(__dirname, 'routes', 'authRoutes')))

app.use('*', (req, res) => 
{
    if(req.accepts('html')) res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    else if(req.accepts('json')) res.status(404).json({'message': '404 Not Found'})
    else res.status(404).send('404 Not Found')
})

app.use(errorHandler)

mongoose.connection.once('open', () => 
{
    console.log('MongoDB is Connected')
    app.listen(PORT, () => console.log(`Server is Running on ${PORT}`))
})

mongoose.connection.on('error', (err) => 
{
    console.error(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})