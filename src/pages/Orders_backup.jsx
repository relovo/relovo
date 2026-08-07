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

      data,

      error

    } = await supabase


      .from("orders")

      .select(`

        *,

        order_items(*)

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







  function statusStyle(status){


    switch(status){


      case "Preparing":

        return "bg-blue-100 text-blue-700";


      case "Out for delivery":

        return "bg-purple-100 text-purple-700";


      case "Delivered":

        return "bg-green-100 text-green-700";


      default:

        return "bg-yellow-100 text-yellow-700";


    }


  }







  function timelineStatus(status){


    const steps = [

      "Pending",

      "Preparing",

      "Out for delivery",

      "Delivered"

    ];



    const current = steps.indexOf(status);



    return steps.map((step,index)=>(


      {

        name:step,

        done:index <= current

      }


    ));



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
                rounded-3xl
                shadow
                p-6
                mb-8
              "

            >





              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">


                <div>

                  <h2 className="
                    text-xl
                    font-bold
                  ">

                    🚚 Order #{order.id.slice(0,8)}

                  </h2>


                  <p className="
                    text-gray-500
                    text-sm
                  ">

                    {
                      new Date(
                        order.created_at
                      ).toLocaleDateString()

                    }

                  </p>


                </div>





                <span className={`
                  px-4
                  py-2
                  rounded-full
                  font-bold
                  text-sm
                  ${statusStyle(order.status)}
                `}>

                  {order.status}

                </span>



              </div>
                            {/* TIMELINE */}


              <div className="
                mb-8
              ">


                <h3 className="
                  font-bold
                  mb-4
                ">

                  🚚 Order status

                </h3>



                <div className="
                  flex
                  flex-col
                  gap-3
                ">


                  {
                    timelineStatus(order.status)
                    .map((step,index)=>(


                      <div

                        key={step.name}

                        className="
                          flex
                          items-center
                          gap-3
                        "

                      >


                        <div className={`

                          w-8
                          h-8
                          rounded-full
                          flex
                          items-center
                          justify-center
                          font-bold

                          ${
                            step.done

                            ?

                            "bg-orange-500 text-white"

                            :

                            "bg-gray-200 text-gray-400"

                          }

                        `}>

                          {
                            step.done
                            ?
                            "✓"
                            :
                            index + 1
                          }


                        </div>



                        <span className={`
                          font-semibold

                          ${
                            step.done

                            ?

                            "text-gray-800"

                            :

                            "text-gray-400"

                          }

                        `}>

                          {step.name}


                        </span>



                      </div>


                    ))

                  }



                </div>



              </div>









              {/* PRODUCTS */}



              <h3 className="
                font-bold
                mb-3
              ">

                🛒 Products

              </h3>





              <div className="
                space-y-3
                mb-6
              ">



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


                        <p className="
                          font-semibold
                        ">

                          {item.product_name}

                        </p>



                        <p className="
                          text-gray-500
                        ">

                          Quantity: {item.quantity}

                        </p>


                      </div>





                      <p className="
                        font-bold
                      ">


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








              {/* DELIVERY INFO */}



              <div className="
                bg-gray-50
                rounded-xl
                p-4
                space-y-2
                mb-6
              ">


                <p>

                  📍 {order.customer_address}

                </p>



                {
                  order.delivery_date && (

                    <p>

                      📅 Delivery date:

                      {" "}

                      {
                        new Date(
                          order.delivery_date
                        ).toLocaleDateString(
                          "en-GB"
                        )
                      }

                    </p>

                  )
                }





                <p>

                  ⏰ {order.delivery_slot}

                </p>




              </div>








              {/* TOTAL */}



              <div className="
                border-t
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
                  text-orange-500
                  font-bold
                  text-2xl
                ">


                  £
                  {
                    Number(
                      order.total
                    ).toFixed(2)

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