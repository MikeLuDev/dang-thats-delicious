// Import packages
const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

// Multer options
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: `That file type isn't allowed.` }, false);
    }
  },
};

// We're able to import the Store model here because it has been imported already in start.js
// And Mongoose is a singleton
const Store = mongoose.model('Store');

// Render home page
exports.homePage = (req, res) => {
  res.render('index');
};

// Render edit store page
exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // Check if there is no new file to resize
  if (!req.file) {
    next(); // Skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1]; // Get extension
  req.body.photo = `${uuid.v4()}.${extension}`; // Name photo for DB and write to req.body
  const photo = await jimp.read(req.file.buffer); // Read the file buffer for photo info
  await photo.resize(800, jimp.AUTO); // Resize photo
  await photo.write(`./public/uploads/${req.body.photo}`); // Write photo to directory
  next();
};

// Save new store to DB
exports.createStore = async (req, res) => {
  const store = await new Store(req.body).save();
  req.flash('succes', `Successfully created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  // Query db for a list of all stores
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
};

exports.editStore = async (req, res) => {
  // Find store with given ID
  const store = await Store.findOne({ _id: req.params.id });

  // TODO: Confirm they are the owner of the store

  // Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  // Set location to point
  req.body.location.type = 'Point';

  // Find and update store
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // Return updated data instead of old
    runValidators: true,
  }).exec();

  // Redirect user to store and tell them it worked
  req.flash(
    'success',
    `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a>`,
  );
  res.redirect(`/stores/${store.id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  // Find store with matching slug
  const store = await Store.findOne({ slug: req.params.slug });

  if (!store) return next();

  // Render store page
  res.render('store', { title: store.name, store });
};
