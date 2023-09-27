import mongoose from "mongoose";
const { Schema, model } = mongoose;

const ContactUsSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "First name cann't be empty"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last name cann't be empty"],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email cann't be empty"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        message: {
            type: String,
            trim: true,
        },
    },
    {
        collection: "ContactUs",
        timestamps: true
    }
);

/**
 * @description Data model for contactus page
 */
const contactus = model("ContactUs", ContactUsSchema);
export default contactus;