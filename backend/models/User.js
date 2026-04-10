const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    username:  { type: String, required: true, unique: true },
    phone:     { type: String, required: true },
    password:  { type: String, required: true },
    dateOfBirth:{ type: String, required: true },
    address:   { type: String, required: true },
    company:   { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
