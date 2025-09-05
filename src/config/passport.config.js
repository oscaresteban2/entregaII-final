import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import UsersDao from "../dao/mongo/usersDao.js";
import CartsDao from "../dao/mongo/cartsDao.js";
import auth from "../services/auth.js";
import config from "./config.js";

const usersServices = new UsersDao();
const cartsServices = new CartsDao();

const initializeStrategies = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                console.log("BODY REGISTER:", req.body);

                const { first_name, last_name, age } = req.body;
                if (!first_name || !last_name || !age) {
                    console.log("❌ Faltan datos");
                    return done(null, false, { message: "Valores incompletos" });
                }

                const exists = await usersServices.getBy({ email });
                console.log("EXISTS?:", exists);
                if (exists) {
                    console.log("❌ Usuario ya existe");
                    return done(null, false, { message: "Usuario ya registrado." });
                }

                const hasedPassword = await auth.createHash(password);
                console.log("HASH:", hasedPassword);

                const newUser = { first_name, last_name, email, age, password: hasedPassword };

                let cart;
                if (req.cookies['cart']) {
                    cart = req.cookies['cart'];
                } else {
                    const cartResult = await cartsServices.createCart();
                    cart = cartResult._id;
                }
                newUser.cart = cart;

                const result = await usersServices.create(newUser);
                console.log("✅ Usuario creado:", result);

                return done(null, result);

            } catch (error) {
                console.error("🔥 ERROR REGISTER:", error);
                return done(error);
            }
        }
    ));


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

        if (!email || !password) return done(null, false, { message: "Valores incompletos" });
        if (email === config.app.ADMIN_EMAIL && password === config.app.ADMIN_PASSWORD) {
            const adminUser = {
                role: 'admin',
                id: '0',
                firstName: 'admin'
            }
            return done(null, adminUser);
        }

        const user = await usersServices.getBy({ email });
        if (!user) return done(null, false, { message: "Credenciales Incorrectas" });
        const isValidPassword = await auth.validatePassword(password, user.password);
        if (!isValidPassword) return done(null, false, { message: "Credenciales Incorrectas" });

        done(null, user);

    }))

    passport.use('google', new GoogleStrategy({
        clientID: config.google.CLIENT,
        clientSecret: config.google.SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/googlecallback',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        const { _json } = profile;
        const user = await usersServices.getBy({ email: _json.email });
        if (user) {
            return done(null, user);
        } else {
            const newUser = {
                firstName: _json.given_name,
                lastName: _json.family_name,
                email: _json.email
            }
            //Revisar la librería temporal
            let cart;

            if (req.cookies['cart']) {//Obtener la que ya está de la cookie
                cart = req.cookies['cart'];
            } else { //Crear una nueva librería en la base de datos
                cartResult = await cartsServices.create();
                cart = cartResult._id
            }
            newUser.cart = cart;

            const result = await usersServices.create(newUser);
            done(null, result);
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        const user = await usersServices.getBy({ _id: id });
        done(null, user);
    })

    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([auth.cookieExtractor]),
        secretOrKey: config.jwt.SECRET
    }, async (payload, done) => {
        return done(null, payload);
    }))
}

export default initializeStrategies;