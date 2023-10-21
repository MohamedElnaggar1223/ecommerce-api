const Category = require('../models/Category')

async function getCategories(req, res)
{
    const categories = await Category.find().lean().exec()
    if(!categories || !categories?.length) return res.status(400).json({'message': 'No Categories Yet!'})
    res.status(200).json(categories)
}

async function getCategory(req, res)
{
    const { id } = req.params
    const category = await Category.findById(id).lean().exec()
    if(!category) return res.status(400).json({'message': 'Category Does Not Exist!'})
    res.status(200).json(category)
}

async function addCategory(req, res)
{
    const { category } = req.body
    if(!category) return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const createdCategory = await Category.create({ category })
    createdCategory ? res.status(200).json({'message': `Category ${createdCategory.category} Created Successfully!`})
                    : res.status(400).json({'message': 'Something Went Wrong!'})
}

module.exports = { getCategories, getCategory, addCategory }