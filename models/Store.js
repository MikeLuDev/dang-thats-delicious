const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

// Schema for handling Store table
const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [
      {
        type: Number,
        required: 'You must supply coordinates.',
      },
    ],
    address: {
      type: String,
      required: 'You must supply an address.',
    },
  },
  photo: String,
});


// Pre save hook for the schema 
storeSchema.pre('save', async function (next) {
  // If the schema wasn't modified, skip this
  if (!this.isModified('name')) return next();

  // Make slug
  this.slug = slug(this.name);

  // TODO: replace special characters with regular ones

  // Check if slug exists already
  // If it does, make a new unique slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`
  }

  // Go to next middlware
  next();

});

// Set 'storeSchema' as a model named 'Store'
module.exports = mongoose.model('Store', storeSchema);
