const Delivery = require('../models/Delivery')
const Order = require('../models/Order')
const bcrypt = require('bcrypt')

async function getDeliveries(req, res)
{
    const deliveries = await Delivery.find().select('-password -__v').lean().exec()
    if(!deliveries || !deliveries?.length) return res.status(400).json({'message': 'No Deliveries Found!'})
    res.status(200).json(deliveries)
}

async function addDelivery(req, res)
{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const duplicate = await Delivery.findOne({ username }).lean().exec()
    if(duplicate) return res.status(400).json({'message': 'User Already Exists!'})

    const hashedPwd = await bcrypt.hash(password, 10)
    
    const createdDelivery = 
    {
        username,
        password: hashedPwd
    }

    const delivery = await Delivery.create(createdDelivery)
    delivery ? res.status(200).json({'message': `Delivery ${delivery.username} Created Successfully!`})
             : res.status(400).json({'message': 'Something Went Wrong!'})
}

async function updateDelivery(req, res)
{
    const { id, username, password } = req.body
    if(!id || !username) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const delivery = await Delivery.findById(id).exec()
    if(!delivery) return res.status(400).json({'message': 'Delivery Does Not Exist!'})

    const duplicate = await Delivery.findOne({ username }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(400).json({'message': 'Username Already Taken!'})

    if(password)
    {
        const hashedPwd = await bcrypt.hash(password, 10)
        delivery.password = hashedPwd
    }
    delivery.username = username

    const updatedDelivery = await delivery.save()
    res.status(200).json({'message': `Delivery ${updatedDelivery.username} Updated Successfully!`})
}

// async function getOrders(req, res)
// {
//     const { id } = req.params
//     if(!id) return res.status(400).json({'message': 'ID Must Be Given!'})

//     const delivery = await Delivery.findById(id).exec()
//     if(!delivery) return res.status(400).json({'message': 'Delivery Does Not Exist!'})

//     res.status(200).json(delivery.orders)
// }

async function acceptOrder(req, res)
{
    const { id, order } = req.body
    if(!id || !order) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const delivery = await Delivery.findById(id).exec()
    if(!delivery) return res.status(400).json({'message': 'Delivery Does Not Exist!'})

    const orderAccepted = await Order.findById(order).exec()
    if(!orderAccepted) return res.status(400).json({'message': 'Order Does Not Exist!'})
    if(orderAccepted.deliveryStatus !== 'pending') return res.status(400).json({'message': 'Order Is Not Available Anymore!'})

    orderAccepted.deliveryStatus = 'accepted'
    orderAccepted.delivery = id
    delivery.orders.push(order)

    const acceptedOrder = await orderAccepted.save()
    const acceptedDelivery = await delivery.save()

    res.status(200).json({'message': `${acceptedDelivery.username} Accepted Order ${acceptedOrder._id}`})
}

async function updateOrder(req, res)
{
    const { id, order } = req.body
    if(!id || !order) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const delivery = await Delivery.findById(id).exec()
    if(!delivery) return res.status(400).json({'message': 'Delivery Does Not Exist!'})

    const orderAccepted = await Order.findById(order).exec()
    if(!orderAccepted) return res.status(400).json({'message': 'Order Does Not Exist!'})
    if(orderAccepted.deliveryStatus !== 'accepted') return res.status(400).json({'message': 'Order Is Not Available Anymore!'})

    orderAccepted.deliveryStatus = 'delivered'
    
    const acceptedOrder = await orderAccepted.save()
    const acceptedDelivery = await delivery.save()

    res.status(200).json({'message': `${acceptedDelivery.username} Delivered Order ${acceptedOrder._id}`})
}

module.exports = { getDeliveries, addDelivery, updateDelivery, acceptOrder, updateOrder }