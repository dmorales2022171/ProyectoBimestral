import mongoose from "mongoose"


const categorySchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "name is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    status:{
        type: Boolean,
        default: true
    }

})

export default mongoose.model('Category', categorySchema);