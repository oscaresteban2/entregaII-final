import dotenv from 'dotenv'

dotenv.config({})

export default {
    app: {
        PORT: process.env.PORT || 8080,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        PERSISTENCE: process.env.PERSISTENCE
    },
    mongo: {
        URL: process.env.MONGO_URL || 'localhost:27017',
        USER: process.env.USER,
        PASSWORD: process.env.PASSWORD,
        DBNAME: process.env.DBNAME
    },
    jwt: {
        COOKIE: process.env.JWT_COOKIE,
        SECRET: process.env.JWT_SECRET
    },
    google: {
        CLIENT: process.env.GOOGLE_CLIENT,
        SECRET: process.env.GOOGLE_SECRET,
    },
    mailer: {
        USER: process.env.NODE_MAILER_USER,
        PWD: process.env.NODE_MAILER_PASSWORD
    }
}