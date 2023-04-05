const mongoose = require('mongoose');


// New set of rules for our data
const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    author: String, 
    text: String, 
    time: Date,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

// the productSchema (list of field names and the tdata type) represents the items in a single Product (record)
module.exports = mongoose.model('Comment', commentSchema);