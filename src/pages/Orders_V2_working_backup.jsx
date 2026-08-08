import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders(showRefresh = false) {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data: sessionData } =
      await supabase.auth.getSession();

    const user =
      sessionData.session?.user;

    if (!user) {
      setOrders([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const {
      data,
      error,
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
          ascending: false,
        }
      );

    if (error) {
      console.log(error);
      alert(error.message);

      setLoading(false);
      setRefreshing(false);

      return;
    }

    setOrders(data || []);

    setLoading(false);
    setRefreshing(false);
  }

  // =========================
  // NORMALIZE STATUS
  // =========================

  function normalizeStatus(status) {
    if (!status) {
      return "pending";
    }

    return String(status)
      .toLowerCase()
      .trim()
      .replace(/ /g, "_");
  }

  // =========================
  // STATUS INDEX
  // =========================

  function statusStep(status) {
    const normalized =
      normalizeStatus(status);

    const steps = [
      "pending",
      "preparing",
      "out_for_delivery",
      "delivered",
    ];

    const index =
      steps.indexOf(normalized);

    return index >= 0 ? index : 0;
  }

  // =========================
  // STATUS LABEL
  // =========================

  function statusLabel(status) {
    const normalized =
      normalizeStatus(status);

    switch (normalized) {
      case "pending":
        return "Order placed";

      case "preparing":
        return "Preparing";

      case "out_for_delivery":
        return "Out for delivery";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return String(status || "Pending");
    }
  }

  // =========================
  // STATUS COLOR
  // =========================

  function statusColor(status) {
    const normalized =
      normalizeStatus(status);

    switch (normalized) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "out_for_delivery":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-orange-100 text-orange-700";
    }
  }

  // =========================
  // STATUS STEPS
  // =========================

  const steps = [
    {
      title: "Order placed",
      icon: "📦",
    },
    {
      title: "Preparing",
      icon: "👨‍🍳",
    },
    {
      title: "Out for delivery",
      icon: "🚚",
    },
    {
      title: "Delivered",
      icon: "✅",
    },
  ];

  // =========================
  // FORMAT DATE
  // =========================

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(
      parsedDate.getTime()
    )) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // =========================
  // FORMAT ORDER DATE
  // =========================

  function formatOrderDate(date) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(
      parsedDate.getTime()
    )) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-5xl mb-4">
            📦
          </div>

          <p className="text-gray-500 font-medium">
            Loading your orders...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              📦 My Orders
            </h1>

            <p className="text-gray-500 mt-1">
              Track and manage your Relovo orders
            </p>

          </div>

          <button
            onClick={() =>
              loadOrders(true)
            }
            disabled={refreshing}
            className="
              bg-white
              border
              border-gray-200
              px-5
              py-3
              rounded-full
              font-semibold
              shadow-sm
              hover:border-orange-400
              hover:text-orange-500
              transition
            "
          >

            {refreshing
              ? "Refreshing..."
              : "🔄 Refresh"}

          </button>

        </div>

        {/* =========================
            NO ORDERS
        ========================= */}

        {orders.length === 0 && (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h2 className="text-2xl font-bold mb-2">
              No orders yet
            </h2>

            <p className="text-gray-500">
              Your orders will appear here after you complete a purchase.
            </p>

          </div>

        )}

        {/* =========================
            ORDERS
        ========================= */}

        {orders.map((order) => {

          const normalizedStatus =
            normalizeStatus(
              order.status
            );

          const currentStep =
            statusStep(
              order.status
            );

          const items =
            order.order_items || [];

          return (

            <div
              key={order.id}
              className="
                bg-white
                rounded-2xl
                shadow
                p-5
                sm:p-7
                mb-6
              "
            >

              {/* =========================
                  ORDER HEADER
              ========================= */}

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
                mb-6
              ">

                <div>

                  <p className="
                    text-sm
                    text-gray-500
                    mb-1
                  ">
                    Order number
                  </p>

                  <h2 className="
                    font-bold
                    text-xl
                    text-gray-900
                  ">

                    #{String(order.id).slice(0, 8).toUpperCase()}

                  </h2>

                  {order.created_at && (

                    <p className="
                      text-sm
                      text-gray-500
                      mt-1
                    ">

                      Ordered{" "}
                      {formatOrderDate(
                        order.created_at
                      )}

                    </p>

                  )}

                </div>

                <span
                  className={`
                    self-start
                    sm:self-auto
                    px-4
                    py-2
                    rounded-full
                    font-bold
                    text-sm
                    ${statusColor(
                      order.status
                    )}
                  `}
                >

                  {statusLabel(
                    order.status
                  )}

                </span>

              </div>

              {/* =========================
                  TRACKING
              ========================= */}

              {normalizedStatus !==
                "cancelled" && (

                <div className="
                  bg-gray-50
                  rounded-2xl
                  p-5
                  mb-6
                ">

                  <h3 className="
                    font-bold
                    mb-5
                  ">

                    🚚 Order tracking

                  </h3>

                  <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-4
                    gap-4
                  ">

                    {steps.map(
                      (step, index) => {

                        const completed =
                          index <=
                          currentStep;

                        return (

                          <div
                            key={
                              step.title
                            }
                            className="text-center"
                          >

                            <div
                              className={`
                                w-12
                                h-12
                                mx-auto
                                rounded-full
                                flex
                                items-center
                                justify-center
                                text-xl
                                transition

                                ${
                                  completed
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-400"
                                }
                              `}
                            >

                              {step.icon}

                            </div>

                            <p
                              className={`
                                text-sm
                                font-semibold
                                mt-2

                                ${
                                  completed
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }
                              `}
                            >

                              {step.title}

                            </p>

                            {completed && (
                              <div className="
                                text-xs
                                text-green-500
                                mt-1
                              ">
                                ✓ Complete
                              </div>
                            )}

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )}

              {/* =========================
                  DELIVERY
              ========================= */}

              <div className="
                bg-orange-50
                border
                border-orange-100
                rounded-2xl
                p-5
                mb-6
              ">

                <h3 className="
                  font-bold
                  text-lg
                  mb-4
                ">

                  🚚 Delivery details

                </h3>

                <div className="
                  grid
                  md:grid-cols-3
                  gap-4
                ">

                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      uppercase
                      font-semibold
                    ">
                      Address
                    </p>

                    <p className="
                      font-medium
                      mt-1
                    ">

                      📍{" "}
                      {order.customer_address ||
                        "Not available"}

                    </p>

                  </div>

                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      uppercase
                      font-semibold
                    ">
                      Delivery date
                    </p>

                    <p className="
                      font-medium
                      mt-1
                    ">

                      📅{" "}
                      {formatDate(
                        order.delivery_date
                      )}

                    </p>

                  </div>

                  <div>

                    <p className="
                      text-xs
                      text-gray-500
                      uppercase
                      font-semibold
                    ">
                      Time slot
                    </p>

                    <p className="
                      font-medium
                      mt-1
                    ">

                      ⏰{" "}
                      {order.delivery_slot ||
                        "Not available"}

                    </p>

                  </div>

                </div>

              </div>

              {/* =========================
                  PRODUCTS
              ========================= */}

              <div className="mb-6">

                <h3 className="
                  font-bold
                  text-lg
                  mb-4
                ">

                  🛒 Products

                </h3>

                {items.length === 0 ? (

                  <p className="text-gray-500">
                    No products found for this order.
                  </p>

                ) : (

                  <div className="
                    divide-y
                    border
                    rounded-xl
                    overflow-hidden
                  ">

                    {items.map(
                      (item) => {

                        const quantity =
                          Number(
                            item.quantity ||
                              0
                          );

                        const price =
                          Number(
                            item.price ||
                              0
                          );

                        const itemTotal =
                          price *
                          quantity;

                        return (

                          <div
                            key={item.id}
                            className="
                              flex
                              justify-between
                              items-center
                              gap-4
                              p-4
                              bg-white
                            "
                          >

                            <div>

                              <p className="
                                font-semibold
                                text-gray-900
                              ">

                                {item.product_name}

                              </p>

                              <p className="
                                text-sm
                                text-gray-500
                                mt-1
                              ">

                                £
                                {price.toFixed(
                                  2
                                )}

                                {" × "}

                                {quantity}

                              </p>

                            </div>

                            <p className="
                              font-bold
                              text-gray-900
                            ">

                              £
                              {itemTotal.toFixed(
                                2
                              )}

                            </p>

                          </div>

                        );
                      }
                    )}

                  </div>

                )}

              </div>

              {/* =========================
                  TOTAL
              ========================= */}

              <div className="
                border-t
                pt-5
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
                  {Number(
                    order.total || 0
                  ).toFixed(2)}

                </span>

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default Orders;