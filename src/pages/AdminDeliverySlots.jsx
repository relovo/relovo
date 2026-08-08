import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

function AdminDeliverySlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const slotTimes = [
    {
      start: "09:00",
      end: "11:00",
    },
    {
      start: "11:00",
      end: "13:00",
    },
    {
      start: "13:00",
      end: "15:00",
    },
    {
      start: "15:00",
      end: "17:00",
    },
    {
      start: "17:00",
      end: "19:00",
    },
    {
      start: "19:00",
      end: "21:00",
    },
  ];

  useEffect(() => {
    loadSlots();
  }, []);

  // --------------------------------------------------
  // DATE
  // --------------------------------------------------

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

  function formatDateDisplay(dateString) {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString(
      "en-GB",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  // --------------------------------------------------
  // LOAD SLOTS
  // --------------------------------------------------

  async function loadSlots() {
    setLoading(true);

    const {
      data,
      error,
    } = await supabase
      .from("Delivery_Slots")
      .select("*")
      .order("date", {
        ascending: true,
      })
      .order("start_time", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      alert(error.message);
    } else {
      setSlots(data || []);
    }

    setLoading(false);
  }

  // --------------------------------------------------
  // GENERATE NEXT 14 DAYS
  // --------------------------------------------------

  async function generateSlots() {
    setGenerating(true);

    const slotsToCreate = [];

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    for (let day = 0; day < 14; day++) {
      const currentDate = new Date(today);

      currentDate.setDate(
        today.getDate() + day
      );

      const dateString =
        formatDate(currentDate);

      slotTimes.forEach((slot) => {
        slotsToCreate.push({
          date: dateString,

          start_time: slot.start,

          end_time: slot.end,

          capacity: 20,

          booked: 0,

          available: true,
        });
      });
    }

    // Get existing slots first
    const {
      data: existingSlots,
      error: existingError,
    } = await supabase
      .from("Delivery_Slots")
      .select(
        "date,start_time,end_time"
      );

    if (existingError) {
      console.log(existingError);

      alert(
        existingError.message
      );

      setGenerating(false);

      return;
    }

    const existingKeys = new Set(
      (existingSlots || []).map(
        (slot) =>
          `${slot.date}_${slot.start_time}_${slot.end_time}`
      )
    );

    const newSlots =
      slotsToCreate.filter(
        (slot) =>
          !existingKeys.has(
            `${slot.date}_${slot.start_time}_${slot.end_time}`
          )
      );

    if (newSlots.length === 0) {
      alert(
        "All delivery slots already exist."
      );

      setGenerating(false);

      return;
    }

    const {
      error: insertError,
    } = await supabase
      .from("Delivery_Slots")
      .insert(newSlots);

    if (insertError) {
      console.log(insertError);

      alert(
        insertError.message
      );

      setGenerating(false);

      return;
    }

    alert(
      `${newSlots.length} delivery slots created successfully.`
    );

    await loadSlots();

    setGenerating(false);
  }

  // --------------------------------------------------
  // TOGGLE AVAILABLE
  // --------------------------------------------------

  async function toggleAvailable(slot) {
    const {
      error,
    } = await supabase
      .from("Delivery_Slots")
      .update({
        available:
          !slot.available,
      })
      .eq("id", slot.id);

    if (error) {
      console.log(error);

      alert(error.message);

      return;
    }

    loadSlots();
  }

  // --------------------------------------------------
  // CHANGE CAPACITY
  // --------------------------------------------------

  async function changeCapacity(slot) {
    const newCapacity =
      window.prompt(
        "Enter new capacity:",
        slot.capacity
      );

    if (
      newCapacity === null
    ) {
      return;
    }

    const capacity =
      Number(newCapacity);

    if (
      !Number.isInteger(capacity) ||
      capacity < 1
    ) {
      alert(
        "Capacity must be a positive number."
      );

      return;
    }

    if (
      capacity <
      Number(slot.booked || 0)
    ) {
      alert(
        "Capacity cannot be lower than the number of booked deliveries."
      );

      return;
    }

    const {
      error,
    } = await supabase
      .from("Delivery_Slots")
      .update({
        capacity,
        available:
          Number(slot.booked || 0) <
          capacity,
      })
      .eq("id", slot.id);

    if (error) {
      console.log(error);

      alert(error.message);

      return;
    }

    loadSlots();
  }

  // --------------------------------------------------
  // GROUP BY DATE
  // --------------------------------------------------

  const groupedSlots =
    slots.reduce(
      (groups, slot) => {
        if (!groups[slot.date]) {
          groups[slot.date] = [];
        }

        groups[slot.date].push(slot);

        return groups;
      },
      {}
    );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="
      min-h-screen
      bg-gray-50
      p-6
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
          mb-8
        ">

          <div>

            <h1 className="
              text-3xl
              font-bold
            ">

              🚚 Delivery Slots

            </h1>

            <p className="
              text-gray-500
              mt-2
            ">

              Manage Relovo delivery
              dates and time slots.

            </p>

          </div>

          <button
            onClick={generateSlots}
            disabled={generating}
            className="
              bg-orange-500
              hover:bg-orange-600
              disabled:bg-gray-400
              text-white
              px-6
              py-3
              rounded-full
              font-bold
            "
          >

            {generating
              ? "Creating slots..."
              : "⚡ Generate next 14 days"}

          </button>

        </div>

        {/* INFO */}

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">

          <div className="
            grid
            md:grid-cols-4
            gap-4
          ">

            <div className="
              bg-orange-50
              rounded-xl
              p-4
            ">

              <p className="
                text-gray-500
                text-sm
              ">

                Total slots

              </p>

              <p className="
                text-2xl
                font-bold
              ">

                {slots.length}

              </p>

            </div>

            <div className="
              bg-green-50
              rounded-xl
              p-4
            ">

              <p className="
                text-gray-500
                text-sm
              ">

                Available

              </p>

              <p className="
                text-2xl
                font-bold
                text-green-600
              ">

                {
                  slots.filter(
                    (slot) =>
                      slot.available &&
                      Number(slot.booked) <
                        Number(slot.capacity)
                  ).length
                }

              </p>

            </div>

            <div className="
              bg-red-50
              rounded-xl
              p-4
            ">

              <p className="
                text-gray-500
                text-sm
              ">

                Full

              </p>

              <p className="
                text-2xl
                font-bold
                text-red-600
              ">

                {
                  slots.filter(
                    (slot) =>
                      Number(slot.booked) >=
                      Number(slot.capacity)
                  ).length
                }

              </p>

            </div>

            <div className="
              bg-blue-50
              rounded-xl
              p-4
            ">

              <p className="
                text-gray-500
                text-sm
              ">

                Bookings

              </p>

              <p className="
                text-2xl
                font-bold
                text-blue-600
              ">

                {
                  slots.reduce(
                    (sum, slot) =>
                      sum +
                      Number(
                        slot.booked || 0
                      ),
                    0
                  )
                }

              </p>

            </div>

          </div>

        </div>

        {/* SLOTS */}

        {loading ? (

          <div className="
            bg-white
            rounded-2xl
            shadow
            p-10
            text-center
          ">

            Loading delivery slots...

          </div>

        ) : slots.length === 0 ? (

          <div className="
            bg-white
            rounded-2xl
            shadow
            p-10
            text-center
          ">

            <p className="
              text-xl
              font-semibold
              mb-3
            ">

              No delivery slots yet.

            </p>

            <p className="
              text-gray-500
              mb-5
            ">

              Click the button above
              to automatically create
              the next 14 days.

            </p>

            <button
              onClick={generateSlots}
              className="
                bg-orange-500
                text-white
                px-6
                py-3
                rounded-full
                font-bold
              "
            >

              Generate slots

            </button>

          </div>

        ) : (

          <div className="
            space-y-6
          ">

            {Object.entries(
              groupedSlots
            ).map(
              ([date, dateSlots]) => (

                <div
                  key={date}
                  className="
                    bg-white
                    rounded-2xl
                    shadow
                    overflow-hidden
                  "
                >

                  <div className="
                    bg-gray-100
                    px-6
                    py-4
                    border-b
                  ">

                    <h2 className="
                      text-xl
                      font-bold
                    ">

                      📅{" "}
                      {formatDateDisplay(
                        date
                      )}

                    </h2>

                  </div>

                  <div className="
                    p-6
                    grid
                    md:grid-cols-2
                    lg:grid-cols-3
                    gap-4
                  ">

                    {dateSlots.map(
                      (slot) => {

                        const booked =
                          Number(
                            slot.booked || 0
                          );

                        const capacity =
                          Number(
                            slot.capacity || 0
                          );

                        const remaining =
                          Math.max(
                            capacity -
                              booked,
                            0
                          );

                        const full =
                          booked >=
                          capacity;

                        return (

                          <div
                            key={slot.id}
                            className="
                              border
                              rounded-2xl
                              p-5
                            "
                          >

                            <div className="
                              flex
                              justify-between
                              items-start
                              gap-3
                            ">

                              <div>

                                <p className="
                                  text-lg
                                  font-bold
                                ">

                                  ⏰{" "}
                                  {
                                    slot.start_time
                                  }

                                  {" - "}

                                  {
                                    slot.end_time
                                  }

                                </p>

                                <p className="
                                  text-sm
                                  text-gray-500
                                  mt-1
                                ">

                                  {booked} booked
                                  {" / "}
                                  {capacity}

                                </p>

                              </div>

                              <span
                                className={`
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-bold

                                  ${
                                    full

                                      ? "bg-red-100 text-red-600"

                                      : slot.available

                                      ? "bg-green-100 text-green-600"

                                      : "bg-gray-200 text-gray-600"
                                  }
                                `}
                              >

                                {full
                                  ? "FULL"
                                  : slot.available
                                  ? "AVAILABLE"
                                  : "BLOCKED"}

                              </span>

                            </div>

                            <div className="
                              mt-4
                            ">

                              <div className="
                                flex
                                justify-between
                                text-sm
                                mb-1
                              ">

                                <span>
                                  Remaining
                                </span>

                                <span className="
                                  font-bold
                                ">

                                  {remaining}

                                </span>

                              </div>

                              <div className="
                                w-full
                                h-2
                                bg-gray-200
                                rounded-full
                                overflow-hidden
                              ">

                                <div
                                  className={`
                                    h-full

                                    ${
                                      full
                                        ? "bg-red-500"
                                        : "bg-orange-500"
                                    }
                                  `}
                                  style={{
                                    width:
                                      `${Math.min(
                                        (
                                          booked /
                                          Math.max(
                                            capacity,
                                            1
                                          )
                                        ) *
                                          100,
                                        100
                                      )}%`,
                                  }}
                                />

                              </div>

                            </div>

                            <div className="
                              flex
                              gap-2
                              mt-5
                            ">

                              <button
                                onClick={() =>
                                  toggleAvailable(
                                    slot
                                  )
                                }
                                className="
                                  flex-1
                                  bg-gray-100
                                  hover:bg-gray-200
                                  px-3
                                  py-2
                                  rounded-xl
                                  text-sm
                                  font-semibold
                                "
                              >

                                {slot.available
                                  ? "🔒 Block"
                                  : "🔓 Open"}

                              </button>

                              <button
                                onClick={() =>
                                  changeCapacity(
                                    slot
                                  )
                                }
                                className="
                                  flex-1
                                  bg-orange-100
                                  hover:bg-orange-200
                                  text-orange-700
                                  px-3
                                  py-2
                                  rounded-xl
                                  text-sm
                                  font-semibold
                                "
                              >

                                ✏️ Capacity

                              </button>

                            </div>

                          </div>

                        );
                      }
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDeliverySlots;