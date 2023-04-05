const mongoose = require('mongoose');


// New set of rules for our data
const vendorSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String, 
    email: String, 
    password: String, 
    bio: String,
    instagram: String
})

module.exports = mongoose.model('Vendor', vendorSchema);