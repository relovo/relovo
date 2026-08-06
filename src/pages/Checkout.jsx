import { useState } from "react";
import { supabase } from "../services/supabaseClient";


function Checkout({ cart }) {


  const [address, setAddress] = useState("");

  const [slot, setSlot] = useState("");

  const [loading, setLoading] = useState(false);






  const total = cart.reduce(

    (sum, item) =>

      sum + Number(item.price) * item.quantity,

    0

  );








  async function placeOrder() {


    if (!address) {

      alert("Please enter delivery address");

      return;

    }




    if (!slot) {

      alert("Please select delivery slot");

      return;

    }





    if (cart.length === 0) {

      alert("Your cart is empty");

      return;

    }






    setLoading(true);






    // CREATE ORDER

    const {

      data: order,

      error: orderError

    } = await supabase


      .from("orders")


      .insert([

        {

          customer_address: address,

          delivery_slot: slot,

          total: total,

          status: "pending"

        }

      ])


      .select()


      .single();







    if (orderError) {


      console.log(orderError);

      alert(orderError.message);

      setLoading(false);

      return;

    }








    // CREATE ITEMS


    const items = cart.map(item => ({


      order_id: order.id,


      product_id: Number(item.id),


      product_name: item.name,


      quantity: item.quantity,


      price: Number(item.price)


    }));







    console.log("ORDER ITEMS:", items);








    const {

      error: itemsError

    } = await supabase


      .from("order_items")


      .insert(items);








    if (itemsError) {


      console.log(itemsError);

      alert(itemsError.message);

      setLoading(false);

      return;

    }







    alert("Order confirmed 🚚");



    setLoading(false);



  }










  return (


    <div

      style={{

        padding:"25px"

      }}

    >



      <h1>

        🛒 Checkout

      </h1>







      <h3>

        Delivery Address

      </h3>





      <input

        value={address}

        onChange={(e)=>setAddress(e.target.value)}

        placeholder="Enter your address"

        style={{

          width:"100%",

          padding:"12px"

        }}

      />








      <h3>

        Choose delivery slot

      </h3>






      <select

        value={slot}

        onChange={(e)=>setSlot(e.target.value)}

        style={{

          width:"100%",

          padding:"12px"

        }}

      >


        <option value="">

          Select time

        </option>


        <option>

          09:00 - 11:00

        </option>


        <option>

          11:00 - 13:00

        </option>


        <option>

          18:00 - 20:00

        </option>


      </select>







      <h2>

        Your Order

      </h2>






      {

        cart.map(item => (


          <p key={item.id}>


            {item.name}

            {" x "}

            {item.quantity}

            {" - £"}

            {(item.price * item.quantity).toFixed(2)}


          </p>


        ))

      }








      <h2>

        Total: £{total.toFixed(2)}

      </h2>







      <button

        onClick={placeOrder}

        disabled={loading}

        style={{

          padding:"15px 25px",

          background:"#ff8c00",

          color:"white",

          border:"none",

          borderRadius:"10px",

          cursor:"pointer"

        }}

      >

        {

          loading

          ?

          "Processing..."

          :

          "Confirm Order 🚚"

        }


      </button>





    </div>


  );

}



export default Checkout;