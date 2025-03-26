const express = require('express');

const Medicine = require('../models/medicine');

const router = express.Router();

// Add Medicine
router.post('/medicine', async (req, res) => {
    const { userId, name, time } = req.body;
    try {
        // Convert userId to a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId format" });
        }

        const newMedicine = new Medicine({
            userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
            name,
            time,
        });

        await newMedicine.save();
        res.status(201).json({ message: "Medicine added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// User ko med display
router.get('/medicines/:userId', async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.params.userId });
        res.json(medicines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
