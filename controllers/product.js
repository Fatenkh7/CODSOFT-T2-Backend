import productModel from "../models/Product.js";
import mongoose from 'mongoose';

/**
 * @description Retrieve all the products
 * @route GET /api/product
 * @access Public
 * @returns {Object[]} - An array containing all the products.
 */
export async function getAll(req, res) {

    try {
        const product = await productModel.find({})
        if (!product) {
            res.status(404).send({ status: 404, message: "Their is no products!" })
        } else {
            res.status(200).send({ status: 200, data: product })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Retrieve a product by ID
 * @route GET /api/product/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the products.
 * @returns {Object|null} - The product data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getProduct = await productModel.findById({ _id: ID })
        if (!getProduct) {
            res.status(404).send({ status: 404, message: "Product not found!" })
        } else {
            res.status(200).send({ status: 200, data: getProduct })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}

/**
 * @description Create a new product
 * @route POST /api/product/add
 * @access Public
 * @param {Object} req.body - The request body containing product information.
 * @param {string} req.body.name - Name of the product.
 * @param {string} req.body.description - Description of the product.
 * @param {number} req.body.price - Price of the product.
 * @param {number} req.body.stockQuantity - Stock quantity of the product.
 * @param {string} req.body.image - Image URL of the product.
 * @param {string} req.body.idCategory - ID of the category associated with the product.
 * @returns {Object} - Product data for the newly created product.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { name, description, price, stockQuantity, image, idCategory } = req.body;

    try {

        const newProduct = new productModel({
            name,
            description,
            price,
            stockQuantity,
            image,
            idCategory,
        });

        if (!Number.isInteger(newProduct.stockQuantity) || typeof stockQuantity !== 'number') {
            res.status(400).send({ status: 400, error: "Validation Error", message: 'Stock quantity must be a Number' });
        } else {
            await newProduct.save();
            res.status(201).send({ status: 201, message: "Created successfully", data: newProduct });
        }
    } catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            res.status(400).send({ status: 400, error: "Validation Error", message: validationErrors });
        } else {
            res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
        }
    }
}

/**
 * @description Update a product by ID
 * @route PUT /api/product/:ID
 * @access Public
 * @param {Object} req.body - The request body containing product information.
 * @param {string} req.body.name - Name of the product.
 * @param {string} req.body.description - Description of the product.
 * @param {number} req.body.price - Price of the product.
 * @param {number} req.body.stockQuantity - Stock quantity of the product.
 * @param {string} req.body.image - Image URL of the product.
 * @param {string} req.body.idCategory - ID of the category associated with the product.
 * @returns {Object} - Product data for the updated product.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function update(req, res) {
    const { ID } = req.params;
    const { name, description, price, stockQuantity, image, idCategory } = req.body;

    // Check if stockQuantity is a number
    if (isNaN(stockQuantity) || typeof stockQuantity !== 'number') {
        return res.status(400).send({ status: 400, error: "Validation Error", message: 'Stock quantity must be a Number' });
    }

    try {
        const updateProduct = await productModel.findByIdAndUpdate(ID, {
            name,
            description,
            price,
            stockQuantity,
            image,
            idCategory,
        }, { new: true });

        if (!updateProduct) {
            return res.status(404).send({
                error: true,
                message: "Product not found",
            });
        }

        const validationResult = updateProduct.validateSync();

        if (validationResult) {
            const validationErrors = Object.values(validationResult.errors).map((error) => error.message);
            res.status(400).send({ status: 400, message: "Validation error", errors: validationErrors });
        } else {
            res.status(200).send({
                status: 200,
                message: "Product data updated",
                data: updateProduct,
            });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Delete a product by ID
 * @route DELETE /api/product/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the product to be deleted.
 * @returns {Object|null} - A success message if the product is deleted, or null if the product is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeProduct = await productModel.findByIdAndDelete(ID)
        if (!removeProduct) {
            res.status(404).send({ status: 404, error: "Product not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}






export default { create, getAll, getById, update, deleteById }