const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    newId: {
        type: Number,
        required: true
    }
}, { collection: 'counters' });

module.exports = mongoose.model('Counter', counterSchema);
