import mongoose from "mongoose";

const productSchema = mongoose.Schema({
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
    sales:{
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }

})

export default mongoose.model('Product', productSchema)