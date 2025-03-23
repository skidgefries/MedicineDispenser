const cron = require('node-cron');
const Medicine = require('./models/medicine');

// Schedule job to reset medicine reminders at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    try {
        await Medicine.updateMany({}, { $set: { taken: false } });
        console.log('✅ Medicine reminders reset for the new day.');
    } catch (error) {
        console.error('❌ Error resetting reminders:', error);
    }
});
