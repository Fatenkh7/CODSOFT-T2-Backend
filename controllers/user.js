import userModel from "../models/User.js"
import bcrypt from "bcryptjs";


/**
 * @description Retrieve all users
 * @route GET /api/user
 * @access Public
 * @returns {Object[]} - An array containing all the users.
 */
export async function getAll(req, res) {

    try {
        const users = await userModel.find({})
        if (!users) {
            res.status(404).send({ status: 404, message: "Their is no users!" })
        } else {
            res.status(200).send({ status: 200, data: users })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Retrieve a user by ID
 * @route GET /api/user/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the user.
 * @returns {Object|null} - The user data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getUser = await userModel.findById({ _id: ID })
        if (!getUser) {
            res.status(404).send({ status: 404, message: "User not found!" })
        } else {
            res.status(200).send({ status: 200, data: getUser })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}

/**
 * @description Create a new user
 * @route POST /api/user/add
 * @access Public
 * @param {Object} req.body - The request body containing user information.
 * @param {string} req.body.firstName - First name of the user.
 * @param {string} req.body.lastName - Last name of the user.
 * @param {string} req.body.email - Email address of the user.
 * @param {string} req.body.password - Password of the user.
 * @param {string} req.body.phone - Phone number of the user.
 * @param {string} req.body.country - Country of the user.
 * @param {string} req.body.address - Address of the user.
 * @returns {Object} - User data for the newly created user.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { firstName, lastName, email, password, phone, country, address } = req.body
    try {
        const newUser = await userModel({
            firstName,
            lastName,
            email,
            phone,
            password,
            country,
            address
        });
        // Hash the password if provided
        if (password) {
            newUser.password = await bcrypt.hash(password, 10);
        }
        if (!newUser) {
            res.status(400).send({ status: 400, message: "Bad request" })
        } else {
            await newUser.save();
            res.status(201).send({ status: 201, message: "create succeflully", data: newUser })
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            if (err.keyPattern.email) {
                res.status(400).send({ status: 400, message: "Email address is already in use" });
            } else if (err.keyPattern.phone) {
                res.status(400).send({ status: 400, message: "Phone number is already taken" });
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
 * @description Update a user by ID
 * @route PUT /api/user/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the user.
 * @param {Object} req.body - The request body containing user information for updating.
 * @param {string} req.body.firstName - Updated first name of the user.
 * @param {string} req.body.lastName - Updated last name of the user.
 * @param {string} req.body.email - Updated email address of the user.
 * @param {string} req.body.password - Updated password of the user.
 * @param {string} req.body.phone - Updated phone number of the user.
 * @param {string} req.body.country - Updated country of the user.
 * @param {string} req.body.address - Updated address of the user.
 * @returns {Object} - User data for the updated user.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function update(req, res) {
    const { ID } = req.params;
    const { firstName, lastName, email, phone, password, country, address } = req.body;
    try {
        const updateUser = await userModel.findByIdAndUpdate(ID, req.body, { new: true });
        if (!updateUser) {
            return res.status(404).send({
                error: true,
                message: "User not found",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "User data updated",
                data: updateUser,
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            if (err.keyPattern.email) {
                res.status(400).send({ status: 400, message: "Email address is already in use" });
            } else if (err.keyPattern.phone) {
                res.status(400).send({ status: 400, message: "Phone number is already taken" });
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
 * @description Delete a user by ID
 * @route DELETE /api/user/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the user to be deleted.
 * @returns {Object|null} - A success message if the user is deleted, or null if the user is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeUser = await userModel.findByIdAndDelete(ID)
        if (!removeUser) {
            res.status(404).send({ status: 404, error: "User not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


export default { getAll, getById, create, update, deleteById };
