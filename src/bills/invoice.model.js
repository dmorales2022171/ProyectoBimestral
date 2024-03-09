import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'product is required']
        },
        quantity: {
            type: Number,
            required: [true, 'quantity is required'],
            min: [1, 'Quantity must be at least 1']
        },
        price: {
            type: Number,
            required: [true, 'price is required'],
            min: [0, 'Price must be greater than or equal to 0']
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user is required']
    },
    total:{
        type: Number,
        required: true
    }
})

export default mongoose.model('Invoice', invoiceSchema)