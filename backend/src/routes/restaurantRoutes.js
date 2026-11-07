const express = require('express');
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', createRestaurant);

module.exports = router;
