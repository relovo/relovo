import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Admin() {


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

      alert(error.message);

      return;

    }



    setOrders(data || []);

    setLoading(false);


  }







  async function updateStatus(id,status){


    const {

      error

    } = await supabase

      .from("orders")

      .update({

        status

      })

      .eq(

        "id",

        id

      );




    if(error){

      console.log(error);

      alert(error.message);

      return;

    }



    setOrders(current =>

      current.map(order =>


        order.id === id

        ?

        {
          ...order,
          status
        }

        :

        order


      )

    );


  }









  const revenue = orders.reduce(

    (sum,order)=>

      sum + Number(order.total || 0),

    0

  );




  const pending = orders.filter(

    order => order.status === "pending"

  ).length;




  const delivered = orders.filter(

    order => order.status === "delivered"

  ).length;







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

      <div className="p-10 text-center">

        Loading Admin...

      </div>

    );

  }







  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-7xl mx-auto">



        <h1 className="text-4xl font-bold mb-8">

          🛠 Relovo Admin Dashboard

        </h1>







        <div className="grid md:grid-cols-4 gap-6 mb-8">



          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">

              📦 Orders

            </p>

            <p className="text-3xl font-bold">

              {orders.length}

            </p>

          </div>





          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">

              💷 Revenue

            </p>

            <p className="text-3xl font-bold">

              £{revenue.toFixed(2)}

            </p>

          </div>





          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">

              🟡 Pending

            </p>

            <p className="text-3xl font-bold">

              {pending}

            </p>

          </div>





          <div className="bg-white rounded-2xl shadow p-6">

            <p className="text-gray-500">

              🟢 Delivered

            </p>

            <p className="text-3xl font-bold">

              {delivered}

            </p>

          </div>



        </div>









        <div className="bg-white rounded-2xl shadow p-6">


          <h2 className="text-2xl font-bold mb-6">

            📦 Orders Management

          </h2>






          {

            orders.map(order => (


              <div

                key={order.id}

                className="
                  border-b
                  py-6
                "

              >




                <div className="
                  flex
                  justify-between
                  items-center
                  mb-4
                ">


                  <h3 className="font-bold text-lg">

                    Order #{order.id.slice(0,8)}

                  </h3>



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






                <p>

                  📍 {order.customer_address}

                </p>



                <p>

                  📅 {order.delivery_date}

                </p>



                <p>

                  ⏰ {order.delivery_slot}

                </p>



                <p className="font-bold mt-2">

                  💷 £{Number(order.total).toFixed(2)}

                </p>







                <div className="
                  flex
                  gap-2
                  flex-wrap
                  mt-5
                ">


                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "pending"
                      )
                    }

                    className="
                      bg-yellow-500
                      text-white
                      px-4
                      py-2
                      rounded-full
                    "

                  >

                    Pending

                  </button>





                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "preparing"
                      )
                    }

                    className="
                      bg-blue-500
                      text-white
                      px-4
                      py-2
                      rounded-full
                    "

                  >

                    Preparing

                  </button>





                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "out_for_delivery"
                      )
                    }

                    className="
                      bg-purple-500
                      text-white
                      px-4
                      py-2
                      rounded-full
                    "

                  >

                    Out for delivery

                  </button>





                  <button

                    onClick={() =>
                      updateStatus(
                        order.id,
                        "delivered"
                      )
                    }

                    className="
                      bg-green-500
                      text-white
                      px-4
                      py-2
                      rounded-full
                    "

                  >

                    Delivered

                  </button>




                </div>






              </div>


            ))

          }





        </div>



      </div>


    </div>


  );


}


export default Admin;