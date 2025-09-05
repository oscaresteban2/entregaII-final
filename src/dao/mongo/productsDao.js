import { ProductModel } from "./models/products.model.js";

export default class productsDao {

    async getProductByID(pid) {
        const product = await ProductModel.findById(pid);

        if (!product) throw new Error(`El producto ${pid} no existe!`);

        return product;
    }
    async getProducts() {
        try {
            const productos = await ProductModel.find();
            return productos;
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    async getAllProducts(query) {

        const filter = {}; // Inicializa el objeto de filtro
        if (query.title) { filter.title = query.title; } // Filtra por título si se proporciona
        if (query.category) { filter.category = query.category; } // Filtra por categoría si se proporciona
        const sorted = { // Define las opciones de ordenamiento
            'asc': 1,
            'desc': -1,
            default: 0
        };
        const opcion = { // Configura las opciones para la paginación
            limit: query.limit || 10, // Limite de resultados por página
            page: query.page || 1, // Número de página actual
            ...(query.sort ? { sort: { price: sorted[query.sort] } } : {}) // Ordena por precio si se proporciona
        };

        const result = await ProductModel.paginate(filter, opcion); // Obtiene los productos paginados
        const response = { // Crea un objeto de respuesta
            status: 'success',
            payload: result.docs, // Productos obtenidos
            totalPages: result.totalPages, // Total de páginas
            prevPage: result.prevPage, // Página anterior
            nextPage: result.nextPage, // Página siguiente
            page: result.page, // Página actual
            hasPrevPage: result.hasPrevPage, // Indica si hay página anterior
            hasNextPage: result.hasNextPage, // Indica si hay página siguiente
            prevLink: `page=${result.prevPage}&limit=${query.limit}`, // Enlace a la página anterior
            nextLink: `page=${result.nextPage}&limit=${query.limit}` // Enlace a la página siguiente
        };

        return response; // Envía la respuesta        
    }

    async createProduct(product) {
        const { title, description, code, price, stock, category, thumbnails } = product;

        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error('Error al crear el producto, tienes un espacio vacio');
        }

        return await ProductModel.create({ title, description, code, price, stock, category, thumbnails });
    }

    async updateProduct(pid, productUpdate) {

        return await ProductModel.findOneAndUpdate({ _id: pid }, productUpdate, { new: true }); // new: true Muy importante: retorna el documento actualizado

    }

    async deleteProduct(pid) {
        const result = await ProductModel.deleteOne({ _id: pid });

        if (result.deletedCount === 0) throw new Error(`El producto ${pid} no existe!`);

        return result;
    }
}