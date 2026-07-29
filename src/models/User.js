const mongoose = require("mongoose");
const ROLES = require("../constants/roles");
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.CUSTOMER,
    },

    isVerified: {
        type: Boolean,
        default: false
    }

},{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);