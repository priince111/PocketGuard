const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        
    },

    amount: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },

    transactionType: {
        type: String,
        required: [true, "Transaction Type is required"],
        
    },

    date: {
        type: Date,
        required: [true, "Date is required"],
    },

    category: {
        type: String,
        required: [true, "Transaction Type is required"],
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    createdAt: {
        type: Date,
        default: new Date(),
    }

});


module.exports = mongoose.model('transaction',TransactionSchema);