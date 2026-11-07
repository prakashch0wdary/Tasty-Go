require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./src/models/Restaurant');

const sampleData = [
  {
    name: 'Spice Route',
    cuisine: 'North Indian',
    rating: 4.6,
    deliveryTimeMins: 32,
    priceForTwo: 500,
    offer: '20% off up to ₹125',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=85',
    address: 'MG Road, Bengaluru',
    menu: [
      { name: 'Butter Chicken', price: 320, category: 'Main', isVeg: false },
      { name: 'Paneer Tikka', price: 240, category: 'Starter', isVeg: true },
      { name: 'Dal Makhani', price: 210, category: 'Main', isVeg: true },
      { name: 'Garlic Naan', price: 55, category: 'Bread', isVeg: true },
      { name: 'Gulab Jamun', price: 100, category: 'Dessert', isVeg: true }
    ]
  },
  {
    name: 'Pizza Planet',
    cuisine: 'Italian',
    rating: 4.4,
    deliveryTimeMins: 24,
    priceForTwo: 450,
    offer: 'Free garlic bread on orders over ₹499',
    imageUrl: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85',
    address: 'Brigade Road, Bengaluru',
    menu: [
      { name: 'Margherita Pizza', price: 279, category: 'Pizza', isVeg: true },
      { name: 'Pepperoni Pizza', price: 369, category: 'Pizza', isVeg: false },
      { name: 'Farmhouse Pizza', price: 329, category: 'Pizza', isVeg: true },
      { name: 'Garlic Bread', price: 139, category: 'Sides', isVeg: true },
      { name: 'Tiramisu', price: 189, category: 'Dessert', isVeg: true }
    ]
  },
  {
    name: 'Dragon Wok',
    cuisine: 'Chinese',
    rating: 4.3,
    deliveryTimeMins: 28,
    priceForTwo: 400,
    offer: '₹100 off your first order',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85',
    address: 'Indiranagar, Bengaluru',
    menu: [
      { name: 'Veg Hakka Noodles', price: 199, category: 'Main', isVeg: true },
      { name: 'Chilli Chicken', price: 279, category: 'Main', isVeg: false },
      { name: 'Veg Manchurian', price: 189, category: 'Starter', isVeg: true },
      { name: 'Crispy Spring Rolls', price: 159, category: 'Starter', isVeg: true },
      { name: 'Schezwan Fried Rice', price: 219, category: 'Main', isVeg: true }
    ]
  },
  {
    name: 'Dosa District',
    cuisine: 'South Indian',
    rating: 4.7,
    deliveryTimeMins: 20,
    priceForTwo: 250,
    offer: '20% off up to ₹100',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=85',
    address: 'Jayanagar, Bengaluru',
    menu: [
      { name: 'Classic Masala Dosa', price: 129, category: 'Dosa', isVeg: true },
      { name: 'Mysore Masala Dosa', price: 159, category: 'Dosa', isVeg: true },
      { name: 'Idli Vada Combo', price: 99, category: 'Breakfast', isVeg: true },
      { name: 'Rava Onion Dosa', price: 149, category: 'Dosa', isVeg: true },
      { name: 'Filter Coffee', price: 49, category: 'Drinks', isVeg: true }
    ]
  },
  {
    name: 'Burger Barn',
    cuisine: 'Burgers',
    rating: 4.2,
    deliveryTimeMins: 26,
    priceForTwo: 350,
    offer: 'Buy 1 get 1 on selected burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    address: 'Koramangala, Bengaluru',
    menu: [
      { name: 'Classic Smash Burger', price: 229, category: 'Burgers', isVeg: false },
      { name: 'Crispy Veg Burger', price: 179, category: 'Burgers', isVeg: true },
      { name: 'BBQ Chicken Burger', price: 259, category: 'Burgers', isVeg: false },
      { name: 'Loaded Fries', price: 149, category: 'Sides', isVeg: true },
      { name: 'Chocolate Shake', price: 129, category: 'Drinks', isVeg: true }
    ]
  },
  {
    name: 'Sushi Story',
    cuisine: 'Japanese',
    rating: 4.5,
    deliveryTimeMins: 38,
    priceForTwo: 700,
    offer: 'Flat ₹150 off above ₹699',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85',
    address: 'Indiranagar, Bengaluru',
    menu: [
      { name: 'California Roll', price: 349, category: 'Sushi', isVeg: false },
      { name: 'Avocado Cucumber Roll', price: 299, category: 'Sushi', isVeg: true },
      { name: 'Chicken Teriyaki Bowl', price: 379, category: 'Bowls', isVeg: false },
      { name: 'Edamame', price: 179, category: 'Sides', isVeg: true },
      { name: 'Miso Soup', price: 129, category: 'Sides', isVeg: true }
    ]
  },
  {
    name: 'Taco Tales',
    cuisine: 'Mexican',
    rating: 4.1,
    deliveryTimeMins: 30,
    priceForTwo: 400,
    offer: 'Free nachos with every combo',
    imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=900&q=85',
    address: 'HSR Layout, Bengaluru',
    menu: [
      { name: 'Paneer Tacos', price: 219, category: 'Tacos', isVeg: true },
      { name: 'Chicken Burrito Bowl', price: 289, category: 'Bowls', isVeg: false },
      { name: 'Veg Quesadilla', price: 239, category: 'Mains', isVeg: true },
      { name: 'Loaded Nachos', price: 199, category: 'Sides', isVeg: true },
      { name: 'Churros', price: 149, category: 'Dessert', isVeg: true },
      { name: 'Beef Barbacoa Tacos', price: 269, category: 'Tacos', isVeg: false },
      { name: 'Black Bean Burrito', price: 229, category: 'Burritos', isVeg: true },
      { name: 'Chicken Street Corn Bowl', price: 279, category: 'Bowls', isVeg: false },
      { name: 'Cheese Enchiladas', price: 249, category: 'Mains', isVeg: true },
      { name: 'Guacamole & Chips', price: 169, category: 'Sides', isVeg: true },
      { name: 'Tres Leches Cake', price: 159, category: 'Dessert', isVeg: true }
    ]
  },
  {
    name: 'Green Bowl Co.',
    cuisine: 'Healthy',
    rating: 4.6,
    deliveryTimeMins: 22,
    priceForTwo: 450,
    offer: '15% off fresh picks',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    address: 'Whitefield, Bengaluru',
    menu: [
      { name: 'Rainbow Power Bowl', price: 279, category: 'Bowls', isVeg: true },
      { name: 'Grilled Chicken Salad', price: 329, category: 'Salads', isVeg: false },
      { name: 'Avocado Toast', price: 249, category: 'Breakfast', isVeg: true },
      { name: 'Berry Smoothie', price: 179, category: 'Drinks', isVeg: true },
      { name: 'Roasted Veg Wrap', price: 229, category: 'Wraps', isVeg: true }
    ]
  },
  {
    name: 'Chai & Chaat',
    cuisine: 'Street Food',
    rating: 4.4,
    deliveryTimeMins: 18,
    priceForTwo: 200,
    offer: 'Free chai on orders above ₹299',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
    address: 'Malleshwaram, Bengaluru',
    menu: [
      { name: 'Pani Puri', price: 79, category: 'Chaat', isVeg: true },
      { name: 'Aloo Tikki Chaat', price: 119, category: 'Chaat', isVeg: true },
      { name: 'Pav Bhaji', price: 149, category: 'Mains', isVeg: true },
      { name: 'Masala Chai', price: 49, category: 'Drinks', isVeg: true },
      { name: 'Samosa (2 pcs)', price: 69, category: 'Snacks', isVeg: true }
    ]
  },
  {
    name: 'Saffron Table',
    cuisine: 'North Indian',
    rating: 4.5,
    deliveryTimeMins: 29,
    priceForTwo: 480,
    offer: '15% off your first order',
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=85',
    address: 'UB City, Bengaluru',
    menu: [
      { name: 'Smoky Paneer Tikka', price: 249, category: 'Starter', isVeg: true },
      { name: 'Chicken Biryani', price: 299, category: 'Main', isVeg: false },
      { name: 'Butter Kulcha', price: 69, category: 'Bread', isVeg: true }
    ]
  },
  {
    name: 'Oven & Olive',
    cuisine: 'Italian',
    rating: 4.3,
    deliveryTimeMins: 27,
    priceForTwo: 520,
    offer: 'Free dessert on orders over ₹599',
    imageUrl: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85',
    address: 'Church Street, Bengaluru',
    menu: [
      { name: 'Four Cheese Pizza', price: 349, category: 'Pizza', isVeg: true },
      { name: 'Pesto Chicken Pasta', price: 329, category: 'Pasta', isVeg: false },
      { name: 'Classic Bruschetta', price: 179, category: 'Starter', isVeg: true }
    ]
  },
  {
    name: 'Wok & Roll',
    cuisine: 'Chinese',
    rating: 4.2,
    deliveryTimeMins: 25,
    priceForTwo: 380,
    offer: '₹75 off on orders over ₹299',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=900&q=85',
    address: 'Jeevan Bima Nagar, Bengaluru',
    menu: [
      { name: 'Crispy Chilli Potatoes', price: 179, category: 'Starter', isVeg: true },
      { name: 'Chicken Hakka Noodles', price: 249, category: 'Main', isVeg: false },
      { name: 'Schezwan Paneer', price: 219, category: 'Main', isVeg: true }
    ]
  },
  {
    name: 'Madras Tiffin House',
    cuisine: 'South Indian',
    rating: 4.6,
    deliveryTimeMins: 19,
    priceForTwo: 230,
    offer: 'Free filter coffee with breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=85',
    address: 'Basavanagudi, Bengaluru',
    menu: [
      { name: 'Ghee Podi Idli', price: 119, category: 'Breakfast', isVeg: true },
      { name: 'Paper Masala Dosa', price: 159, category: 'Dosa', isVeg: true },
      { name: 'Ven Pongal', price: 109, category: 'Breakfast', isVeg: true }
    ]
  },
  {
    name: 'Stack’d Burger Co.',
    cuisine: 'Burgers',
    rating: 4.4,
    deliveryTimeMins: 23,
    priceForTwo: 390,
    offer: 'Buy 1 get 1 on veggie burgers',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
    address: 'Sarjapur Road, Bengaluru',
    menu: [
      { name: 'Double Smash Burger', price: 289, category: 'Burgers', isVeg: false },
      { name: 'Crispy Corn Burger', price: 199, category: 'Burgers', isVeg: true },
      { name: 'Truffle Cheese Fries', price: 169, category: 'Sides', isVeg: true }
    ]
  },
  {
    name: 'Fresh Field Kitchen',
    cuisine: 'Healthy',
    rating: 4.5,
    deliveryTimeMins: 21,
    priceForTwo: 420,
    offer: '10% off all nourishing bowls',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
    address: 'Bellandur, Bengaluru',
    menu: [
      { name: 'Roasted Veggie Grain Bowl', price: 269, category: 'Bowls', isVeg: true },
      { name: 'Lemon Herb Chicken Salad', price: 319, category: 'Salads', isVeg: false },
      { name: 'Mango Yogurt Smoothie', price: 159, category: 'Drinks', isVeg: true }
    ]
  }
];

const menuImages = {
  'North Indian': [
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Italian: [
    'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Chinese: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  'South Indian': [
    'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Burgers: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Japanese: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Mexican: [
    'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  Healthy: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=320&h=240&q=80'
  ],
  'Street Food': [
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=320&h=240&q=80',
    'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=320&h=240&q=80'
  ]
};

sampleData.forEach((restaurant) => {
  const images = menuImages[restaurant.cuisine] || [];
  restaurant.menu.forEach((item, index) => {
    item.imageUrl = images[index % images.length] || restaurant.imageUrl;
  });
});

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodie';
  await mongoose.connect(mongoUri);
  await Restaurant.bulkWrite(
    sampleData.map((restaurant) => ({
      updateOne: {
        filter: { name: restaurant.name },
        update: { $set: restaurant },
        upsert: true
      }
    }))
  );
  console.log('Sample restaurants added or updated');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
