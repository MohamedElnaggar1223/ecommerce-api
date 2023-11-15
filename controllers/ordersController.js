const Order = require('../models/Order')
const Customer = require('../models/Customer')

async function getOrders(req, res)
{
    const orders = await Order.find().lean().exec()
    if(!orders || !orders.length) return res.status(400).json({'message': 'No Orders Yet!'})
    res.status(200).json(orders)
}

async function getMyOrders(req, res)
{
    const { id } = req.params
    if(!id) return res.status(400).json({ 'message': 'ID Must Be Given!' })

    const customer = await Customer.findById(id).select('orders').populate('orders').lean().exec()
    if(!customer) return res.status(400).json({ 'message': 'User Not Found!' })

    return res.status(200).json(customer.orders)
}

module.exports = { getOrders, getMyOrders }