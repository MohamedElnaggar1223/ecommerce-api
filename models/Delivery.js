const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Delivery = new Schema(
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
        },
        orders:
        {
            type: [Schema.Types.ObjectId],
            ref: 'Order',
            default: [],
            index: true
        }
    })

module.exports = mongoose.model("Delivery", Delivery)