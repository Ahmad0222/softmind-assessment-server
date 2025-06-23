import mongoose from 'mongoose';

const licenseTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    renewalRules: [{
        jurisdiction: {
            state: String,
            county: String,
            city: String
        },
        timeline: {
            type: String,
            enum: ['annual_from_issue', 'fixed_calendar'],
            default: 'annual_from_issue'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('LicenseType', licenseTypeSchema);