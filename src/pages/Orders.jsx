import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Orders() {


  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);






  useEffect(() => {

    loadOrders();

  }, []);









  async function loadOrders(){



    const {

      data:sessionData

    } = await supabase.auth.getSession();




    const user = sessionData.session?.user;



    if(!user){

      setLoading(false);

      return;

    }








    const {

      data,

      error

    } = await supabase


      .from("orders")


      .select(`

        *,

        order_items (*)

      `)


      .eq(

        "user_id",

        user.id

      )


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


    switch(status?.toLowerCase()){


      case "delivered":

        return "bg-green-100 text-green-700";



      case "preparing":

        return "bg-blue-100 text-blue-700";



      case "out_for_delivery":

      case "out for delivery":

        return "bg-purple-100 text-purple-700";



      case "pending":

        return "bg-yellow-100 text-yellow-700";



      default:

        return "bg-gray-100 text-gray-700";


    }


  }









  function statusEmoji(status){


    switch(status?.toLowerCase()){


      case "delivered":

        return "🟢";


      case "preparing":

        return "🔵";


      case "out_for_delivery":

      case "out for delivery":

        return "🚚";


      default:

        return "🟠";


    }


  }









  if(loading){


    return (

      <div className="p-10 text-center">

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
              shadow
              p-8
              text-center
            ">

              No orders found

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
                shadow
                p-6
                mb-6
              "

            >







              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">



                <h2 className="
                  text-xl
                  font-bold
                ">


                  🚚 Order #{order.id.slice(0,8)}


                </h2>







                <span className={`

                  px-3

                  py-1

                  rounded-full

                  text-sm

                  font-bold

                  ${statusStyle(order.status)}

                `}>


                  {statusEmoji(order.status)}

                  {" "}

                  {order.status}


                </span>




              </div>









              <h3 className="
                font-bold
                mb-3
              ">

                🛒 Products

              </h3>









              <div className="space-y-3">


                {
                  order.order_items?.map(item => (



                    <div

                      key={item.id}

                      className="
                        flex
                        justify-between
                        border-b
                        pb-3
                      "

                    >



                      <div>


                        <p className="font-semibold">

                          {item.product_name}

                        </p>



                        <p className="text-gray-500">

                          Quantity: {item.quantity}

                        </p>


                      </div>






                      <p className="font-bold">


                        £
                        {

                          (

                            item.price *

                            item.quantity

                          ).toFixed(2)

                        }


                      </p>




                    </div>


                  ))
                }



              </div>









              <div className="
                mt-6
                space-y-2
                text-gray-600
              ">


                <p>

                  📍 {order.customer_address}

                </p>


                <p>

                  🕒 {order.delivery_slot}

                </p>



                <p>

                  📅

                  {" "}

                  {

                    new Date(
                      order.created_at
                    ).toLocaleDateString()

                  }


                </p>



              </div>









              <div className="
                border-t
                mt-5
                pt-5
                flex
                justify-between
              ">



                <span className="
                  font-bold
                  text-xl
                ">

                  Total

                </span>





                <span className="
                  text-orange-500
                  font-bold
                  text-xl
                ">


                  £

                  {

                    Number(order.total)
                    .toFixed(2)

                  }


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