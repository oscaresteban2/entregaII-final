import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            uniqued: true
        },
        age: Number,
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'premium'],
            default: 'user'
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cart'
        },
        active: {
            type: Boolean,
            default: true,
        },
        last_connection: {
            type: Date,
            default: new Date().toISOString(),
        },
    },
    {
        timestamps: true,
    }
)

const userModel = mongoose.model(collection, schema);

export default userModel;