import mongoose from "mongoose";
const { Schema, model } = mongoose

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "The name of the category cann't be empty"],
            trim: true,
            unique: [true, "This category is already excist it, please change it!"],
            exists: true,
        },
        description: {
            type: String,
            maxLength: [250, "the description is too long!"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "the price cann't be empty!"],
            min: 0.01,
            trim: true,
        },
        stockQuantity: {
            type: Number,
            required: true,
            trim: true,
            validate: {
                validator: Number.isInteger,
                message: "Stock quantity must be an integer",
            },
            min: [0, "Stock quantity cannot be negative"],
        },
        image: {
            type: String,
            required: [true, "Please enter the image"],
        },
        idCategory: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
    }, {
    collection: "Product",
    timestamps: true
});

const product = model('Product', productSchema)
export default product;