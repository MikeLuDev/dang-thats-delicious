// Import mongoose
const mongoose = require('mongoose');

// We're able to import the Store model here because it has been imported already in start.js
// And Mongoose is a singleton
const Store = mongoose.model('Store');

// Render home page
exports.homePage = (req, res) => {
  res.render('index')
}

// Render edit store page
exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
}

// Save new store to DB
exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  res.redirect('/');
}