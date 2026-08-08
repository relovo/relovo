import { useNavigate } from "react-router-dom";

function Cart({
  cart,
  open,
  closeCart,
  removeFromCart,
  updateQuantity,
}) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  function increaseQuantity(id) {
    const item = cart.find((item) => item.id === id);

    if (!item) {
      return;
    }

    updateQuantity(id, item.quantity + 1);
  }

  function decreaseQuantity(id) {
    const item = cart.find((item) => item.id === id);

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      removeFromCart(id);
      return;
    }

    updateQuantity(id, item.quantity - 1);
  }

  return (
    <>
      {/* OVERLAY */}

      {open && (
        <div
          onClick={closeCart}
          className="
            fixed
            inset-0
            bg-black/40
            z-40
          "
        />
      )}

      {/* CART DRAWER */}

      <div
        className={`
          fixed
          top-0
          right-0
          h-full
          w-full
          sm:w-[400px]
          bg-white
          shadow-2xl
          z-50
          transform
          transition-transform
          duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}

        <div
          className="
            flex
            justify-between
            items-center
            p-5
            border-b
          "
        >
          <h2 className="text-2xl font-bold">
            🛒 Your Cart
          </h2>

          <button
            onClick={closeCart}
            className="
              text-xl
              hover:text-orange-500
            "
          >
            ✕
          </button>
        </div>

        {/* PRODUCTS */}

        <div
          className="
            p-5
            overflow-y-auto
            h-[calc(100%-170px)]
          "
        >
          {cart.length === 0 ? (
            <p
              className="
                text-gray-500
                text-center
                mt-10
              "
            >
              Your cart is empty
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="
                  flex
                  gap-4
                  border-b
                  py-4
                "
              >
                {/* IMAGE */}

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      w-20
                      h-20
                      rounded-lg
                      object-cover
                      bg-gray-100
                    "
                  />
                ) : (
                  <div
                    className="
                      w-20
                      h-20
                      rounded-lg
                      bg-gray-100
                      flex
                      items-center
                      justify-center
                      text-gray-400
                    "
                  >
                    🛒
                  </div>
                )}

                {/* PRODUCT INFO */}

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <p
                    className="
                      text-orange-500
                      font-bold
                    "
                  >
                    £{Number(item.price || 0).toFixed(2)}
                  </p>

                  {/* QUANTITY */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      mt-2
                    "
                  >
                    {/* MINUS */}

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-gray-200
                        hover:bg-gray-300
                        font-bold
                      "
                    >
                      −
                    </button>

                    {/* QUANTITY */}

                    <span className="font-bold min-w-[20px] text-center">
                      {item.quantity}
                    </span>

                    {/* PLUS */}

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-orange-500
                        text-white
                        hover:bg-orange-600
                        font-bold
                      "
                    >
                      +
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="
                        ml-auto
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      🗑️
                    </button>
                  </div>

                  {/* ITEM TOTAL */}

                  <p className="text-sm text-gray-500 mt-2">
                    Item total: £
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}

        <div
          className="
            absolute
            bottom-0
            w-full
            bg-white
            border-t
            p-5
          "
        >
          <div
            className="
              flex
              justify-between
              text-xl
              font-bold
              mb-4
            "
          >
            <span>Total</span>

            <span className="text-orange-500">
              £{total.toFixed(2)}
            </span>
          </div>

          {cart.length > 0 && (
            <button
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
              className="
                w-full
                bg-orange-500
                text-white
                py-3
                rounded-full
                font-bold
                hover:bg-orange-600
              "
            >
              Checkout 🚚
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;