import mongoose, { Schema } from "mongoose";

const productSchema = Schema({
    productName:{
        type: String,
        required: [true, "product name is require"]
    },
    description: {
        type: String,
        required: [true, 'product description is required ']
    },
    price: {
        type: Number,
        required: [true, 'the price is required']
    },
    stock: {
        type: Number,
        required: [true, 'stocke is required']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    status: {
        type: Boolean,
        default: true
    }

})

export default mongoose.model('Product', productSchema)