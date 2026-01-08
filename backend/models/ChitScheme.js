const mongoose = require('mongoose');

const ChitSchemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a scheme name'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    totalAmount: {
        type: Number,
        required: [true, 'Please add a total amount']
    },
    installmentAmount: {
        type: Number,
        required: [true, 'Please add an installment amount']
    },
    durationMonths: {
        type: Number,
        required: [true, 'Please add duration in months']
    },
    description: {
        type: String,
        maxlength: [500, 'Description can not be more than 500 characters']
    },
    nextDueDate: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChitScheme', ChitSchemeSchema);
