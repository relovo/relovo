import { useState } from "react";
import { Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import Addresses from "./pages/Addresses";




function App() {


  const [cart, setCart] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);






  function addToCart(product){



    setCart(prev => {


      const existing = prev.find(

        item => item.id === product.id

      );



      if(existing){


        return prev.map(item =>


          item.id === product.id

          ?

          {

            ...item,

            quantity:item.quantity + 1

          }

          :

          item


        );


      }





      return [

        ...prev,

        {

          ...product,

          quantity:1

        }


      ];


    });



  }







  function removeFromCart(id){


    setCart(prev =>

      prev.filter(

        item => item.id !== id

      )

    );


  }









  function updateQuantity(id, quantity){



    if(quantity <= 0){

      removeFromCart(id);

      return;

    }





    setCart(prev =>


      prev.map(item =>


        item.id === id

        ?

        {

          ...item,

          quantity

        }

        :

        item


      )


    );


  }









  function clearCart(){


    setCart([]);

  }









  return (


    <>


      <Navbar


        cartItems={cart.length}


        openCart={() => setCartOpen(true)}


      />






      <CartDrawer


        open={cartOpen}


        closeCart={() => setCartOpen(false)}


        cart={cart}


        removeFromCart={removeFromCart}


        updateQuantity={updateQuantity}


      />








      <Routes>





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








      </Routes>





    </>


  );


}



export default App;