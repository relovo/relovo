import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    loadCheckout();
  }, []);

  async function loadCheckout() {
    const { data: sessionData } =
      await supabase.auth.getSession();

    const currentUser =
      sessionData.session?.user;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    // =========================
    // LOAD ADDRESSES
    // =========================

    const {
      data: addressesData,
      error: addressesError,
    } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", currentUser.id);

    if (addressesError) {
      console.log(addressesError);
      alert(addressesError.message);
      return;
    }

    setAddresses(addressesData || []);

    if (addressesData?.length > 0) {
      setSelectedAddress(addressesData[0]);
    }

    // =========================
    // LOAD DELIVERY SLOTS
    // =========================

    await loadDeliverySlots();
  }

  async function loadDeliverySlots() {
    setLoadingSlots(true);

    const today = new Date();

    const startDate = new Date(today);

    const endDate = new Date(today);

    endDate.setDate(
      endDate.getDate() + 6
    );

    function formatDate(date) {
      const year = date.getFullYear();

      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        date.getDate()
      ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    const fromDate =
      formatDate(startDate);

    const toDate =
      formatDate(endDate);

    const {
      data,
      error,
    } = await supabase
      .from("Delivery_Slots")
      .select("*")
      .gte("date", fromDate)
      .lte("date", toDate)
      .order("date", {
        ascending: true,
      })
      .order("start_time", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      alert(error.message);
      setLoadingSlots(false);
      return;
    }

    setDeliverySlots(data || []);

    setLoadingSlots(false);
  }

  // =========================
  // TOTAL
  // =========================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // =========================
  // FORMAT DATE
  // =========================

  function formatDisplayDate(dateString) {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
      }
    );
  }

  // =========================
  // FORMAT SLOT
  // =========================

  function formatSlot(slot) {
    return `${slot.start_time} - ${slot.end_time}`;
  }

  // =========================
  // GROUP SLOTS BY DATE
  // =========================

  const groupedSlots =
    deliverySlots.reduce(
      (groups, slot) => {
        if (!groups[slot.date]) {
          groups[slot.date] = [];
        }

        groups[slot.date].push(slot);

        return groups;
      },
      {}
    );

  // =========================
  // PLACE ORDER
  // =========================

  async function placeOrder() {
    if (!selectedAddress) {
      alert(
        "Please select a delivery address"
      );
      return;
    }

    if (!selectedSlot) {
      alert(
        "Please select a delivery slot"
      );
      return;
    }

    if (!user) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    // =========================
    // CHECK SLOT AGAIN
    // =========================

    const {
      data: freshSlot,
      error: freshSlotError,
    } = await supabase
      .from("Delivery_Slots")
      .select("*")
      .eq("id", selectedSlot.id)
      .single();

    if (freshSlotError) {
      console.log(freshSlotError);

      alert(
        freshSlotError.message
      );

      return;
    }

    if (!freshSlot) {
      alert(
        "Delivery slot not found"
      );

      return;
    }

    const remainingPlaces =
      Number(
        freshSlot.capacity || 0
      ) -
      Number(
        freshSlot.booked || 0
      );

    if (
      freshSlot.available !== true ||
      remainingPlaces <= 0
    ) {
      alert(
        "Sorry, this delivery slot is now fully booked. Please choose another slot."
      );

      await loadDeliverySlots();

      setSelectedSlot(null);

      return;
    }

    setLoading(true);

    // =========================
    // DELIVERY INFORMATION
    // =========================

    const deliveryDate =
      freshSlot.date;

    const deliverySlot =
      `${freshSlot.start_time} - ${freshSlot.end_time}`;

    const customerAddress =
      `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.postcode}`;

    // =========================
    // CREATE ORDER
    // =========================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,

        customer_address:
          customerAddress,

        delivery_date:
          deliveryDate,

        delivery_slot:
          deliverySlot,

        total:
          Number(
            total.toFixed(2)
          ),

        status: "Pending",
      })
      .select()
      .single();

    if (orderError) {
      console.log(orderError);

      alert(
        orderError.message
      );

      setLoading(false);

      return;
    }

    // =========================
    // CREATE ORDER ITEMS
    // =========================

    const orderItems =
      cart.map((item) => ({
        order_id: order.id,

        product_id: item.id,

        product_name:
          item.name,

        quantity:
          Number(item.quantity),

        price:
          Number(item.price),
      }));

    const {
      error: itemError,
    } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) {
      console.log(itemError);

      alert(
        itemError.message
      );

      setLoading(false);

      return;
    }

    // =========================
    // UPDATE BOOKED
    // =========================

    const newBooked =
      Number(
        freshSlot.booked || 0
      ) + 1;

    const newAvailable =
      newBooked <
      Number(
        freshSlot.capacity || 0
      );

    const {
      error: slotUpdateError,
    } = await supabase
      .from("Delivery_Slots")
      .update({
        booked: newBooked,

        available:
          newAvailable,
      })
      .eq(
        "id",
        freshSlot.id
      );

    if (slotUpdateError) {
      console.log(
        slotUpdateError
      );

      alert(
        "Order created, but the delivery slot could not be updated. Please contact support."
      );

      setLoading(false);

      return;
    }

    // =========================
    // SUCCESS
    // =========================

    clearCart();

    navigate("/orders");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-5xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}

        <h1 className="text-3xl font-bold mb-8">
          Checkout 🛒
        </h1>

        {/* =========================
            ADDRESS
        ========================= */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-4">
            📍 Delivery Address
          </h2>

          {addresses.length === 0 ? (

            <div className="text-gray-500">
              No delivery addresses found.
            </div>

          ) : (

            addresses.map(
              (address) => (

                <div
                  key={address.id}

                  onClick={() =>
                    setSelectedAddress(
                      address
                    )
                  }

                  className={`
                    border
                    rounded-xl
                    p-4
                    mb-3
                    cursor-pointer
                    transition

                    ${
                      selectedAddress?.id ===
                      address.id

                        ? "border-orange-500 bg-orange-50"

                        : "border-gray-200 hover:border-orange-300"
                    }
                  `}
                >

                  <p className="font-bold">
                    {address.label}
                  </p>

                  <p>
                    {address.address_line}
                  </p>

                  <p>
                    {address.city}{" "}
                    {address.postcode}
                  </p>

                </div>

              )
            )

          )}

        </div>

        {/* =========================
            DELIVERY SLOTS
        ========================= */}

        <div className="bg-white rounded-2xl shadow p-6 mb-6">

          <h2 className="text-xl font-bold mb-5">
            🚚 Choose delivery date & time
          </h2>

          {loadingSlots ? (

            <div className="text-gray-500 py-5">
              Loading delivery slots...
            </div>

          ) : deliverySlots.length === 0 ? (

            <div className="bg-orange-50 text-orange-700 rounded-xl p-4">
              No delivery slots are available at the moment.
            </div>

          ) : (

            Object.entries(
              groupedSlots
            ).map(
              ([date, slotsForDate]) => (

                <div
                  key={date}
                  className="mb-8"
                >

                  {/* DATE */}

                  <h3 className="text-lg font-bold mb-4">
                    📅{" "}
                    {formatDisplayDate(
                      date
                    )}
                  </h3>

                  {/* SLOTS */}

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

                    {slotsForDate.map(
                      (slot) => {

                        const remaining =
                          Number(
                            slot.capacity ||
                              0
                          ) -
                          Number(
                            slot.booked ||
                              0
                          );

                        const isAvailable =
                          slot.available ===
                            true &&
                          remaining > 0;

                        const isSelected =
                          selectedSlot?.id ===
                          slot.id;

                        return (

                          <button
                            key={slot.id}
                            type="button"

                            disabled={
                              !isAvailable
                            }

                            onClick={() =>
                              setSelectedSlot(
                                slot
                              )
                            }

                            className={`
                              border
                              rounded-xl
                              p-4
                              text-left
                              transition

                              ${
                                isSelected

                                  ? "bg-orange-500 text-white border-orange-500"

                                  : isAvailable

                                  ? "bg-white border-gray-200 hover:border-orange-500 hover:bg-orange-50"

                                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              }
                            `}
                          >

                            <div className="font-bold text-lg">
                              ⏰{" "}
                              {formatSlot(
                                slot
                              )}
                            </div>

                            {/* CUSTOMER DOES NOT SEE CAPACITY */}

                            <div
                              className={`
                                text-sm
                                mt-2
                                font-semibold

                                ${
                                  isSelected

                                    ? "text-white"

                                    : isAvailable

                                    ? "text-green-600"

                                    : "text-red-500"
                                }
                              `}
                            >

                              {isAvailable
                                ? "🟢 Available"
                                : "🔴 Fully booked"}

                            </div>

                          </button>

                        );
                      }
                    )}

                  </div>

                </div>

              )
            )

          )}

        </div>

        {/* =========================
            SELECTED DELIVERY
        ========================= */}

        {selectedSlot && (

          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">

            <h3 className="font-bold text-lg mb-2">
              Your delivery
            </h3>

            <p>
              📅{" "}
              {formatDisplayDate(
                selectedSlot.date
              )}
            </p>

            <p>
              ⏰{" "}
              {formatSlot(
                selectedSlot
              )}
            </p>

            <p className="text-green-600 font-semibold mt-2">
              🟢 Available
            </p>

          </div>

        )}

        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold mb-5">
            🛒 Order Summary
          </h2>

          {cart.length === 0 ? (

            <p className="text-gray-500">
              Your cart is empty.
            </p>

          ) : (

            cart.map(
              (item) => (

                <div
                  key={item.id}

                  className="
                    flex
                    justify-between
                    border-b
                    py-3
                  "
                >

                  <span>
                    {item.name} x{" "}
                    {item.quantity}
                  </span>

                  <span className="font-bold">
                    £
                    {(
                      Number(
                        item.price
                      ) *
                      Number(
                        item.quantity
                      )
                    ).toFixed(2)}
                  </span>

                </div>

              )
            )

          )}

          {/* TOTAL */}

          <div className="mt-5 text-xl font-bold">

            Total:{" "}

            <span className="text-orange-500">
              £{total.toFixed(2)}
            </span>

          </div>

          {/* PLACE ORDER */}

          <button
            onClick={placeOrder}

            disabled={
              loading ||
              !selectedAddress ||
              !selectedSlot ||
              cart.length === 0
            }

            className={`
              mt-6
              w-full
              py-4
              rounded-full
              font-bold
              text-lg
              transition

              ${
                loading ||
                !selectedAddress ||
                !selectedSlot ||
                cart.length === 0

                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"

                  : "bg-orange-500 text-white hover:bg-orange-600"
              }
            `}
          >

            {loading
              ? "Creating order..."
              : "Place Order 🚚"}

          </button>

        </div>

      </div>

    </div>
  );
}

export default Checkout;