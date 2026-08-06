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








    const items = cart.map(item => ({


      order_id: order.id,


      product_id: Number(item.id),


      product_name: item.name,


      quantity: item.quantity,


      price: Number(item.price)


    }));








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


    <div className="
      min-h-screen
      bg-gray-50
      py-10
      px-4
    ">


      <div className="
        max-w-5xl
        mx-auto
        grid
        md:grid-cols-2
        gap-8
      ">






        {/* DELIVERY */}


        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">



          <h1 className="
            text-3xl
            font-bold
            mb-6
          ">

            🚚 Checkout

          </h1>





          <label className="
            font-semibold
          ">

            Delivery Address

          </label>



          <textarea

            value={address}

            onChange={(e)=>setAddress(e.target.value)}

            placeholder="Enter your delivery address"

            className="
              w-full
              mt-2
              border
              rounded-xl
              p-3
              h-32
              outline-none
              focus:ring-2
              focus:ring-orange-400
            "

          />








          <label className="
            font-semibold
            block
            mt-6
          ">

            Delivery Slot

          </label>





          <select

            value={slot}

            onChange={(e)=>setSlot(e.target.value)}

            className="
              w-full
              mt-2
              border
              rounded-xl
              p-3
            "

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





        </div>









        {/* ORDER SUMMARY */}



        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          h-fit
        ">



          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            🛒 Your Order

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



                <div>

                  <p className="font-semibold">

                    {item.name}

                  </p>


                  <p className="text-gray-500">

                    Qty: {item.quantity}

                  </p>


                </div>





                <p className="
                  font-bold
                ">

                  £{(item.price * item.quantity).toFixed(2)}

                </p>





              </div>


            ))
          }







          <div className="
            flex
            justify-between
            text-xl
            font-bold
            mt-6
          ">


            <span>

              Total

            </span>


            <span className="
              text-orange-500
            ">

              £{total.toFixed(2)}

            </span>


          </div>







          <button

            onClick={placeOrder}

            disabled={loading}

            className="
              w-full
              mt-6
              bg-orange-500
              text-white
              py-3
              rounded-full
              font-bold
              hover:bg-orange-600
              disabled:opacity-50
            "

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






      </div>


    </div>


  );


}


export default Checkout;