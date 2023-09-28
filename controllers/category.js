import categoryModel from "../models/Category.js"

/**
 * @description Retrieve all the categories
 * @route GET /api/category
 * @access Public
 * @returns {Object[]} - An array containing all the categories.
 */
export async function getAll(req, res) {

    try {
        const categories = await categoryModel.find({})
        if (!categories) {
            res.status(404).send({ status: 404, message: "Their is no categories!" })
        } else {
            res.status(200).send({ status: 200, data: categories })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Retrieve a category by ID
 * @route GET /api/category/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the category.
 * @returns {Object|null} - The category data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getCategory = await categoryModel.findById({ _id: ID })
        if (!getCategory) {
            res.status(404).send({ status: 404, message: "Category not found!" })
        } else {
            res.status(200).send({ status: 200, data: getCategory })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Create a new category
 * @route POST /api/category/add
 * @access Public
 * @param {Object} req.body - The request body containing category information.
 * @param {string} req.body.name - The name of the category.
 * @param {string} req.body.description - The description of the category.
 * @returns {Object} - category data for the newly created category.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { name, description } = req.body
    try {
        const newCategory = await categoryModel({
            name, description
        });

        if (!newCategory) {
            res.status(400).send({ status: 400, message: "Something wrong!" })
        } else {
            await newCategory.save();
            res.status(201).send({ status: 201, data: newCategory })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}



/**
 * @description Update a category by ID
 * @route PUT /api/category/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the category.
 * @param {Object} req.body - The request body containing category information.
 * @param {string} req.body.name - The name of the category.
 * @param {string} req.body.description - The description of the category
 * @returns {Object} - category data for the updated category.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function update(req, res) {
    const { ID } = req.params;
    const { name, description } = req.body;
    try {
        const updateCategory = await userModel.findByIdAndUpdate(ID, { name, description }, { new: true });
        if (!updateCategory) {
            return res.status(404).send({
                error: true,
                message: "Category not found",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "Category data updated",
                data: updateCategory,
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            if (err.keyPattern.name) {
                res.status(400).send({ status: 400, message: "Name is already in use" });
            } else {
                res.status(400).send({ status: 400, message: "Duplicate key error", error: err.message });
            }
        } else if (err.name === "ValidationError") {
            // Mongoose validation error occurred
            const validationErrors = {};

            // Extract validation errors for each field
            for (const field in err.errors) {
                validationErrors[field] = err.errors[field].message;
            }

            res.status(400).send({ status: 400, message: "Validation error", errors: validationErrors });
        } else {
            // Other error (e.g., internal server error)
            res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
        }
    }
}

/**
 * @description Delete a category by ID
 * @route DELETE /api/category/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the category to be deleted.
 * @returns {Object|null} - A success message if the category is deleted, or null if the inbox is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeCategory = await categoryModel.findByIdAndDelete(ID)
        if (!removeCategory) {
            res.status(404).send({ status: 404, error: "Category not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


export default { getAll, getById, create, update, deleteById };




