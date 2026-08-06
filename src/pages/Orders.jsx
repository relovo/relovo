import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadOrders();
  }, []);


  async function loadOrders() {

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false,
      });


    if (error) {
      console.log(error);
    }


    setOrders(data || []);
    setLoading(false);
  }



  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        Loading orders...
      </div>
    );
  }



  return (
    <div
      style={{
        padding: "30px",
      }}
    >

      <h1>
        📦 My Orders
      </h1>


      {orders.length === 0 && (
        <p>
          No orders found
        </p>
      )}



      {orders.map((order) => (

        <div
          key={order.id}
          style={{
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "15px",
          }}
        >

          <h3>
            Order #{order.id}
          </h3>


          <p>
            Status: {order.status}
          </p>


          <p>
            Delivery:
            {" "}
            {order.delivery_slot}
          </p>


          <h3>
            Total: £{order.total}
          </h3>


        </div>

      ))}

    </div>
  );
}


export default Orders;