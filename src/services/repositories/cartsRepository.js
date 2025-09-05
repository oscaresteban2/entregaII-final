
export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getCarts = (params) => {
        return this.dao.get(params);
    }
    getCartBy = (cartId) => {
        return this.dao.getProductsFromCartByID(cartId);
    }
    createCart = (products) => {
        return this.dao.createCart(products);
    }
    updateCart = (cartId, newproduct) => {
        return this.dao.update(cartId, newproduct);
    }
    updateProductQuantity = (cartId, updatedProducts) => {
        return this.dao.addProductByID(cartId, updatedProducts);
    }
    deleteAllProductsInCart = (cartId, vaciarcart) => {
        return this.dao.deleteAllProductsInCart(cartId, vaciarcart);
    }
    removeProductFromCart = (cartId, productId) => {
        return this.dao.removeProductFromCart(cartId, productId);
    }
}