const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = new Schema(
    {
        image:
        {
            type: String,
            required: true,
            index: true
        },
        title: 
        {
            type: String,
            required: true,
            index: true
        },
        description:
        {
            type: String,
            required: true,
            index: true
        },
        price:
        {
            type: Number,
            required: true,
            index: true
        },
        additionalInfo: {},
        category:
        {
            type: Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: 'Category'
        },
        categoryName:
        {
            type: String,
            required: true,
            index: true
        },
        available:
        {
            type: Boolean,
            required: true,
            index: true
        },
    },
    { 
        timestamps: true 
    }
)

module.exports = mongoose.model('Product', Product)