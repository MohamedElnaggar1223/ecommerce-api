const Order = require('../models/Order')

async function getOrders(req, res)
{
    const orders = await Order.find().lean().exec()
    if(!orders || !orders.length) return res.status(400).json({'message': 'No Orders Yet!'})
    res.status(200).json(orders)
}

module.exports = { getOrders }