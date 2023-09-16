const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema(
    {
        username: 
        {
            type: String,
            required: true,
            index: true
        },
        password:
        {
            type: String,
            required: true,
            index: true
        }
    })

module.exports = mongoose.model("Admin", Admin)