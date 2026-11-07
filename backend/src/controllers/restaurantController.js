const Restaurant = require('../models/Restaurant');
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/restaurants  (list, supports ?cuisine= & ?search=)
const getRestaurants = async (req, res) => {
  try {
    const { cuisine, search } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = new RegExp(escapeRegex(cuisine), 'i');
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: searchRegex }, { cuisine: searchRegex }, { 'menu.name': searchRegex }];
    }
    const restaurants = await Restaurant.find(filter).select('-menu');
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/restaurants/:id (with full menu)
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/restaurants (admin/seed use)
const createRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getRestaurants, getRestaurantById, createRestaurant };
