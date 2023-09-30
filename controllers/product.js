import productModel from "../models/Product.js";
import mongoose from 'mongoose';
import * as fs from 'fs';

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
    const { name, description, price, stockQuantity, idCategory } = req.body;

    try {

        const newProduct = new productModel({
            name,
            description,
            price,
            stockQuantity,
            image: req.imagePath,
            idCategory,
        });

        if (!Number.isInteger(newProduct.stockQuantity)) {
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
    try {
        const imageId = req.params.ID;
        const { name, description, idCategory, price, stockQuantity } = req.body;
        const imagePath = req.imagePath;

        // Find the product post in the database based on the ID
        const updateProduct = await productModel.findById(imageId);

        if (!updateProduct) {
            return res.status(404).json({ message: "product not found" });
        }

        // Get the previous image file path
        const previousImageFilePath = updateProduct.image;

        // Check if the previous image file exists
        if (fs.existsSync(previousImageFilePath)) {
            // Delete the previous image
            fs.unlinkSync(previousImageFilePath);
        } else {
            console.log("Previous image file does not exist:", previousImageFilePath);
        }

        // Update the product post fields
        updateProduct.name = name || updateProduct.name;
        updateProduct.description = description || updateProduct.description;
        updateProduct.price = price || updateProduct.price;
        updateProduct.stockQuantity = stockQuantity || updateProduct.stockQuantity;
        updateProduct.idCategory = idCategory || updateProduct.idCategory;
        updateProduct.image = imagePath;

        // Save the updated product post to the database
        await updateProduct.save();

        res.status(200).json({
            message: "product updated successfully",
            updateProduct,
        });
    } catch (error) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((error) => error.message);
            res.status(400).send({ status: 400, error: "Validation Error", message: validationErrors });
        } else {
            res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
        }
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
    const { ID } = req.params;

    try {
        const removeProduct = await productModel.findByIdAndDelete(ID);

        if (!removeProduct) {
            res.status(404).send({ status: 404, error: "Product not found" });
        } else {
            if (removeProduct.image) {
                fs.unlinkSync(removeProduct.image);
            }

            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}






export default { create, getAll, getById, update, deleteById }