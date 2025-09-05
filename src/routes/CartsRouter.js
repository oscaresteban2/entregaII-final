import { Router } from "express";
import productsDao from '../dao/mongo/productsDao.js';
import  cartsDao  from '../dao/mongo/cartsDao.js';

const router = Router();
const ProductService = new productsDao();
const CartService = new cartsDao(ProductService);

// 1. Crear carrito
router.post('/', async (req, res) => {
    try {
        const result = await CartService.createCart();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// 2. Obtener carrito especifico
router.get('/:cid', async (req, res) => {

    try {
        const result = await CartService.getProductsFromCartByID(req.params.cid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});
// 3. Obtener todos los carros
router.get('/', async (req, res) => {
    try {
        const result = await CartService.getAllCarts();
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
})

// 4. Agregar producto al carrito especifico
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const result = await CartService.addProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// 5. Eliminar producto del carrito especifico
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const result = await CartService.deleteProductByID(req.params.cid, req.params.pid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// 6. Vaciar Carrito
router.delete('/:cid', async (req, res) => {

    try {
        const result = await CartService.deleteAllProducts(req.params.cid)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// 7. Actualizar productos del carrito especifico
router.put('/:cid', async (req, res) => {

    try {
        const result = await CartService.updateAllProducts(req.params.cid, req.body.products)
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// 8. Actualizar Productos por Cantidad
router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity, change } = req.body;

    try {
        let result;

        if (typeof quantity === 'number') {
            // ✅ Modo directo: establecer una cantidad específica
            result = await CartService.updateProductByID(cid, pid, quantity);
        } else if (typeof change === 'number') {
            // ✅ Modo relativo: aumentar o disminuir cantidad actual
            result = await CartService.changeProductQuantity(cid, pid, change);
        } else {
            throw new Error("Debes enviar 'quantity' o 'change' como número en el body.");
        }
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

export default router;