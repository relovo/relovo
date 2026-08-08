import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Cart from "./components/Cart";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Addresses from "./pages/Addresses";

import Admin from "./pages/Admin";
import AdminProducts from "./pages/AdminProducts";
import AdminNewProduct from "./pages/AdminNewProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminDeliverySlots from "./pages/AdminDeliverySlots";


function App() {

  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);


  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  function addToCart(product) {

    setCart(currentCart => {

      const existing = currentCart.find(
        item => item.id === product.id
      );


      if (existing) {

        return currentCart.map(item =>

          item.id === product.id

            ? {
                ...item,
                quantity: item.quantity + 1
              }

            : item

        );

      }


      return [
        ...currentCart,

        {
          ...product,
          quantity: 1
        }

      ];

    });

  }


  // --------------------------------------------------
  // INCREASE QUANTITY
  // --------------------------------------------------

  function increaseQuantity(id) {

    setCart(currentCart =>

      currentCart.map(item =>

        item.id === id

          ? {
              ...item,
              quantity: item.quantity + 1
            }

          : item

      )

    );

  }


  // --------------------------------------------------
  // DECREASE QUANTITY
  // --------------------------------------------------

  function decreaseQuantity(id) {

    setCart(currentCart =>

      currentCart
        .map(item =>

          item.id === id

            ? {
                ...item,
                quantity: item.quantity - 1
              }

            : item

        )
        .filter(item => item.quantity > 0)

    );

  }


  // --------------------------------------------------
  // REMOVE FROM CART
  // --------------------------------------------------

  function removeFromCart(id) {

    setCart(currentCart =>

      currentCart.filter(
        item => item.id !== id
      )

    );

  }


  // --------------------------------------------------
  // UPDATE QUANTITY
  // --------------------------------------------------

  function updateQuantity(id, quantity) {

    if (quantity <= 0) {

      removeFromCart(id);

      return;

    }


    setCart(currentCart =>

      currentCart.map(item =>

        item.id === id

          ? {
              ...item,
              quantity
            }

          : item

      )

    );

  }


  // --------------------------------------------------
  // CLEAR CART
  // --------------------------------------------------

  function clearCart() {

    setCart([]);

  }


  // --------------------------------------------------
  // APP
  // --------------------------------------------------

  return (

    <>

      {/* NAVBAR */}

      <Navbar
        cartItems={cart.length}
        openCart={() => setCartOpen(true)}
      />


      {/* CART */}

      <Cart
        open={cartOpen}
        closeCart={() => setCartOpen(false)}

        cart={cart}

        removeFromCart={removeFromCart}

        increaseQuantity={increaseQuantity}

        decreaseQuantity={decreaseQuantity}

        updateQuantity={updateQuantity}
      />


      {/* ROUTES */}

      <Routes>


        {/* CUSTOMER */}

        <Route
          path="/"
          element={
            <Home
              addToCart={addToCart}
            />
          }
        />


        <Route
          path="/login"
          element={<Login />}
        />


        <Route
          path="/register"
          element={<Register />}
        />


        <Route
          path="/profile"
          element={<Profile />}
        />


        <Route
          path="/orders"
          element={<Orders />}
        />


        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              clearCart={clearCart}
            />
          }
        />


        <Route
          path="/addresses"
          element={<Addresses />}
        />


        {/* ----------------------------------------- */}
        {/* ADMIN */}
        {/* ----------------------------------------- */}


        <Route
          path="/admin"
          element={<Admin />}
        />


        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />


        <Route
          path="/admin/products/new"
          element={<AdminNewProduct />}
        />


        <Route
          path="/admin/products/edit/:id"
          element={<AdminEditProduct />}
        />


        {/* DELIVERY SLOTS */}

        <Route
          path="/admin/delivery-slots"
          element={<AdminDeliverySlots />}
        />


      </Routes>

    </>

  );

}


export default App;