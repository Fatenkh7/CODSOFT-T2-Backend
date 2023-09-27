import adminModel from "../models/Admin.js"
import bcrypt from "bcryptjs";


/**
 * @description Retrieve all admins
 * @route GET /api/admin
 * @access Public
 * @returns {Object[]} - An array containing all the admins.
 */
export async function getAll(req, res) {

    try {
        const admins = await adminModel.find({})
        if (!admins) {
            res.status(404).send({ status: 404, message: "Their is no admins!" })
        } else {
            res.status(200).send({ status: 200, data: admins })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}

/**
 * @description Retrieve an admin by ID
 * @route GET /api/admin/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the admins.
 * @returns {Object|null} - The user data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getAdmin = await adminModel.findById({ _id: ID })
        if (!getAdmin) {
            res.status(404).send({ status: 404, message: "User not found!" })
        } else {
            res.status(200).send({ status: 200, data: getAdmin })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}

/**
 * @description Create a new admin
 * @route POST /api/admin/add
 * @access Public
 * @param {Object} req.body - The request body containing admin information.
 * @param {string} req.body.firstName - First name of the admin.
 * @param {string} req.body.lastName - Last name of the admin.
 * @param {string} req.body.email - Email address of the admin.
 * @param {string} req.body.password - Password of the admin.
 * @param {string} req.body.phone - Phone number of the admin.
 * @param {string} req.body.userName - Username of the admin.
 * @returns {Object} - Admin data for the newly created admin.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { firstName, lastName, email, password, phone, userName } = req.body
    try {
        const newAdmin = await adminModel({ firstName, lastName, email, password, phone, userName });
        // Hash the password if provided
        if (password) {
            newAdmin.password = await bcrypt.hash(password, 10);
        }
        if (!newAdmin) {
            res.status(400).send({ status: 400, message: "Bad request" })
        } else {
            await newAdmin.save();
            res.status(201).send({ status: 201, message: "create succeflully", data: newAdmin })
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            if (err.keyPattern.email) {
                res.status(400).send({ status: 400, message: "Email address is already in use" });
            } else if (err.keyPattern.userName) {
                res.status(400).send({ status: 400, message: "Username is already taken" });
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
 * @description Update an admin by ID
 * @route PUT /api/admin/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the admin.
 * @param {Object} req.body - The request body containing admin information for updating.
 * @param {string} req.body.firstName - Updated first name of the admin.
 * @param {string} req.body.lastName - Updated last name of the admin.
 * @param {string} req.body.email - Updated email address of the admin.
 * @param {string} req.body.password - Updated password of the admin.
 * @param {string} req.body.phone - Updated phone number of the admin.
 * @param {string} req.body.userName - Username of the admin.
 * @returns {Object} - admin data for the updated admin.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function update(req, res) {
    const { ID } = req.params;
    const { firstName, lastName, email, phone, password, userName } = req.body;
    try {
        const updateAdmin = await adminModel.findByIdAndUpdate(ID, req.body, { new: true });
        if (!updateAdmin) {
            return res.status(404).send({
                error: true,
                message: "Admin not found",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "Admin data updated",
                data: updateAdmin,
            });
        }
    } catch (err) {
        if (err.code === 11000) {
            // Duplicate key error
            if (err.keyPattern.email) {
                res.status(400).send({ status: 400, message: "Email address is already in use" });
            } else if (err.keyPattern.userName) {
                res.status(400).send({ status: 400, message: "Username is already taken" });
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
 * @description Delete a admin by ID
 * @route DELETE /api/admin/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the admin to be deleted.
 * @returns {Object|null} - A success message if the admin is deleted, or null if the user is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeAdmin = await adminModel.findByIdAndDelete(ID)
        if (!removeAdmin) {
            res.status(404).send({ status: 404, error: "Admin not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


export default { getAll, getById, create, update, deleteById };
