import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    mail: {
        type: String,
        required: [true, 'mail is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'CLIENT_ROLE'],
        default: 'CLIENT_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    }


});

export default mongoose.model('User', userSchema);