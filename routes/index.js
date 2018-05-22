const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Import higher order catch error function to wrap our routes in
const { catchErrors } = require('../handlers/errorHandlers');

// Routing
router.get('/', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);

router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore),
);

module.exports = router;
