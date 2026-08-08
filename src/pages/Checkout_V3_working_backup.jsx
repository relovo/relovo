import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

function Checkout({ cart, clearCart }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [deliverySlots, setDeliverySlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // --------------------------------------------------
  // LOAD CHECKOUT
  // --------------------------------------------------

  useEffect(() => {
    loadCheckout();
  }, []);

  // --------------------------------------------------
  // LOAD DELIVERY SLOTS WHEN DATE CHANGES
  // --------------------------------------------------

  useEffect(() => {
    if (selectedDate) {
      loadDeliverySlots(selectedDate);
    } else {
      setDeliverySlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  // --------------------------------------------------
  // LOAD USER + ADDRESSES
  // --------------------------------------------------

  async function loadCheckout() {
    const {
      data: sessionData,
    } = await supabase.auth.getSession();

    const currentUser = sessionData.session?.user;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const {
      data,
      error,
    } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", currentUser.id);

    if (error) {
      console.log(error);
      alert(error.message);
      return;
    }

    setAddresses(data || []);

    if (data?.length > 0) {
      setSelectedAddress(data[0]);
    }
  }

  // --------------------------------------------------
  // LOCAL DATE FORMAT
  // --------------------------------------------------

  function formatDateForDatabase(date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // --------------------------------------------------
  // LOAD DELIVERY SLOTS FROM SUPABASE
  // --------------------------------------------------

  async function loadDeliverySlots(date) {
    setLoadingSlots(true);
    setSelectedSlot(null);

    const dateString =
      formatDateForDatabase(date);

    const {
      data,
      error,
    } = await supabase
      .from("Delivery_Slots")
      .select("*")
      .eq("date", dateString)
      .eq("available", true)
      .order("start_time", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      alert(error.message);

      setDeliverySlots([]);
      setLoadingSlots(false);
      return;
    }

    const availableSlots = (data || []).filter(
      (slot) =>
        Number(slot.booked || 0) <
        Number(slot.capacity || 0)
    );

    setDeliverySlots(availableSlots);

    setLoadingSlots(false);
  }

  // --------------------------------------------------
  // GENERATE NEXT 7 DAYS
  // --------------------------------------------------

  function generateDates() {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);

      date.setDate(
        date.getDate() + i
      );

      days.push(date);
    }

    return days;
  }

  const deliveryDates = generateDates();

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // --------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------

  async function placeOrder() {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      alert(
        "Please select a delivery address"
      );
      return;
    }

    if (!selectedDate) {
      alert(
        "Please select a delivery date"
      );
      return;
    }

    if (!selectedSlot) {
      alert(
        "Please select a delivery time slot"
      );
      return;
    }

    // Check slot availability one more time
    // before creating the order.

    const {
      data: currentSlot,
      error: slotCheckError,
    } = await supabase
      .from("Delivery_Slots")
      .select("*")
      .eq("id", selectedSlot.id)
      .single();

    if (slotCheckError) {
      console.log(slotCheckError);

      alert(
        slotCheckError.message
      );

      return;
    }

    if (!currentSlot) {
      alert(
        "Delivery slot not found."
      );

      return;
    }

    if (
      !currentSlot.available ||
      Number(currentSlot.booked) >=
        Number(currentSlot.capacity)
    ) {
      alert(
        "Sorry, this delivery slot is now full. Please select another slot."
      );

      loadDeliverySlots(selectedDate);

      return;
    }

    setLoading(true);

    const deliveryDate =
      formatDateForDatabase(
        selectedDate
      );

    const deliverySlot =
      `${selectedSlot.start_time} - ${selectedSlot.end_time}`;

    const customerAddress =
      `${selectedAddress.address_line}, ${selectedAddress.city}, ${selectedAddress.postcode}`;

    // --------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------

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
          Number(total.toFixed(2)),

        status: "Pending",
      })
      .select()
      .single();

    if (orderError) {
      console.log(orderError);

      alert(orderError.message);

      setLoading(false);

      return;
    }

    // --------------------------------------------------
    // CREATE ORDER ITEMS
    // --------------------------------------------------

    const orderItems = cart.map(
      (item) => ({
        order_id: order.id,

        product_id: item.id,

        product_name: item.name,

        quantity:
          Number(item.quantity),

        price:
          Number(item.price),
      })
    );

    const {
      error: itemError,
    } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemError) {
      console.log(itemError);

      alert(itemError.message);

      setLoading(false);

      return;
    }

    // --------------------------------------------------
    // UPDATE DELIVERY SLOT
    // --------------------------------------------------

    const newBooked =
      Number(currentSlot.booked || 0) + 1;

    const newAvailable =
      newBooked <
      Number(currentSlot.capacity || 0);

    const {
      error: updateSlotError,
    } = await supabase
      .from("Delivery_Slots")
      .update({
        booked: newBooked,

        available:
          newAvailable,
      })
      .eq(
        "id",
        selectedSlot.id
      );

    if (updateSlotError) {
      console.log(
        updateSlotError
      );

      // The order has already been created.
      // We do not delete the order here.
      // We simply notify the user.

      alert(
        "Order created, but the delivery slot could not be updated."
      );

      setLoading(false);

      clearCart();

      navigate("/orders");

      return;
    }

    // --------------------------------------------------
    // FINISH
    // --------------------------------------------------

    clearCart();

    navigate("/orders");
  }

  // --------------------------------------------------
  // RETURN
  // --------------------------------------------------

  return (
    <div className="
      min-h-screen
      bg-gray-50
      p-6
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

          Checkout 🛒

        </h1>

        {/* ADDRESS */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            📍 Delivery Address

          </h2>

          {addresses.length === 0 ? (

            <div className="
              bg-orange-50
              rounded-xl
              p-4
            ">

              <p className="font-semibold">
                No delivery address found.
              </p>

              <button
                onClick={() =>
                  navigate("/addresses")
                }
                className="
                  mt-3
                  bg-orange-500
                  text-white
                  px-5
                  py-2
                  rounded-full
                  font-semibold
                "
              >
                Add Address
              </button>

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

                        : "border-gray-200"
                    }
                  `}
                >

                  <p className="
                    font-bold
                  ">

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

        {/* DELIVERY DATE */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            📅 Choose delivery day

          </h2>

          <div className="
            grid
            grid-cols-2
            sm:grid-cols-4
            md:grid-cols-7
            gap-3
          ">

            {deliveryDates.map(
              (date) => (

                <button
                  key={date.toISOString()}

                  onClick={() =>
                    setSelectedDate(
                      date
                    )
                  }

                  className={`
                    p-3
                    rounded-xl
                    border
                    transition

                    ${
                      selectedDate?.toDateString() ===
                      date.toDateString()

                        ? "bg-orange-500 text-white"

                        : "bg-white hover:bg-orange-50"
                    }
                  `}
                >

                  <div className="
                    font-bold
                  ">

                    {date.toLocaleDateString(
                      "en-GB",
                      {
                        weekday:
                          "short",
                      }
                    )}

                  </div>

                  <div className="
                    text-lg
                    font-bold
                  ">

                    {date.getDate()}

                  </div>

                  <div className="
                    text-xs
                  ">

                    {date.toLocaleDateString(
                      "en-GB",
                      {
                        month:
                          "short",
                      }
                    )}

                  </div>

                </button>

              )
            )}

          </div>

        </div>

        {/* DELIVERY TIME */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            ⏰ Delivery time

          </h2>

          {!selectedDate ? (

            <p className="
              text-gray-500
            ">

              Please select a delivery day
              first.

            </p>

          ) : loadingSlots ? (

            <p className="
              text-gray-500
            ">

              Loading available slots...

            </p>

          ) : deliverySlots.length ===
            0 ? (

            <div className="
              bg-orange-50
              rounded-xl
              p-4
            ">

              <p className="
                font-semibold
              ">

                No delivery slots available
                for this day.

              </p>

              <p className="
                text-sm
                text-gray-500
                mt-1
              ">

                Please choose another day.

              </p>

            </div>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-4
            ">

              {deliverySlots.map(
                (slot) => {

                  const remaining =
                    Number(
                      slot.capacity
                    ) -
                    Number(
                      slot.booked || 0
                    );

                  return (

                    <button
                      key={slot.id}

                      onClick={() =>
                        setSelectedSlot(
                          slot
                        )
                      }

                      className={`
                        border
                        rounded-xl
                        p-4
                        font-semibold
                        text-left
                        transition

                        ${
                          selectedSlot?.id ===
                          slot.id

                            ? "bg-orange-500 text-white border-orange-500"

                            : "bg-white hover:bg-orange-50"
                        }
                      `}
                    >

                      <div className="
                        text-lg
                        font-bold
                      ">

                        {slot.start_time}
                        {" - "}
                        {slot.end_time}

                      </div>

                      <div className="
                        text-sm
                        mt-2
                        opacity-80
                      ">

                        {remaining}{" "}
                        {remaining === 1
                          ? "delivery"
                          : "deliveries"}{" "}
                        available

                      </div>

                    </button>

                  );
                }
              )}

            </div>

          )}

        </div>

        {/* ORDER SUMMARY */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-5
          ">

            🛒 Order Summary

          </h2>

          {cart.length === 0 ? (

            <p className="
              text-gray-500
            ">

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

                    {item.name}

                    {" x "}

                    {item.quantity}

                  </span>

                  <span className="
                    font-bold
                  ">

                    £
                    {
                      (
                        Number(item.price) *
                        Number(item.quantity)
                      ).toFixed(2)
                    }

                  </span>

                </div>

              )
            )

          )}

          <div className="
            mt-5
            text-xl
            font-bold
          ">

            Total: £
            {total.toFixed(2)}

          </div>

          {/* SELECTED DELIVERY */}

          {selectedDate &&
            selectedSlot && (

              <div className="
                mt-5
                bg-orange-50
                rounded-xl
                p-4
              ">

                <p>

                  📅 Delivery:{" "}

                  {selectedDate.toLocaleDateString(
                    "en-GB"
                  )}

                </p>

                <p>

                  ⏰ Slot:{" "}

                  {
                    selectedSlot.start_time
                  }

                  {" - "}

                  {
                    selectedSlot.end_time
                  }

                </p>

              </div>

            )}

          <button
            onClick={placeOrder}

            disabled={
              loading ||
              cart.length === 0
            }

            className={`
              mt-6
              w-full
              text-white
              py-4
              rounded-full
              font-bold
              text-lg

              ${
                loading ||
                cart.length === 0

                  ? "bg-gray-400 cursor-not-allowed"

                  : "bg-orange-500 hover:bg-orange-600"
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