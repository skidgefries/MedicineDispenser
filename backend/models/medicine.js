const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    time: { type: String, required: true },  // Example: "08:00 AM"
    taken: { type: Boolean, default: false } // Default is unchecked (false)
});

module.exports = mongoose.model('Medicine', MedicineSchema);
