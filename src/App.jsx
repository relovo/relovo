import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Cart from "./components/Cart";

import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Register from "./pages/Register";



function App() {


  const [cart, setCart] = useState([]);





  function addToCart(product) {


    const productId = Number(product.id);



    setCart((currentCart) => {


      const existingProduct = currentCart.find(

        (item) => item.id === productId

      );



      if (existingProduct) {


        return currentCart.map((item) =>


          item.id === productId

          ?

          {

            ...item,

            quantity: item.quantity + 1,

          }

          :

          item


        );


      }






      return [


        ...currentCart,


        {

          id: productId,

          name: product.name,

          price: Number(product.price),

          image:
            product.image ||
            product.image_url ||
            "",

          store_id: product.store_id,

          category_id: product.category_id,

          quantity: 1,


        }


      ];



    });



  }









  function removeFromCart(id) {


    setCart((currentCart) =>


      currentCart.filter(

        (item) => item.id !== id

      )


    );


  }









  function increaseQuantity(id) {


    setCart((currentCart) =>


      currentCart.map((item) =>


        item.id === id


        ?


        {

          ...item,

          quantity: item.quantity + 1,


        }


        :


        item



      )


    );


  }









  function decreaseQuantity(id) {


    setCart((currentCart) =>


      currentCart


      .map((item) =>


        item.id === id


        ?


        {

          ...item,

          quantity: item.quantity - 1,


        }


        :


        item



      )


      .filter(

        (item) => item.quantity > 0

      )


    );


  }








  const cartItems = cart.reduce(

    (total, item) =>

      total + item.quantity,

    0

  );









  return (


    <BrowserRouter>


      <Navbar

        cartItems={cartItems}

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

          path="/checkout"

          element={

            <Checkout

              cart={cart}

            />

          }

        />







        <Route

          path="/orders"

          element={

            <Orders />

          }

        />







        <Route

          path="/profile"

          element={

            <Profile />

          }

        />







        <Route

          path="/register"

          element={

            <Register />

          }

        />





      </Routes>








      <Cart


        cart={cart}


        removeFromCart={removeFromCart}


        increaseQuantity={increaseQuantity}


        decreaseQuantity={decreaseQuantity}



      />





    </BrowserRouter>


  );


}



export default App;