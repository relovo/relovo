import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Orders() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);







  useEffect(() => {

    loadOrders();

  }, []);








  async function loadOrders() {


    const {

      data,

      error

    } = await supabase


      .from("orders")

      .select("*")

      .order(

        "created_at",

        {

          ascending:false

        }

      );







    if(error){

      console.log(error);

    }







    setOrders(data || []);

    setLoading(false);


  }









  function statusStyle(status){


    if(status === "delivered"){

      return "bg-green-100 text-green-700";

    }



    if(status === "preparing"){

      return "bg-blue-100 text-blue-700";

    }



    if(status === "out_for_delivery"){

      return "bg-purple-100 text-purple-700";

    }



    return "bg-yellow-100 text-yellow-700";


  }









  if(loading){


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">


        Loading orders...


      </div>

    );


  }









  return (


    <div className="
      min-h-screen
      bg-gray-50
      py-10
      px-4
    ">



      <div className="
        max-w-4xl
        mx-auto
      ">





        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">


          📦 My Orders


        </h1>







        {
          orders.length === 0 && (


            <div className="
              bg-white
              rounded-xl
              p-8
              text-center
            ">


              <p className="
                text-gray-500
              ">


                No orders found


              </p>


            </div>


          )
        }









        {
          orders.map(order => (



            <div

              key={order.id}

              className="
                bg-white
                rounded-2xl
                shadow-sm
                p-6
                mb-5
              "

            >





              <div className="
                flex
                justify-between
                items-center
                mb-4
              ">




                <h2 className="
                  font-bold
                  text-lg
                ">


                  🚚 Order #{order.id.slice(0,8)}


                </h2>






                <span className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                  ${statusStyle(order.status)}
                `}>


                  {order.status}


                </span>




              </div>









              <div className="
                space-y-2
                text-gray-600
              ">



                <p>

                  🕒 Delivery slot:

                  {" "}

                  {order.delivery_slot}


                </p>




                <p>

                  📍 Address:

                  {" "}

                  {order.customer_address}


                </p>





                <p>

                  📅

                  {" "}

                  {new Date(order.created_at)
                    .toLocaleDateString()
                  }


                </p>



              </div>









              <div className="
                border-t
                mt-5
                pt-4
                flex
                justify-between
                items-center
              ">



                <span className="
                  font-bold
                  text-xl
                ">


                  Total


                </span>




                <span className="
                  font-bold
                  text-orange-500
                  text-xl
                ">


                  £{Number(order.total).toFixed(2)}


                </span>




              </div>





            </div>


          ))

        }







      </div>



    </div>


  );


}



export default Orders;