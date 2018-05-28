const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Import higher order catch error function to wrap our routes in
const { catchErrors } = require('../handlers/errorHandlers');

// Routing
router.get('/', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/tags', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

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

router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login,
);

router.post('/login');

module.exports = router;
