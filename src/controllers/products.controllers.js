import { productsService } from "../services/index.js";
import { usersService } from "../services/index.js";

const getproducts = async (req, res, next) => {
    try {
        const productos = await productsService.getProducts();
        res.render("home", { productos, css: 'style' });
    } catch (error) {
        next(error);
    }
}
const getALLproducts = async (req, res, next) => {
    try {
        const query = req.query; // Obtiene los parámetros de consulta de la solicitud
        const response = await productsService.getAllProducts(query);
        res.json({ status: "success", response });
    } catch (error) {
        next(error);
    }
}

const getProductBy = async (req, res, next) => {
    const { pid } = req.params;
    try {
        // Buscar el producto por su ID
        const product = await productsService.getProductBy({ _id: pid });
        if (!product) {
            res.status(400).json({ message: "Producto no encontrado" });
        } else {
            // Renderizar los detalles del producto
            res.render('infoproduct', {
                product: {
                    _id: product._id,
                    titulo: product.title,
                    description: product.description,
                    imagen: product.thumbnails,
                    precio: product.price,
                    stock: product.stock,
                    categoria: product.category
                },
                css: 'infoprod'
            });
        }
    } catch (error) {
        next(error);
    }

}

const createProduct = async (req, res, next) => {
    try {
        console.log("Datos recibidos del formulario:", req.body);
        const { title, description, category, code, stock, price, pid } = req.body;
        // Verificación de campos obligatorios
        if (!title || !description || !category || !code || !stock || !price) {
            return res.status(400).json({ status: "error", error: "Valores incompletos" });
        }
        const newProduct = {
            title,
            description,
            category,
            code,
            stock,
            price
        }

        if (req.user.role === "premium") {
            const user = await usersService.getUser({ _id: req.user.id });
            if (!user) {
                return res.status(404).send({ status: "error", message: "User not found" });
            }
            newProduct.owner = user.email;

        } else {
            newProduct.owner = "admin";
        }

        //Ya creé el objeto, ya mapeé las imágenes, ahora sí, inserto en la base
        const result = await productsService.createProduct(newProduct);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        next(error);
    }
}

const updateProductBy = async (req, res, next) => {
    try {
        const { pid } = req.params;

        const {
            title,
            description,
            category,
            stock,
            price,
            available
        } = req.body;

        const updateProduct = {
            title,
            description,
            category,
            stock,
            price,
            available
        }

        const product = await productsService.getProductBy({ _id: pid });
        if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
        await productsService.updateProduct(pid, updateProduct);
        res.send({ status: "success", message: "Producto Actualizado" });
    } catch (error) {
        next(error);
    }
}

const deleteProductBy = async (req, res, next) => {
    try {
        const { pid } = req.params;

        const product = await productsService.getProductBy({ _id: pid });
        if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
        await productsService.deleteProduct(pid)
        res.send({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        req.logger.error("No se pudo realizar la eliminacion del producto");
        const customError = new Error();
        const knownError = ErrorsDictionary[error.name];

        if (knownError) {
            customError.name = knownError,
                customError.message = error.message,
                customError.code = errorCodes[knownError];
            next(customError);
        } else {
            next(error);
        }
    }
}

export default {
    getproducts,
    getALLproducts,
    getProductBy,
    createProduct,
    updateProductBy,
    deleteProductBy,
}

