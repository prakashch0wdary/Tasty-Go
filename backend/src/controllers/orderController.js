const Order = require('../models/Order');

// POST /api/orders (protected)
const createOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress } = req.body;
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    const order = await Order.create({
      user: req.userId,
      restaurant,
      items,
      totalAmount,
      deliveryAddress
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/orders/my (protected)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('restaurant', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getMyOrders };
