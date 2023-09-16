const Product = require('../models/Product')
const Category = require('../models/Category')

async function getProducts(req, res)
{
    const products = await Product.find().lean().exec()
    if(!products || !products?.length) return res.status(400).json({'message': 'No Products Yet!'})
    res.status(200).json(products)
}

async function getProduct(req, res)
{
    const { id } = req.params
    const product = await Product.findById(id).lean().exec()
    if(!product) return res.status(400).json({'message': 'Product Does Not Exist!'})
    res.status(200).json(product)
}

async function addProduct(req, res)
{
    const { image, title, description, price, additionalInfo, category, available } = req.body
    if(!image || !title || !description || !price || typeof price !== 'number' || !category || typeof available !== 'boolean') return res.status(400).json({'message': 'All Fields Must Be Given!'})

    const categoryName = await Category.findById(category).lean().exec()
    if(!categoryName) res.status(400).json({'message': 'Category Not Found!'})

    const createdProduct = Object.keys(additionalInfo).length !== 0 
    ?
    {
        image,
        title,
        description,
        price,
        additionalInfo,
        category: categoryName,
        categoryName: categoryName?.category,
        available
    }
    :
    {
        image,
        title,
        description,
        price,
        category: categoryName,
        categoryName: categoryName?.category,
        available
    }

    const product = await Product.create(createdProduct)
    product ? res.status(200).json({'message': `Product ${product.title} Created Successfully!`})
            : res.status(400).json({'message': 'Something Went Wrong!'})
}

async function updateProduct(req, res)
{
    const { id, title, description, price, category, available } = req.body
    if(!id || !title || !description || !price || typeof price !== 'number' || !category || typeof available !== 'boolean') return res.status(400).json({'message': 'All Fields Must Be Given!'})
    
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({'message': 'Product Does Not Exist!'})

    const duplicate = await Product.findOne({ title }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(400).json({'message': 'Title Already Exists!'})

    const categoryChosen = await Category.findById(category).lean().exec()
    if(!categoryChosen) return res.status(400).json({'message': 'Category Does Not Exist!'})

    product.title = title
    product.description = description
    product.price = price
    product.available = available
    product.category = category
    product.categoryName = categoryChosen.category

    const updatedProduct = await product.save()
    res.status(200).json({'message': `Product ${updatedProduct.title} Updated Successfully!`})
}

async function deleteProduct(req, res)
{
    const { id } = req.body
    if(!id) return res.status(400).json({'message': 'ID Must Be Given!'})

    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({'message': 'Product Not Found!'})

    const deletedProduct = await product.deleteOne()
    res.status(200).json({'message': `Product ${deletedProduct.title} Deleted Successfully!`})
}

module.exports = { getProducts, getProduct, addProduct, updateProduct, deleteProduct }