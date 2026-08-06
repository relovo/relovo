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

      .select(`

        *,

        order_items (*)

      `)

      .order(

        "created_at",

        {

          ascending:false

        }

      );







    if(error){

      console.log(error);

      alert(error.message);

    }







    setOrders(data || []);

    setLoading(false);


  }









  function statusColor(status){


    switch(status){


      case "delivered":

        return "bg-green-100 text-green-700";



      case "preparing":

        return "bg-blue-100 text-blue-700";



      case "out_for_delivery":

        return "bg-purple-100 text-purple-700";



      default:

        return "bg-yellow-100 text-yellow-700";


    }


  }









  if(loading){


    return (

      <div className="
        p-10
        text-center
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
              p-8
              rounded-xl
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
                mb-5
              ">


                <h2 className="
                  font-bold
                  text-xl
                ">


                  🚚 Order #{order.id.slice(0,8)}


                </h2>





                <span className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-bold
                  ${statusColor(order.status)}
                `}>


                  {order.status}


                </span>



              </div>










              <h3 className="
                font-bold
                mb-3
              ">

                🛒 Products

              </h3>







              <div className="
                space-y-3
                mb-5
              ">



                {


                  order.order_items?.map(item => (



                    <div

                      key={item.id}

                      className="
                        flex
                        justify-between
                        border-b
                        pb-2
                      "

                    >




                      <div>


                        <p className="font-semibold">


                          {item.product_name}


                        </p>



                        <p className="
                          text-gray-500
                        ">


                          Quantity: {item.quantity}


                        </p>



                      </div>






                      <p className="font-bold">


                        £{(

                          item.price *

                          item.quantity

                        ).toFixed(2)}



                      </p>





                    </div>


                  ))



                }



              </div>









              <div className="
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
                pt-4
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