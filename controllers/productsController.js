const Product = require('../models/Product')
const Category = require('../models/Category')

async function getProducts(req, res)
{
    const { _start, _end, _sort, _order, title_like = '', categoryName = '' } = req.query

    const query = {}

    if(title_like)
    {
        query.title = {$regex: title_like, $options: 'i'}
    }

    if(categoryName != '')
    {
        query.categoryName = categoryName
    }

    const count = await Product.countDocuments({ query })

    const products = await Product
        .find(query)
        .limit(_end)
        .skip(_start)
        .sort({ [_sort]: _order })
        .select('-__v')
        .lean()
        .exec()

    if(!products || !products?.length) return res.status(200).json([])
    const allProds = products.map(prod => ({ id: prod._id, ...prod }))
    res.header('x-total-count', count)
    res.header('Access-Control-Expose-Headers', 'x-total-count')
    return res.status(200).json(allProds)
}

async function getProduct(req, res)
{
    const { id } = req.params
    const product = await Product.findById(id).select('-updatedAt -createdAt -__v -categoryName -category').lean()
    if(!product) return res.status(400).json({'message': 'Product Does Not Exist!'})
    // console.log({...product, category: Object.values(categories).map(cat => cat.category)})
    return res.status(200).json(product)
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
    console.log('entered')
    const { id } = req.params
    const { title, description, price, category, available, image, additionalInfo } = req.body
    // console.log(id, title, description, price, category, available)
    // console.log(title, description, price, category, available, image.slice(0, 15), additionalInfo)
    console.log(available)
    const newAdditionalInfo = {}
    additionalInfo.forEach(info => {
        newAdditionalInfo[Object.keys(info)[0]] = Object.values(info)[0]
    })

    if(!id || !title || !image || !description || !price || typeof price !== 'number' || !category || typeof available !== 'boolean') return res.status(400).json({'message': 'All Fields Must Be Given!'})
    
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({'message': 'Product Does Not Exist!'})

    // console.log(product)

    const duplicate = await Product.findOne({ title }).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(400).json({'message': 'Title Already Exists!'})

    // console.log(duplicate)
    const categoryChosen = await Category.findOne({ category }).lean().exec()
    if(!categoryChosen) return res.status(400).json({'message': 'Category Does Not Exist!'})

    // console.log(categoryChosen)

    if(!additionalInfo?.length)
    {
        await Product.findByIdAndUpdate(
            { _id: id },
            {
                title,
                description,
                category: categoryChosen,
                price,
                available,
                image,
            },
        );
    }
    else
    {
        await Product.findByIdAndUpdate(
            { _id: id },
            {
                title,
                description,
                category: categoryChosen,
                price,
                available,
                image,
                additionalInfo: newAdditionalInfo
            },
        );
    }

    // const updatedProduct = await product.save()

    // console.log(updatedProduct)
    return res.status(200).json({'message': `Product Updated Successfully!`})
}

async function deleteProduct(req, res)
{
    const { id } = req.params
    if(!id) return res.status(400).json({'message': 'ID Must Be Given!'})

    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({'message': 'Product Not Found!'})

    const deletedProduct = await product.deleteOne()
    res.status(200).json({'message': `Product ${deletedProduct.title} Deleted Successfully!`})
}

module.exports = { getProducts, getProduct, addProduct, updateProduct, deleteProduct }