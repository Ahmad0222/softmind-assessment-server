import mongoose from 'mongoose';

const licenseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    state: String,
    county: String,
    city: String,
    timeline: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('LicenseType', licenseTypeSchema);