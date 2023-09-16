const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')

async function getAdmins(req, res)
{
    const admins = await Admin.find().select('-password -__v').lean().exec()
    if(!admins || !admins?.length) return res.status(400).json({'message': 'No Admins Yet!'})
    res.status(200).json(admins)
}

async function addAdmin(req, res)
{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const duplicate = await Admin.findOne({ username }).lean().exec()
    if(duplicate) return res.status(400).json({'message': 'User Already Exists!'})

    const hashedPwd = await bcrypt.hash(password, 10)
    
    const createdAdmin = 
    {
        username,
        password: hashedPwd
    }

    const admin = await Admin.create(createdAdmin)
    admin ? res.status(200).json({'message': `Admin ${admin.username} Created Successfully!`})
          : res.status(400).json({'message': 'Something Went Wrong!'})
}

async function updateAdmin(req, res)
{
    const { id, username, password } = req.body
    if(!id || !username) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const admin = await Admin.findById(id).exec()
    if(!admin) return res.status(400).json({'message': 'Admin Does Not Exist!'})

    const duplicate = await Admin.findOne({ username }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(400).json({'message': 'Username Already Taken!'})

    if(password)
    {
        const hashedPwd = await bcrypt.hash(password, 10)
        admin.password = hashedPwd
    }
    admin.username = username

    const updatedAdmin = await admin.save()
    res.status(200).json({'message': `Admin ${updatedAdmin.username} Updated Successfully!`})
}

module.exports = { getAdmins, addAdmin, updateAdmin }