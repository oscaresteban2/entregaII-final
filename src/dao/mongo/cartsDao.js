import { cartModel } from "./models/cart.model.js";

export default class cartsDao {

    constructor(productManager) {
        this.productManager = productManager;
    }

    async createCart() {
        return await cartModel.create({ products: [] });
    }

    async getProductsFromCartByID(cid) {
        const cart = await cartModel.findOne({ _id: cid }).populate('products.product');

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        return cart;
    }

    async getAllCarts() {
        return cartModel.find().populate('products.product');
    }

    async addProductByID(cid, pid) {
        await this.productManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid });

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length > 0) {
            cart.products[i].quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }
        await cartModel.updateOne({ _id: cid }, { products: cart.products });

        return await this.getProductsFromCartByID(cid);
    }

    update = async (cartId, newProducts) => {
        return cartModel.updateOne({ _id: cartId }, { $set: newProducts });
    };

    async deleteProductByID(cid, pid) {
        await this.productManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid });

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        let i = null;
        const newProducts = cart.products.filter(item => item.product.toString() !== pid);

        await cartModel.updateOne({ _id: cid }, { products: newProducts });

        return await this.getProductsFromCartByID(cid);
    }

    async deleteAllProducts(cid) {

        await cartModel.updateOne({ _id: cid }, { products: [] });

        return await this.getProductsFromCartByID(cid)
    }

    async updateAllProducts(cid, products) {

        //Validate if exist products
        for (let key in products) {
            await this.productManager.getProductByID(products[key].product);
        }

        await cartModel.updateOne({ _id: cid }, { products: products });

        return await this.getProductsFromCartByID(cid)
    }

    async updateProductByID(cid, pid, quantity) {

        if (!quantity || isNaN(parseInt(quantity))) throw new Error(`La cantidad ingresada no es válida!`);

        await this.productManager.getProductByID(pid);

        const cart = await cartModel.findOne({ _id: cid });

        if (!cart) throw new Error(`El carrito ${cid} no existe!`);

        let i = null;
        const result = cart.products.filter(
            (item, index) => {
                if (item.product.toString() === pid) i = index;
                return item.product.toString() === pid;
            }
        );

        if (result.length === 0) throw new Error(`El producto ${pid} no existe en el carrito ${cid}!`);

        if (parseInt(quantity) <= 0) {
            throw new Error(`La cantidad debe ser mayor a cero`);
        }

        cart.products[i].quantity += parseInt(quantity);

        await cartModel.updateOne({ _id: cid }, { products: cart.products });

        return await this.getProductsFromCartByID(cid);
    }

    async changeProductQuantity(cartId, productId, change) {
        const cart = await cartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

        const currentQuantity = cart.products[productIndex].quantity;
        const newQuantity = currentQuantity + change;

        if (newQuantity <= 0) {
            // Eliminar producto si la cantidad es 0 o menor
            cart.products.splice(productIndex, 1);
        } else {
            cart.products[productIndex].quantity = newQuantity;
        }

        await cart.save();
        return cart;
    }
}