const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Import higher order catch error function to wrap our routes in
const { catchErrors } = require('../handlers/errorHandlers');

// Routing
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
