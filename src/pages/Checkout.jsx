import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Checkout({ cart }) {


  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");

  const [slot, setSlot] = useState("");

  const [loading, setLoading] = useState(false);







  useEffect(() => {

    loadAddresses();

  }, []);








  async function loadAddresses() {


    const {
      data
    } = await supabase.auth.getUser();



    const currentUser = data.user;



    setUser(currentUser);




    if(!currentUser){

      return;

    }






    const {

      data: addressData,

      error

    } = await supabase


      .from("addresses")


      .select("*")


      .eq("user_id", currentUser.id)

      .order("created_at", {

        ascending:false

      });





    if(error){

      console.log(error);

    }




    setAddresses(addressData || []);



  }









  const total = cart.reduce(

    (sum,item)=>

      sum +

      Number(item.price) *

      item.quantity,

    0

  );











  async function placeOrder(){



    if(!selectedAddress){

      alert("Please select delivery address");

      return;

    }





    if(!slot){

      alert("Please select delivery slot");

      return;

    }





    if(cart.length===0){

      alert("Your cart is empty");

      return;

    }







    setLoading(true);





    const address = addresses.find(

      item =>

      item.id === Number(selectedAddress)

    );









    const {

      data:order,

      error:orderError

    } = await supabase


      .from("orders")


      .insert([

        {

          user_id:user.id,

          customer_address:

          `${address.address_line}, ${address.city}, ${address.postcode}`,

          delivery_slot:slot,

          total:total,

          status:"pending"

        }

      ])


      .select()


      .single();







    if(orderError){

      console.log(orderError);

      alert(orderError.message);

      setLoading(false);

      return;

    }









    const items = cart.map(item=>(

      {

        order_id:order.id,

        product_id:Number(item.id),

        product_name:item.name,

        quantity:item.quantity,

        price:Number(item.price)

      }

    ));







    const {

      error:itemsError

    } = await supabase


      .from("order_items")


      .insert(items);






    if(itemsError){

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

        padding:"30px",

        maxWidth:"700px",

        margin:"auto"

      }}

    >




      <h1>

        🛒 Checkout

      </h1>







      <h2>

        📍 Delivery Address

      </h2>






      {

        addresses.length === 0

        ?

        <p>

          No saved addresses. Go to Profile and add one.

        </p>


        :


        addresses.map(address=>(


          <div

            key={address.id}

            style={{

              border:"1px solid #ddd",

              padding:"15px",

              borderRadius:"12px",

              marginBottom:"10px"

            }}

          >


            <label>


              <input

                type="radio"

                name="address"

                value={address.id}

                onChange={(e)=>

                  setSelectedAddress(e.target.value)

                }

              />



              {" "}


              🏠 {address.label}


              <br/>


              {address.address_line}


              <br/>


              {address.city}

              {" "}

              {address.postcode}



            </label>



          </div>


        ))

      }








      <h2>

        🚚 Delivery Slot

      </h2>





      <select

        value={slot}

        onChange={(e)=>

          setSlot(e.target.value)

        }

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

        cart.map(item=>(


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

          width:"100%",

          padding:"15px",

          background:"#ff8c00",

          color:"white",

          border:"none",

          borderRadius:"10px",

          fontSize:"16px"

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