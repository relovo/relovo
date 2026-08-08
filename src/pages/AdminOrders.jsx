import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Error loading orders:", error);
      alert(error.message);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    setUpdatingId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating status:", error);
      alert(error.message);
      setUpdatingId(null);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );

    setUpdatingId(null);
  }

  function statusStyle(status) {
    switch (String(status || "").toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "preparing":
        return "bg-blue-100 text-blue-700";

      case "out for delivery":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() === "preparing"
  ).length;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-xl text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">
            📦 Admin Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customer orders and delivery status.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="
            bg-gray-900
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            hover:bg-gray-800
          "
        >
          🔄 Refresh
        </button>
      </div>

      {/* STATISTICS */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-5
          mb-8
        "
      >
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Total Orders
          </p>

          <p className="text-3xl font-bold mt-2">
            {orders.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Pending
          </p>

          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Preparing
          </p>

          <p className="text-3xl font-bold mt-2 text-blue-600">
            {preparingOrders}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">
            Revenue
          </p>

          <p className="text-3xl font-bold mt-2 text-orange-500">
            £{totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* ORDERS */}

      {orders.length === 0 ? (
        <div
          className="
            bg-white
            rounded-2xl
            shadow
            p-10
            text-center
          "
        >
          <p className="text-xl text-gray-500">
            No orders found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="
                bg-white
                rounded-2xl
                shadow
                p-6
              "
            >
              {/* ORDER HEADER */}

              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                  gap-4
                  mb-6
                "
              >
                <div>
                  <h2 className="text-xl font-bold">
                    🚚 Order #{String(order.id).slice(0, 8)}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.created_at
                      ? new Date(
                          order.created_at
                        ).toLocaleString("en-GB")
                      : ""}
                  </p>
                </div>

                {/* STATUS */}

                <div className="flex items-center gap-3">
                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      font-bold
                      text-sm
                      ${statusStyle(order.status)}
                    `}
                  >
                    {order.status || "Pending"}
                  </span>

                  <select
                    value={order.status || "Pending"}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                    className="
                      border
                      rounded-xl
                      px-3
                      py-2
                      bg-white
                    "
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Out for delivery">
                      Out for delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              {/* DELIVERY INFO */}

              <div
                className="
                  bg-gray-50
                  rounded-xl
                  p-5
                  mb-6
                "
              >
                <h3 className="font-bold mb-3">
                  🚚 Delivery Information
                </h3>

                <p className="mb-1">
                  📍{" "}
                  {order.customer_address ||
                    "Address not available"}
                </p>

                <p className="mb-1">
                  📅{" "}
                  {order.delivery_date ||
                    "Date not available"}
                </p>

                <p>
                  🕐{" "}
                  {order.delivery_slot ||
                    "Time slot not available"}
                </p>
              </div>

              {/* PRODUCTS */}

              <h3
                className="
                  font-bold
                  text-lg
                  mb-3
                "
              >
                🛒 Products
              </h3>

              <div className="space-y-2">
                {order.order_items?.length > 0 ? (
                  order.order_items.map((item) => {
                    const quantity = Number(
                      item.quantity || 0
                    );

                    const price = Number(
                      item.price || 0
                    );

                    const itemTotal =
                      price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="
                          flex
                          justify-between
                          items-center
                          border-b
                          py-3
                          gap-4
                        "
                      >
                        <div>
                          <p className="font-semibold">
                            {item.product_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {quantity}
                          </p>
                        </div>

                        <p className="font-bold">
                          £{itemTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">
                    No products found.
                  </p>
                )}
              </div>

              {/* TOTAL */}

              <div
                className="
                  mt-6
                  pt-5
                  border-t
                  flex
                  justify-between
                  items-center
                "
              >
                <span
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-2xl
                    font-bold
                    text-orange-500
                  "
                >
                  £{Number(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;