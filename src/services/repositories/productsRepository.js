export default class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = (params) => {
        return this.dao.getProducts(params);
    }

    getAllProducts = (params) => {
        return this.dao.getAllProducts(params);
    }

    getProductBy = (params) => {
        return this.dao.getProductByID(params);
    }

    createProduct = (product) => {
        return this.dao.create(product);
    }

    updateProduct = (id, product) => {
        return this.dao.updateProduct(id, product);
    }

    updateProductStatusInactive = (id) => {
        return this.dao.updateStatusInactive(id);
    }

    updateProductStatusActive = (id) => {
        return this.dao.updateStatusActive(id);
    }

    deleteProduct = (id) => {
        return this.dao.deleteProduct(id);
    }
}

