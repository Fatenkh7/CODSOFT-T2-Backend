import mongoose from "mongoose";
const { Schema, model } = mongoose;

const AdminSchema = new Schema(
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
        userName: {
            type: String,
            required: [true, "Username cann't be empty"],
            unique: [true, "This username is already take it, please change it!"],
            trim: true,
            minLength: [4, "the Username is too short!"],
            maxLength: [15, "the Username is too long!"],
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email cann't be empty"],
            unique: [true, "An admin is already registered with this email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: [8, "the password is too short!"],
            maxLength: [80, "the password is too long!"],
        },
        phone: {
            type: String,
            required: [true, "please enter your phone number"],
            unique: [true, "An admin is already registered with this phone number"],
            trim: true,
            match: [/^[0-9\s+-]*$/, "Please fill a valid phone number"],
        },

    },
    {
        collection: "Admin",
        timestamps: true
    }
);

/**
 * @description Data model for admins account
 */
const Admin = model("Admin", AdminSchema);
export default Admin;