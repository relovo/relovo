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

      setLoading(false);

      return;

    }



    setOrders(data || []);

    setLoading(false);


  }








  const totalRevenue = orders.reduce(

    (sum,order)=>

      sum + Number(order.total || 0),

    0

  );






  const pendingOrders = orders.filter(

    order =>

    order.status?.toLowerCase() === "pending"

  ).length;









  function statusStyle(status){


    switch(status?.toLowerCase()){


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

        Loading dashboard...

      </div>

    );


  }









  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-7xl mx-auto">



        <h1 className="
          text-4xl
          font-bold
          mb-8
        ">

          🛠 Relovo Admin Dashboard

        </h1>









        <div className="
          grid
          md:grid-cols-3
          gap-6
          mb-8
        ">





          <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
          ">

            <p className="text-gray-500">

              📦 Total Orders

            </p>


            <p className="text-3xl font-bold">

              {orders.length}

            </p>


          </div>






          <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
          ">


            <p className="text-gray-500">

              💷 Revenue

            </p>


            <p className="text-3xl font-bold">

              £{totalRevenue.toFixed(2)}

            </p>


          </div>






          <div className="
            bg-white
            rounded-2xl
            shadow
            p-6
          ">


            <p className="text-gray-500">

              ⏳ Pending Orders

            </p>


            <p className="text-3xl font-bold">

              {pendingOrders}

            </p>


          </div>





        </div>









        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">



          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            📦 Orders

          </h2>







          {
            orders.length === 0 ?


            (

              <p className="text-gray-500">

                No orders found.

              </p>

            )


            :


            orders.map(order => (



              <div

                key={order.id}

                className="
                  border-b
                  py-5
                "

              >




                <div className="
                  flex
                  justify-between
                  items-center
                  mb-3
                ">



                  <h3 className="font-bold">

                    Order #{order.id.slice(0,8)}

                  </h3>





                  <span className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-bold
                    ${statusStyle(order.status)}
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





              </div>


            ))


          }





        </div>





      </div>



    </div>


  );


}


export default Admin;