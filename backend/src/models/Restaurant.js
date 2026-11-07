const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Main' },
  isVeg: { type: Boolean, default: true },
  imageUrl: { type: String, default: '' }
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    deliveryTimeMins: { type: Number, default: 30 },
    priceForTwo: { type: Number, default: 300 },
    offer: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    address: { type: String, default: '' },
    menu: [menuItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
