import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema } = mongoose;

const productCollection = 'product';

const productSchema = new Schema({
    title: { type: String, unique: true },
    description: { type: String, index: "text" },
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: { type: String, index: true },
    thumbnails: String,
    available: {
        type: Boolean,
        default: true,
        index: true
    },
    createdAt: { type: Date, default: Date.now }
});

productSchema.plugin(mongoosePaginate)

export const ProductModel = mongoose.model(productCollection, productSchema)