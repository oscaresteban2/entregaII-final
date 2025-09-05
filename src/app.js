import express from 'express'; 
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import "./dao/mongo/dbconfig.js";

import viewsRouter from './routes/ViewsRouter.js';
import sessionRouter from "./routes/SessionsRouter.js";
import productsRouter from './routes/ProductsRouter.js';
import UsersRouter from "./routes/UsersRouter.js";
import cartsRouter from './routes/CartsRouter.js';

import  __dirname  from "./utils.js";
import initializeStrategies from "./config/passport.config.js";
import config from './config/config.js';

const app = express();
const PORT = config.app.PORT;

//Esucha el server:
app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json());
app.use(cookieParser());

//configuracion de handlebars
const hbs = exphbs.create({
    helpers:
    {
        sumPrice: function (products) {
            let total = 0;
            for (const product of products) {
                total += product._id.price * product.quantity;
            }
            return total;
        },
        subtotal: function (value1, value2) {
            return value1 * value2;
        }
    }
});

hbs.allowProtoPropertiesByDefault = true;

//Motores de plantillas y visualizaciones:
app.engine("handlebars", hbs.engine);
app.set('views', `${__dirname}/views`)
app.set("view engine", "handlebars");

initializeStrategies();

//rutas
app.use("/", viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/users', UsersRouter);