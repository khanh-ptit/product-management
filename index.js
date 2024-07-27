const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
require("dotenv").config()

const database = require("./config/database")
database.connect()

const routeAdmin = require('./routes/admin/index.route')
const routeClient = require('./routes/client/index.route')
const systemConfig = require('./config/system')

const app = express()
const port = process.env.PORT

app.set("views", "./views")
app.set("view engine", "pug")

app.use(bodyParser.urlencoded({ extended: false }))

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))
app.use(express.static("public"))

routeClient(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})