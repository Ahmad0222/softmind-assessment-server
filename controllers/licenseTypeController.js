import LicenseType from '../models/LicenseType.js';

// Create new license type
export const createLicenseType = async (req, res) => {
    try {
        const newLicenseType = await LicenseType.create(req.body);
        res.status(201).json(newLicenseType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all license types
export const getLicenseTypes = async (req, res) => {
    try {
        let licenseTypes = await LicenseType.find().lean();
        licenseTypes = licenseTypes.reverse(); // Reverse the order to show most recent first
        res.json(licenseTypes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update license type
export const updateLicenseType = async (req, res) => {
    try {
        const updatedLicenseType = await LicenseType.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(updatedLicenseType);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


export const deleteLicenseType = async (req, res) => {
    try {
        const deletedLicenseType = await LicenseType.findByIdAndDelete(req.params.id);
        if (!deletedLicenseType) {
            return res.status(404).json({ error: 'License type not found' });
        }
        res.json({ message: 'License type deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}