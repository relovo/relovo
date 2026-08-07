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

      alert(error.message);

      setLoading(false);

      return;

    }





    setOrders(data || []);

    setLoading(false);


  }









  function statusStep(status){


    const steps = [

      "pending",

      "preparing",

      "out_for_delivery",

      "delivered"

    ];


    return steps.indexOf(status);


  }







  function statusLabel(status){


    switch(status){


      case "pending":

        return "Order placed";


      case "preparing":

        return "Preparing";


      case "out_for_delivery":

        return "Out for delivery";


      case "delivered":

        return "Delivered";


      default:

        return status;


    }


  }









  const steps = [

    {

      title:"Order placed",

      icon:"📝"

    },

    {

      title:"Preparing",

      icon:"👨‍🍳"

    },

    {

      title:"Out for delivery",

      icon:"🚚"

    },

    {

      title:"Delivered",

      icon:"✅"

    }

  ];











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
        max-w-5xl
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
              rounded-2xl
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


                <h2 className="font-bold text-xl">

                  🚚 Order #{order.id.slice(0,8)}

                </h2>


                <span className="
                  bg-orange-100
                  text-orange-700
                  px-3
                  py-1
                  rounded-full
                  font-bold
                  text-sm
                ">

                  {statusLabel(order.status)}

                </span>


              </div>









              {/* TRACKING */}


              <div className="
                mb-8
              ">



                {
                  steps.map((step,index)=> (


                    <div

                      key={step.title}

                      className="
                        flex
                        items-center
                        mb-4
                      "

                    >



                      <div className={`

                        w-10

                        h-10

                        rounded-full

                        flex

                        items-center

                        justify-center

                        ${
                          index <= statusStep(order.status)

                          ?

                          "bg-green-500 text-white"

                          :

                          "bg-gray-200"

                        }

                      `}>


                        {step.icon}


                      </div>




                      <div className="ml-4">


                        <p className={`
                          font-semibold
                          ${
                            index <= statusStep(order.status)
                            ?
                            "text-green-600"
                            :
                            "text-gray-400"
                          }
                        `}>


                          {step.title}


                        </p>


                      </div>



                    </div>


                  ))
                }



              </div>









              <div className="
                bg-gray-50
                rounded-xl
                p-4
                mb-5
              ">


                <p>

                  📍 {order.customer_address}

                </p>


                <p>

                  📅 {order.delivery_date}

                </p>


                <p>

                  ⏰ {order.delivery_slot}

                </p>


              </div>









              <h3 className="
                font-bold
                mb-3
              ">

                🛒 Products

              </h3>






              {
                order.order_items?.map(item => (


                  <div

                    key={item.id}

                    className="
                      flex
                      justify-between
                      border-b
                      py-2
                    "

                  >


                    <span>

                      {item.product_name}

                      {" x "}

                      {item.quantity}

                    </span>


                    <span className="font-bold">

                      £{(item.price * item.quantity).toFixed(2)}

                    </span>


                  </div>


                ))
              }








              <div className="
                mt-5
                border-t
                pt-4
                flex
                justify-between
              ">


                <span className="font-bold text-xl">

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