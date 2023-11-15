const Customer = require('../models/Customer')
const Product = require('../models/Product')
const Order = require('../models/Order')
const bcrypt = require('bcrypt')
//@ts-ignore
const Stripe = require('stripe')(process.env.STRIPE_SECRET)

async function getCustomers(req, res)
{
    const customers = await Customer.find().select('-password -__v').lean().exec()
    if(!customers || !customers?.length) return res.status(400).json({'message': 'No Customers Yet!'})
    res.status(200).json(customers)
}

async function orderCompleted(req, res)
{
    const { id } = req.params
    if(!id) return res.status(400).json({'message': 'ID Must Be Given!'})

    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({'message': 'Customer Does Not Exist!'})

    const products = customer.cart?.items.map(item => ({product: item.product, count: item.count}))
    //@ts-ignore
    const subTotal = customer.cart.total
    const total = subTotal
    const createdOrder = 
    {
        customer: id,
        products,
        subTotal,
        total,
    }
    const finalOrder = await Order.create(createdOrder)
    customer.orders.push(finalOrder._id)
    //@ts-ignore
    customer.cart.items = []
    //@ts-ignore
    customer.cart.total = 0
    await customer.save()

    res.status(200).json({'message': `Order ${finalOrder._id} Was Placed Successfully!`})
}

async function getCustomer(req, res)
{
    const { id } = req.params
    const customer = await Customer.findById(id).lean().exec()
    if(!customer) return res.status(400).json({'message': 'Customer Does Not Exist!'})
    res.status(200).json(customer)
}

async function addCustomer(req, res)
{
    const { email, username, password } = req.body
    if(!email || !username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const duplicateEmail = await Customer.findOne({ email }).lean().exec()
    if(duplicateEmail) return res.status(400).json({'message': 'Email Already Exists!'})

    const duplicateUsername = await Customer.findOne({ username }).lean().exec()
    if(duplicateUsername) return res.status(400).json({'message': 'Username Already Exists!'})

    const hashedPwd = await bcrypt.hash(password, 10)

    const createdCustomer = 
    { 
        email,
        username,
        password: hashedPwd
    }

    const customer = await Customer.create(createdCustomer)

    customer ? res.status(200).json({'message': `Customer ${customer.username} Created Successfully!`})
             : res.status(400).json({'message': 'Something Went Wrong!'})
}

async function updateCart(req, res)
{
    const { id, product, action, count } = req.body
    if(!id || !product || !action) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({'message': 'Customer Does Not Exist!'})

    const productUpdated = await Product.findById(product).lean().exec()
    if(!productUpdated) return res.status(400).json({'message': 'Product Does Not Exist!'})

    if(action === 'add')
    {
        if(count)
        {
            for(let i = 0; i < count; i++)
            {
                const cartProduct = customer.cart?.items.find(cartProduct => cartProduct.product?.toString() === product)
                if(cartProduct !== null && cartProduct !== undefined)
                {
                    //@ts-ignore
                    cartProduct.count = cartProduct.count + 1
                }
                else
                {
                    customer.cart?.items.push({ product, count: 1 })
                }
                //@ts-ignore
                customer.cart.total +=  productUpdated.price
            }
        }
        else
        {
            const cartProduct = customer.cart?.items.find(cartProduct => cartProduct.product?.toString() === product)
            if(cartProduct !== null && cartProduct !== undefined)
            {
                //@ts-ignore
                cartProduct.count = cartProduct.count + 1
            }
            else
            {
                customer.cart?.items.push({ product, count: 1 })
            }
            //@ts-ignore
            customer.cart.total +=  productUpdated.price
        }
    }
    else if(action === 'remove')
    {
        const cartProduct = customer.cart?.items.find(cartProduct => cartProduct.product?.toString() === product)
        if(cartProduct !== null && cartProduct !== undefined)
        {
            //@ts-ignore
            if(cartProduct.count > 1)
            {
                //@ts-ignore
                cartProduct.count = cartProduct.count - 1
            }
            else
            {
                const newCart = customer.cart?.items.filter(cartProduct => cartProduct.product?.toString() !== product)
                //@ts-ignore
                customer.cart.items = newCart
            }
            //@ts-ignore
            customer.cart.total -=  productUpdated.price
        }
        else
        {
            return res.status(400).json({'message': 'Item Is Already Not In Cart!'})
        }
    }
    else if(action === 'delete')
    {
        const cartProduct = customer.cart?.items.find(cartProduct => cartProduct.product?.toString() === product)
        if(cartProduct !== null && cartProduct !== undefined)
        {
            const newCart = customer.cart?.items.filter(cartProduct => cartProduct.product?.toString() !== product)
            //@ts-ignore
            customer.cart.total -=  productUpdated.price * cartProduct.count
            //@ts-ignore
            customer.cart.items = newCart
        }
        else
        {
            return res.status(400).json({'message': 'Item Is Already Not In Cart!'})
        }
    }

    const updatedCart = await customer.save()

    res.status(200).json({'message': `${updatedCart.username}'s Cart Updated Successfully!`})
}

async function updateFavs(req, res)
{
    const { id, product } = req.body
    if(!id || !product) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({'message': 'Customer Does Not Exist!'})

    const productUpdated = await Product.findById(product).lean().exec()
    if(!productUpdated) return res.status(400).json({'message': 'Product Does Not Exist!'})

    const included = customer.favourites.find(prod => prod.toString() === product)

    if(included) 
    {
        const favs = customer.favourites
        const filtered = favs.filter(prod => prod.toString() !== product)
        customer.favourites = filtered
    }
    else
    {
        customer.favourites.push(product)
    }
    await customer.save()

    return res.status(200).json({ 'message': 'Updated Favourites!' })
}

async function getFavs(req, res)
{
    const { id } = req.params
    if(!id) return res.status(400).json({ 'message': 'All Fields Must Be Given!' })

    const customer = await Customer.findById(id).select('favourites').lean().exec()
    if(!customer) res.status(400).json({ 'message': 'Customer Does Not Exist!' })

    const favs = customer?.favourites
    return res.status(200).json(favs)
}

async function checkOut(req, res)
{
    const { id } = req.body
    if(!id) return res.status(400).json({'message': 'ID Must Be Given!'})

    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({'message': 'Customer Does Not Exist!'})

    if(!customer.cart?.items.length) return res.status(400).json({'message': 'Cart Is Empty!'})

    const products = customer.cart?.items.map(item => item.product)
    const subTotal = customer.cart.total
    const total = subTotal

    const line_items = await Promise.all(customer.cart.items.map(async (item) => 
        {
            const product = await Product.findById(item.product).lean().exec()
            if(!product) return {}
            return {
                price_data: 
                {
                    currency: "usd",
                    product_data: 
                    {
                        name: product.title,
                        description: product.description,
                        metadata: 
                        {
                            id: product._id
                        }
                    },
                    unit_amount: product.price * 100
                },
                quantity: item.count
            }
        }))

    const stripeOrder = await Stripe.checkout.sessions.create(
        {
            line_items: [...line_items],
            mode: 'payment',
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000`,
        })
    
    // res.redirect(200, stripeOrder.url);
    
    res.status(200).json({'url': stripeOrder.url})
}

module.exports = { getCustomers, getCustomer, addCustomer, updateCart, checkOut, orderCompleted, getFavs, updateFavs }