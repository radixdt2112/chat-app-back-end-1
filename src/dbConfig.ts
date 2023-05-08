import mongoose from 'mongoose'
mongoose.Promise = require('bluebird')

let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    keepAlive: true
}

mongoose
    .connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp',
        options
    )
    .then(async () => {
        console.log('MongoDB Connected...')
    })
    .catch((error: any) => {
        if (error.message.indexOf('ECONNREFUSED') !== -1) {
            console.error(
                "Error: The server was not able to reach MongoDB. Maybe it's not running?"
            )
            process.exit(1)
        } else {
            console.log('Error :>>', error)
        }
    })
