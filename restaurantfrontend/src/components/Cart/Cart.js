import React, { useState } from 'react';
import './Cart.css'; // Import your CSS file

function Cart() {
  // Create a state to keep track of item quantities
  const [itemQuantity, setItemQuantity] = useState(0);

  // Function to increment item quantity
  const addItem = () => {
    setItemQuantity(itemQuantity + 1);
  };

  // Function to decrement item quantity, but not below zero
  const removeItem = () => {
    if (itemQuantity > 0) {
      setItemQuantity(itemQuantity - 1);
    }
  };

  return (
    <div className="menu-item">
      <div className="item-name">Item Name</div>
      <div className="item-actions">
        <button className="action-button" onClick={removeItem}>-</button>
        <span className="item-quantity">{itemQuantity}</span>
        <button className="action-button" onClick={addItem}>+</button>
      </div>
      <div className="item-price">$9.99</div>
    </div>
  );
}

export default Cart;
