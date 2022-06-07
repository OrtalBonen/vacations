const express = require('express')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');

// Initializations
const app = express()
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

const connectionOptions = {  // setting connection options
    host: 'localhost',
    user: 'root',
    database: 'vacations',
    createDatabaseTable: true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}

const sessionStore = new MySQLStore(connectionOptions);//

const sessionOptions = {
    secret: "vjhhgfvjkho",
    name: "session",
    saveUninitialized: true,
    store: sessionStore,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 60
    },
}

// Middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(session(sessionOptions))

//Middlewares(routes)
app.use('/users', require('./routes/users'))
app.use('/feed', require('./routes/feed'))

app.listen(1000, () => console.log("server up"))