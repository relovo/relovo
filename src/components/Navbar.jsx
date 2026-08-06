import { Link } from "react-router-dom";


function Navbar({ cartItems, openCart }) {


  return (

    <nav className="
      bg-orange-500
      text-white
      shadow-md
      sticky
      top-0
      z-50
    ">


      <div className="
        max-w-7xl
        mx-auto
        px-4
        py-4
        flex
        items-center
        justify-between
      ">



        {/* LOGO */}

        <Link
          to="/"
          className="
            text-2xl
            font-bold
          "
        >

          🛒 Relovo

        </Link>





        {/* MENU */}

        <div className="
          flex
          items-center
          gap-6
        ">


          <Link
            to="/"
            className="
              hover:text-orange-100
            "
          >
            Home
          </Link>



          <Link
            to="/orders"
            className="
              hover:text-orange-100
            "
          >
            Orders
          </Link>



          <Link
            to="/profile"
            className="
              hover:text-orange-100
            "
          >
            Profile
          </Link>






          {/* CART BUTTON */}

          <button

            onClick={openCart}

            className="
              bg-white
              text-orange-500
              px-4
              py-2
              rounded-full
              font-semibold
              hover:bg-orange-100
              transition
            "

          >

            🛒

            {
              cartItems > 0 &&
              (
                <span className="ml-2">
                  {cartItems}
                </span>
              )
            }


          </button>




        </div>



      </div>


    </nav>

  );

}


export default Navbar;