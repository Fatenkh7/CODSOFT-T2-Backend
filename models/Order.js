import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OrderSchema = new Schema(
    {
        idUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderItems: [
            {
                idProduct: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        shippingAddress: {
            type: String,
            required: [true,"Please the adress cann't be empty!"]
        },
        paymentMethod: {
            type: String,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0.01,
        },
    }, {
    collection: "Order",
    timestamps: true
})

const order = model("Order", OrderSchema)
export default order