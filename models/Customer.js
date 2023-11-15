const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Customer = new Schema(
    {
        email: 
        {
            type: String,
            required: true,
            index: true
        },
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
        cart:
        {
            items:
            [
                {
                    product:
                    {
                        type: Schema.Types.ObjectId,
                        ref: 'Product',
                        index: true
                    },
                    count: 
                    {
                        type: Number,
                        default: 1
                    }
                },
            ],
            total:
            {
                type: Number,
                default: 0
            },
            default: {}
        },
        orders:
        {
            type: [Schema.Types.ObjectId],
            ref: 'Order',
            default: [],
            index: true
        },
        favourites:
        {
            type: [Schema.Types.ObjectId],
            ref: 'Product',
            default: [],
            index: true
        }
    })

Customer.index({ username: 1 })

module.exports = mongoose.model("Customer", Customer)