import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function Checkout({ cart, clearCart }) {


  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);


  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);


  const [loading, setLoading] = useState(false);





  const slots = [

    "10:00 - 12:00",

    "14:00 - 16:00",

    "18:00 - 20:00"

  ];







  useEffect(() => {

    loadCheckout();

  }, []);









  async function loadCheckout(){


    const {

      data:sessionData

    } = await supabase.auth.getSession();





    const currentUser =
      sessionData.session?.user;





    if(!currentUser){

      navigate("/login");

      return;

    }





    setUser(currentUser);






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





    if(data?.length > 0){

      setSelectedAddress(data[0]);

    }


  }









  function generateDates(){


    const days = [];



    for(let i = 0; i < 7; i++){


      const date = new Date();


      date.setDate(

        date.getDate() + i

      );


      days.push(date);


    }



    return days;


  }







  const deliveryDates = generateDates();









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




    if(!selectedDate || !selectedSlot){

      alert(
        "Please select delivery date and time"
      );

      return;

    }




    setLoading(true);





    const deliveryDate = selectedDate

      .toISOString()

      .split("T")[0];





    const deliverySlot = selectedSlot;





    const customerAddress =

      `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.postcode}`;






    const {

      data:order,

      error:orderError

    } = await supabase


      .from("orders")


      .insert({


        user_id:user.id,


        customer_address:customerAddress,


        delivery_date:deliveryDate,


        delivery_slot:deliverySlot,


        total:Number(total.toFixed(2)),


        status:"Pending"


      })


      .select()


      .single();







    if(orderError){


      console.log(orderError);


      alert(orderError.message);


      setLoading(false);


      return;


    }






    const orderItems = cart.map(item => ({



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


      .insert(orderItems);







    if(itemError){


      console.log(itemError);


      alert(itemError.message);


      setLoading(false);


      return;


    }





    clearCart();


    navigate("/orders");


  }
    return (

    <div className="
      min-h-screen
      bg-gray-50
      p-6
    ">


      <div className="
        max-w-5xl
        mx-auto
      ">


        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">

          Checkout 🛒

        </h1>





        {/* ADDRESS */}


        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">


          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            📍 Delivery Address

          </h2>




          {
            addresses.map(address => (


              <div

                key={address.id}

                onClick={() =>
                  setSelectedAddress(address)
                }

                className={`

                  border

                  rounded-xl

                  p-4

                  mb-3

                  cursor-pointer


                  ${
                    selectedAddress?.id === address.id

                    ?

                    "border-orange-500 bg-orange-50"

                    :

                    "border-gray-200"

                  }

                `}

              >


                <p className="font-bold">

                  {address.label}

                </p>


                <p>

                  {address.address_line}

                </p>


                <p>

                  {address.city}

                  {" "}

                  {address.postcode}

                </p>


              </div>


            ))
          }



        </div>









        {/* DELIVERY DATE */}


        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">


          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            📅 Choose delivery day

          </h2>




          <div className="
            grid
            grid-cols-2
            sm:grid-cols-4
            md:grid-cols-7
            gap-3
          ">


            {
              deliveryDates.map(date => (


                <button


                  key={date.toISOString()}


                  onClick={() =>
                    setSelectedDate(date)
                  }



                  className={`

                    p-3

                    rounded-xl

                    border

                    ${
                      selectedDate?.toDateString()
                      ===
                      date.toDateString()

                      ?

                      "bg-orange-500 text-white"

                      :

                      "bg-white"

                    }

                  `}


                >


                  <div className="font-bold">


                    {
                      date.toLocaleDateString(

                        "en-GB",

                        {
                          weekday:"short"
                        }

                      )

                    }


                  </div>



                  <div>

                    {date.getDate()}

                  </div>



                  <div className="text-xs">


                    {
                      date.toLocaleDateString(

                        "en-GB",

                        {
                          month:"short"
                        }

                      )

                    }


                  </div>


                </button>


              ))
            }


          </div>


        </div>









        {/* TIME SLOT */}


        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">


          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            ⏰ Delivery time

          </h2>




          <div className="
            grid
            md:grid-cols-3
            gap-4
          ">


            {
              slots.map(slot => (


                <button


                  key={slot}


                  onClick={() =>
                    setSelectedSlot(slot)
                  }


                  className={`

                    border

                    rounded-xl

                    p-4

                    font-semibold


                    ${
                      selectedSlot === slot

                      ?

                      "bg-orange-500 text-white"

                      :

                      "bg-white"

                    }

                  `}


                >

                  {slot}

                </button>


              ))
            }


          </div>


        </div>









        {/* ORDER SUMMARY */}


        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">


          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            🛒 Order Summary

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

                  x

                  {item.quantity}

                </span>




                <span className="font-bold">

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






          <div className="
            mt-5
            text-xl
            font-bold
          ">


            Total:

            {" "}

            £{total.toFixed(2)}


          </div>







          {
            selectedDate && selectedSlot && (

              <div className="
                mt-5
                bg-orange-50
                rounded-xl
                p-4
              ">


                <p>

                  📅 Delivery:

                  {" "}

                  {
                    selectedDate.toLocaleDateString()
                  }

                </p>


                <p>

                  ⏰ Slot:

                  {" "}

                  {selectedSlot}

                </p>


              </div>

            )
          }







          <button


            onClick={placeOrder}


            disabled={loading}


            className="
              mt-6
              w-full
              bg-orange-500
              text-white
              py-4
              rounded-full
              font-bold
              text-lg
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