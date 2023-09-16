const jwt = require('jsonwebtoken')

async function verifyDelivery(req, res, next)
{
    const headers = req.headers.authorization || req.headers.Authorization
    if(!headers?.startsWith('Bearer ')) return res.status(401).json({'message': 'Unauthorized By Server!'})

    const token = headers.split(' ')[1]
    jwt.verify(
        token, 
        //@ts-ignore
        process.env.ACCESS_TOKEN_SECRET, 
        async (err, decoded) => 
        {
            if(err) return res.status(403).json({'message': 'Forbiden By Server!'})

            //@ts-ignore
            if(decoded.UserInfo.delivery)
            {
                //@ts-ignore
                const { id, delivery, username, orders } = decoded.UserInfo

                req.deliveryId = id
                req.delivery = delivery
                req.username = username
                req.orders = orders

                next()
            }
        }
    )
}

module.exports = verifyDelivery