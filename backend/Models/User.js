const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    expenses: [
        {
            text: {
                type: String,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            type:{
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
        }
    ]
});

const UserModel = mongoose.model('users_1', UserSchema);
module.exports = UserModel;