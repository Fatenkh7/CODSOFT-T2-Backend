import inboxModel from "../models/Inbox.js"

/**
 * @description Retrieve all inboex
 * @route GET /api/inbox
 * @access Public
 * @returns {Object[]} - An array containing all the inboxes.
 */
export async function getAll(req, res) {

    try {
        const inboxes = await inboxModel.find({})
        if (!inboxes) {
            res.status(404).send({ status: 404, message: "Their is no inboxes!" })
        } else {
            res.status(200).send({ status: 200, data: inboxes })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Retrieve an inbox by ID
 * @route GET /api/inbox/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the inbox message.
 * @returns {Object|null} - The inbox data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getInbox = await inboxModel.findById({ _id: ID })
        if (!getInbox) {
            res.status(404).send({ status: 404, message: "Inbox not found!" })
        } else {
            res.status(200).send({ status: 200, data: getInbox })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Create a new inbox
 * @route POST /api/inbox/add
 * @access Public
 * @param {Object} req.body - The request body containing inbox information.
 * @param {string} req.body.firstName - First name of the inbox.
 * @param {string} req.body.lastName - Last name of the inbox.
 * @param {string} req.body.email - Email address of the inbox.
 * @param {string} req.body.message - Message of the inbox.
 * @returns {Object} - Inbox data for the newly created inbox.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { firstName, lastName, email, message } = req.body
    try {
        const newInbox = await inboxModel({
            firstName,
            lastName,
            email,
            message
        });

        if (!newInbox) {
            res.status(400).send({ status: 400, message: "Something wrong!" })
        } else {
            await newInbox.save();
            res.status(204).send({ status: 204 })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Delete an inbox by ID
 * @route DELETE /api/inbox/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the inbox to be deleted.
 * @returns {Object|null} - A success message if the inbox is deleted, or null if the inbox is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeInbox = await inboxModel.findByIdAndDelete(ID)
        if (!removeInbox) {
            res.status(404).send({ status: 404, error: "Inbox not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


export default { getAll, getById, create, deleteById };




