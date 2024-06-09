const express = require('express')
const appRoutes = require('./router/index')
const bodyParser = require('body-parser')
const db = require('./index')

const app = express()
app.use(bodyParser.json())
app.use('/api', appRoutes)

app.listen(3000, () => {
    console.log("server is running")
})