import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RestaurantList from './components/RestaurantList';
import MenuPage from './components/MenuPage';
import Cart from './components/Cart';
import Login from './components/Login';
import MyOrders from './components/MyOrders';

export default function App() {
  const [cart, setCart] = useState([]);

  return (
    <BrowserRouter>
      <Navbar cart={cart} />
      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/restaurant/:id" element={<MenuPage cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
