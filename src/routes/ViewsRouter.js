import BaseRouter from "./BaseRouter.js";
import usersControllers from "../controllers/users.controllers.js";
import productsControllers from "../controllers/products.controllers.js";
import cartsControllers from "../controllers/carts.controllers.js";

class ViewsRouter extends BaseRouter {
    init() {
        // Endpoint para vista Home
        this.get('/', ['PUBLIC'], usersControllers.login);
        // EndPoint para iniciar session
        this.get('/login', ['NO_AUTH'], usersControllers.login);
        // EndPoint para registrarse en la base de datos
        this.get('/register', ['NO_AUTH'], usersControllers.register);
        // EndPoint para cerrar session
        this.get('/logout', ['PUBLIC'], usersControllers.logout);
        // EndPoint para la vista de productos
        this.get('/products', ['PUBLIC'], productsControllers.getproducts);
        // EndPoint para la vista de productos
        this.get('/products/:pid', ['PUBLIC'], productsControllers.getProductBy);
        // EndPoint para la vista de carrito
        this.get('/cart/:cid', ['PUBLIC'], cartsControllers.getCart);
        // EndPoint para ver datos del perfil
        this.get('/profile', ['AUTH'], usersControllers.profile);
        // Endpoint para la validacion de la restauracion de contraseña
        this.get('/password-restore', ['PUBLIC'], usersControllers.passwordRestore);
        // Endpoint de vista para crear productos
        this.get('/productCreator', ['ADMIN', 'PREMIUM'], usersControllers.productCreator);
    }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();