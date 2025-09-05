import { Schema, model } from "mongoose"

const cartCollection = 'cart';

const cartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: [],
        monto: Number,
    },
    createdAt: { type: Date, default: Date.now }
});

export const cartModel = model(cartCollection, cartSchema);