const mongoose = require('mongoose');

//opportunity schema
const opportunitySchema = new mongoose.Schema({
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: [{ type: String }],
    type: { type: String, enum: ['Internship', 'Event'], required: true },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);