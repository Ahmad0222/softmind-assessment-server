import express from 'express';
import {
    createClient,
    updateClient,
    getClients,
    deleteClient
} from '../controllers/clientController.js';
import {
    createUser,
    getUsers,
    assignClientToUser,
    getUserClients,
    deleteUser
} from '../controllers/userController.js';
import {
    createLicenseType,
    getLicenseTypes,
    updateLicenseType,
    deleteLicenseType
} from '../controllers/licenseTypeController.js';

const router = express.Router();

// Client CRUD routes
router.post('/clients', createClient);
router.put('/clients/:id', updateClient)
router.get('/clients', getClients);
router.delete('/clients/:id', deleteClient);

// License Type routes
router.post('/license-types', createLicenseType);
router.get('/license-types', getLicenseTypes);
router.put('/license-types/:id', updateLicenseType);
router.delete('/license-types/:id', deleteLicenseType);

// User routes
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id/clients', getUserClients);
router.delete('/users/:id', deleteUser);

// Assignment route
router.post('/assign/client/:clientId/to/:userId', assignClientToUser);

export default router;