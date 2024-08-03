const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require("dotenv").config()

const database = require("./config/database")
database.connect()

const routeAdmin = require('./routes/admin/index.route')
const routeClient = require('./routes/client/index.route')
const systemConfig = require('./config/system')

const app = express()
const port = process.env.PORT

app.set("views", `${__dirname}/views`)
app.set("view engine", "pug")

// Flash
app.use(cookieParser('tomcacto'));
app.use(session({
    cookie: {
        maxAge: 60000
    }
}));
app.use(flash());
// End flash

app.use(bodyParser.urlencoded({
    extended: false
}))

// App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(methodOverride('_method'))
app.use(express.static(`${__dirname}/public`))

routeClient(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})