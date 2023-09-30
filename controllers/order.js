import orderModel from "../models/Order.js"


/**
 * @description Retrieve all the orders
 * @route GET /api/order
 * @access Public
 * @returns {Object[]} - An array containing all the orders.
 */
export async function getAll(req, res) {

    try {
        const orders = await orderModel.find({})
        if (!orders) {
            res.status(404).send({ status: 404, message: "Their is no orders!" })
        } else {
            res.status(200).send({ status: 200, data: orders })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Retrieve an order by ID
 * @route GET /api/order/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the orders.
 * @returns {Object|null} - The order data if found, or null if not found.
 */
export async function getById(req, res) {
    const { ID } = req.params
    try {
        const getOrder = await orderModel.findById({ _id: ID })
        if (!getOrder) {
            res.status(404).send({ status: 404, message: "order not found!" })
        } else {
            res.status(200).send({ status: 200, data: getOrder })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}


/**
 * @description Create a new order
 * @route POST /api/order/add
 * @access Public
 * @param {Object} req.body - The request body containing order information.
 * @param {string} req.body.orderItems - The orderItems of the order.
 * @param {string} req.body.idUser - The idUser of the order.
 * @param {string} req.body.shippingAddress - The shippingAddress of the order.
 * @param {string} req.body.paymentMethod - The paymentMethod of the order.
 * @param {string} req.body.totalPrice - The totalPrice of the order.
 * @returns {Object} - Order data for the newly created order.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function create(req, res) {
    const { orderItems, idUser, shippingAddress, paymentMethod, totalPrice } = req.body;

    try {
        // Validate orderItems format (array of objects with idProduct and quantity)
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).send({ status: 400, error: "Validation Error", message: "OrderItems must be a non-empty array of objects." });
        }

        // Validate that each orderItem has idProduct and quantity
        for (const item of orderItems) {
            if (!item.idProduct || !item.quantity || item.quantity < 1) {
                return res.status(400).send({ status: 400, error: "Validation Error", message: "Each orderItem must have idProduct and quantity." });
            }
        }

        // Create a new order document
        const newOrder = new orderModel({
            orderItems,
            idUser,
            shippingAddress,
            paymentMethod,
            totalPrice,
        });

        // Save the new order to the database
        await newOrder.save();

        res.status(201).send({ status: 201, data: newOrder });
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
 * @description Update an order by ID
 * @route PUT /api/order/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the order.
 * @param {Object} req.body - The request body containing order information.
 * @param {string} req.body.orderItems - The orderItems of the order.
 * @param {string} req.body.idUser - The idUser of the order.
 * @param {string} req.body.shippingAddress - The shippingAddress of the order.
 * @param {string} req.body.paymentMethod - The paymentMethod of the order.
 * @param {string} req.body.totalPrice - The totalPrice of the order.
 * @returns {Object} - order data for the updated order.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function update(req, res) {
    const { ID } = req.params;
    const { orderItems, idUser, shippingAddress, paymentMethod, totalPrice } = req.body;
    try {
        // Validate orderItems format (array of objects with idProduct and quantity)
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).send({ status: 400, error: "Validation Error", message: "OrderItems must be a non-empty array of objects." });
        }

        // Validate that each orderItem has idProduct and quantity
        for (let i = 0; i < orderItems.length; i++) {
            const item = orderItems[i];
            if (!item.idProduct || !item.quantity || item.quantity < 1) {
                return res.status(400).send({ status: 400, error: "Validation Error", message: `Invalid orderItem at index ${i}. Each orderItem must have idProduct and quantity.` });
            }
        }

        const updateOrder = await orderModel.findByIdAndUpdate(ID, { orderItems, idUser, shippingAddress, paymentMethod, totalPrice }, { new: true });

        if (!updateOrder) {
            return res.status(404).send({
                error: true,
                message: "Order not found",
            });
        } else {
            res.status(200).send({
                status: 200,
                message: "Order data updated",
                data: updateOrder,
            });
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            // Mongoose validation error occurred
            const validationErrors = {};

            // Extract validation errors for each field
            for (const field in err.errors) {
                validationErrors[field] = err.errors[field].message;
            }

            res.status(400).send({ status: 400, message: "Validation error", errors: validationErrors });
        } else {
            res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
        }
    }
}


/**
 * @description Delete an order by ID
 * @route DELETE /api/order/:ID
 * @access Public
 * @param {string} ID - The unique identifier of the order to be deleted.
 * @returns {Object|null} - A success message if the order is deleted, or null if the order is not found.
 * @throws {Object} - Error object with details if an error occurs.
 */
export async function deleteById(req, res) {
    const { ID } = req.params
    try {
        const removeOrder = await orderModel.findByIdAndDelete(ID)
        if (!removeOrder) {
            res.status(404).send({ status: 404, error: "order not found" });
        } else {
            res.status(204).send({ status: 204 });
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: "Internal Server Error", message: err.message });
    }
}



export default { getAll, getById, create, update, deleteById }