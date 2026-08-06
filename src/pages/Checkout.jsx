import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function Checkout({ cart, clearCart }) {


  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliverySlot, setDeliverySlot] = useState(
    "Today 18:00 - 20:00"
  );

  const [loading, setLoading] = useState(false);








  useEffect(() => {


    loadData();


  }, []);








  async function loadData() {


    const {
      data: sessionData
    } = await supabase.auth.getSession();



    const currentUser =
      sessionData.session?.user;



    setUser(currentUser);



    if (!currentUser) {

      navigate("/login");

      return;

    }





    const {
      data,
      error
    } = await supabase
      .from("addresses")
      .select("*")
      .eq(
        "user_id",
        currentUser.id
      );



    if(error){

      console.log(error);

      return;

    }



    setAddresses(data || []);



    if(data && data.length > 0){

      setSelectedAddress(data[0]);

    }


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

      alert(
        "Please select an address"
      );

      return;

    }



    if(cart.length === 0){

      alert(
        "Your cart is empty"
      );

      return;

    }




    setLoading(true);





    const addressText =

      `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.postcode}`;








    const {
      data: order,
      error: orderError

    } = await supabase

      .from("orders")

      .insert({

        user_id:user.id,

        customer_address:addressText,

        delivery_slot:deliverySlot,

        total:total,

        status:"Pending"


      })

      .select()

      .single();








    if(orderError){

      console.log(orderError);

      alert(
        "Order creation failed"
      );

      setLoading(false);

      return;

    }








    const items = cart.map(item => ({

      order_id:order.id,

      product_id:item.id,

      product_name:item.name,

      quantity:item.quantity,

      price:item.price


    }));







    const {
      error:itemError

    } = await supabase

      .from("order_items")

      .insert(items);







    if(itemError){

      console.log(itemError);

      alert(
        "Products could not be saved"
      );

      setLoading(false);

      return;

    }






    clearCart();



    navigate("/orders");



  }









  return (

    <div className="min-h-screen bg-gray-50 p-6">


      <div className="max-w-5xl mx-auto">



        <h1 className="text-3xl font-bold mb-6">

          Checkout 🛒

        </h1>







        <div className="bg-white rounded-xl shadow p-6 mb-6">


          <h2 className="text-xl font-bold mb-4">

            Delivery Address 📍

          </h2>





          {
            addresses.map(address => (


              <label

                key={address.id}

                className="
                  block
                  border
                  rounded-lg
                  p-4
                  mb-3
                  cursor-pointer
                "

              >


                <input

                  type="radio"

                  checked={
                    selectedAddress?.id === address.id
                  }

                  onChange={() =>
                    setSelectedAddress(address)
                  }

                />



                <span className="ml-3">


                  <b>
                    {address.label}
                  </b>


                  <br />


                  {address.address_line}


                  <br />


                  {address.city} {address.postcode}


                </span>


              </label>


            ))
          }



          {
            addresses.length === 0 &&

            <p>
              No addresses found.
              Add one in your profile.
            </p>

          }


        </div>









        <div className="bg-white rounded-xl shadow p-6 mb-6">


          <h2 className="text-xl font-bold mb-4">

            Delivery Slot 🚚

          </h2>



          <select

            value={deliverySlot}

            onChange={
              e=>setDeliverySlot(e.target.value)
            }

            className="
              border
              rounded
              p-3
              w-full
            "

          >

            <option>
              Today 18:00 - 20:00
            </option>


            <option>
              Tomorrow 10:00 - 12:00
            </option>


            <option>
              Tomorrow 14:00 - 16:00
            </option>


          </select>



        </div>









        <div className="bg-white rounded-xl shadow p-6">


          <h2 className="text-xl font-bold mb-4">

            Order Summary

          </h2>



          {
            cart.map(item => (


              <div

                key={item.id}

                className="
                  flex
                  justify-between
                  border-b
                  py-3
                "

              >


                <span>

                  {item.name}

                  x {item.quantity}

                </span>


                <span>

                  £
                  {
                    (
                      item.price *
                      item.quantity

                    ).toFixed(2)

                  }

                </span>


              </div>


            ))
          }





          <div className="text-xl font-bold mt-5">


            Total:

            £{total.toFixed(2)}


          </div>






          <button

            onClick={placeOrder}

            disabled={loading}

            className="
              mt-6
              bg-orange-500
              text-white
              px-6
              py-3
              rounded-full
              font-bold
              w-full
            "

          >

            {
              loading
              ?
              "Creating order..."
              :
              "Place Order 🚚"
            }


          </button>



        </div>




      </div>


    </div>


  );


}


export default Checkout;