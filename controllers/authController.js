const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Customer = require('../models/Customer')
const Admin = require('../models/Admin')
const Delivery = require('../models/Delivery')

async function customerLogin(req, res)
{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const customer = await Customer.findOne({ username }).lean().exec()
    if(!customer) return res.status(400).json({'message': 'User Does Not Exist!'})

    const correctPwd = await bcrypt.compare(password, customer.password)
    if(!correctPwd) return res.status(400).json({'message': 'Wrong Password!'})

    const accessToken = jwt.sign(
        {
            "UserInfo": 
            {
                "id": customer._id,
                "email": customer.email,
                "username": customer.username,
                "cart": customer.cart,
                "orders": customer.orders
            }
        }, 
        //@ts-ignore
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            "username": customer.username
        }, 
        //@ts-ignore
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    res.cookie('jwt', 
    refreshToken, 
    { 
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken })
}

async function adminLogin(req, res)
{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const admin = await Admin.findOne({ username }).lean().exec()
    if(!admin) return res.status(400).json({'message': 'User Does Not Exist!'})

    const correctPwd = await bcrypt.compare(password, admin.password)
    if(!correctPwd) return res.status(400).json({'message': 'Wrong Password!'})
    const accessToken = jwt.sign(
        {
            "UserInfo": 
            {
                "id": admin._id,
                "username": admin.username,
                "admin": true
            }
        }, 
        //@ts-ignore
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            "username": admin.username,
            "admin": true
        }, 
        //@ts-ignore
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    res.cookie('jwt', 
    refreshToken, 
    { 
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken })
}

async function deliveryLogin(req, res)
{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const delivery = await Delivery.findOne({ username }).lean().exec()
    if(!delivery) return res.status(400).json({'message': 'User Does Not Exist!'})

    const correctPwd = await bcrypt.compare(password, delivery.password)
    if(!correctPwd) return res.status(400).json({'message': 'Wrong Password!'})

    const accessToken = jwt.sign(
        {
            "UserInfo": 
            {
                "id": delivery._id,
                "username": delivery.username,
                "orders": delivery.orders,
                "delivery": true
            }
        }, 
        //@ts-ignore
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        {
            "username": delivery.username,
            "delivery": true
        }, 
        //@ts-ignore
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    res.cookie('jwt', 
    refreshToken, 
    { 
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ accessToken })
}

async function refresh(req, res)
{
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({'message': 'Unauthorized By Server!'})

    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken, 
        //@ts-ignore
        process.env.REFRESH_TOKEN_SECRET, 
        async (err, decoded) => 
        {            
            if(err) return res.status(403).json({'message': 'Forbiden By Server!'})

            //@ts-ignore
            if(decoded.admin)
            {
                //@ts-ignore
                const admin = await Admin.findOne({ username: decoded.username }).lean().exec()
                if(!admin) return res.status(401).json({'message': 'Unauthorized By Server!'})

                const accessToken = jwt.sign(
                    {
                        "UserInfo": 
                        {
                            "id": admin._id,
                            "username": admin.username,
                            "admin": true
                        }
                    }, 
                    //@ts-ignore
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )

                res.json({ accessToken })
            }
            //@ts-ignore
            else if(decoded.delivery)
            {
                //@ts-ignore
                const delivery = await Delivery.findOne({ username: decoded.username }).lean().exec()
                if(!delivery) return res.status(401).json({'message': 'Unauthorized By Server!'})

                const accessToken = jwt.sign(
                    {
                        "UserInfo": 
                        {
                            "id": delivery._id,
                            "username": delivery.username,
                            "orders": delivery.orders,
                            "delivery": true
                        }
                    }, 
                    //@ts-ignore
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )
                res.json({ accessToken })
            }
            else
            {
                //@ts-ignore
                const customer = await Customer.findOne({ username: decoded.username }).lean().exec()
                if(!customer) return res.status(401).json({'message': 'Unauthorized By Server!'})

                const accessToken = jwt.sign(
                    {
                        "UserInfo": 
                        {
                            "id": customer._id,
                            "email": customer.email,
                            "username": customer.username,
                            "cart": customer.cart,
                            "orders": customer.orders
                        }
                    }, 
                    //@ts-ignore
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                )
                res.json({ accessToken })
            }
        }
    )
}

async function logout(req, res)
{
    res.clearCookie('jwt')
    res.json({'message': 'Logged Out Successfully!'})
}

module.exports = { customerLogin, adminLogin, deliveryLogin, refresh, logout }