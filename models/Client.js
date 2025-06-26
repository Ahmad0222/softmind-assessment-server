import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
    // Core client info
    clientName: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },

    licenses: [
        {
            licenseType: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'LicenseType',
                required: true,
            },
            renewalDate: {
                type: Date,
                required: true,
            },
            jurisdiction: {
                state: { type: String },
                county: { type: String },
                city: { type: String },
            }
        }
    ],
    existingLicenses: {
        type: [String], // Array of selected license/doc names
        default: [],
    },




    // Jurisdiction tracking
    jurisdiction: {
        state: String,
        county: String,
        city: String,
        postalCode: String,
    },

    // Reminder tracking
    remindersSent: {
        90: { type: Boolean, default: false },
        60: { type: Boolean, default: false },
        30: { type: Boolean, default: false },
        7: { type: Boolean, default: false },
    },

    // Assignment to user
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now,
    },
    source: {
        type: String,
        enum: ['manual', 'webhook'],
        default: 'manual',
    },

    businessName: {
        type: String,
    },

    ein: {
        type: String,
    },
    strPropertyAddress: {
        type: String,
    },
    notes: {
        type: String,
    },
});

export default mongoose.model('Client', ClientSchema);