import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
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
    },
    {
        collection: "Category",
        timestamps: true
    }
);

/**
 * @description Data model for the category of the post
 */
const Category = model("Category", CategorySchema);
export default Category;