const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = new Schema(
    {
        customer: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
            index: true
        },
        products:
        {
            type: [Schema.Types.ObjectId],
            ref: 'Product',
            required: true,
            index: true
        },
        subTotal: 
        {
            type: Number,
            required: true
        },
        total: 
        {
            type: Number,
            required: true
        },
        deliveryStatus: 
        {
            type: String,
            enum: ['pending', 'accepted', 'delivered', 'cancelled'],
            default: 'pending'
        },
        delivery: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Delivery'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Order", Order)