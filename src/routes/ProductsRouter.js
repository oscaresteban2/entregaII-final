import BaseRouter from './BaseRouter.js';
import productsControllers from '../controllers/products.controllers.js';

class ProductsRouter extends BaseRouter {
    init() {
        // EndPoint para traer todos los productos
        this.get('/', ['AUTH'], productsControllers.getALLproducts);
        // EndPoint para traer producto por ID
        this.get("/:pid", ['USER'], productsControllers.getProductBy);
        // EndPoint para crear producto 
        this.post("/", ['ADMIN', 'PREMIUM'], productsControllers.createProduct);
        // EndPoint para Actualizar producto por ID
        this.put("/:pid", ['ADMIN'], productsControllers.updateProductBy);
        // EndPoint para eliminar producto por ID
        this.delete("/:pid", ['ADMIN'], productsControllers.deleteProductBy);
    }
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();