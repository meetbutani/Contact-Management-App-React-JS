const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    avatar: {
        type: Boolean,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    jobPos: {
        type: String,
    },
    primPhone: {
        type: Number,
        required: true
    },
    secPhone: {
        type: Number,
    },
    primEmail: {
        type: String,
        required: true
    },
    secEmail: {
        type: String,
    },
    bio: {
        type: String,
    },
    bday: {
        type: String,
    },
    meeting: {
        type: String
    },
    facebook: {
        type: String,
    },
    pinterest: {
        type: String,
    },
    twitter: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    google: {
        type: String,
    },
    online: {
        type: String,
    },
}, { collection: 'contacts' });

module.exports = mongoose.model('Data', dataSchema);
