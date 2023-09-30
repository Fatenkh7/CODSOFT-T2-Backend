import mongoose from "mongoose";
const { Schema, model } = mongoose;


const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "The name of the product can't be empty"],
            trim: true,
        },
        description: {
            type: String,
            maxLength: [250, "The description is too long!"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "The price can't be empty!"],
            min: [0.01, "Price cannot be less than 0.01"],
        },
        stockQuantity: {
            type: Number,
            required: [true, "The stock quantity is required"],
            min: [0, "Stock quantity cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} is not an integer value'
            }
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
    },
    {
        collection: "Product",
        timestamps: true,
    }
);

const product = model("Product", productSchema);
export default product;
