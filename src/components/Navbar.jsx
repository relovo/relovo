import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function Navbar({ cartItems, openCart }) {


  const navigate = useNavigate();


  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);





  useEffect(() => {


    getUser();



    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {


        const currentUser = session?.user || null;


        setUser(currentUser);



        if (currentUser) {

          loadProfile(currentUser.id);

        } else {

          setProfile(null);

        }


      }
    );




    return () => {

      listener.subscription.unsubscribe();

    };



  }, []);







  async function getUser() {


    const {
      data
    } = await supabase.auth.getSession();



    const currentUser = data.session?.user || null;



    setUser(currentUser);




    if(currentUser){

      loadProfile(currentUser.id);

    }



  }







  async function loadProfile(userId) {


    const {

      data,

      error

    } = await supabase


      .from("Profiles")


      .select("*")


      .eq("user_id", userId)


      .maybeSingle();





    if(error){

      console.log("PROFILE ERROR:", error);

      return;

    }





    console.log("NAVBAR PROFILE:", data);



    setProfile(data);



  }








  async function logout(){


    await supabase.auth.signOut();


    navigate("/login");


  }







  return (


    <nav
      className="
        bg-orange-500
        text-white
        shadow-md
        sticky
        top-0
        z-50
      "
    >



      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-4
          flex
          items-center
          justify-between
        "
      >



        <Link
          to="/"
          className="
            text-2xl
            font-bold
          "
        >

          🛒 Relovo

        </Link>







        <div
          className="
            flex
            items-center
            gap-6
          "
        >




          <Link
            to="/"
            className="hover:text-orange-100"
          >
            Home
          </Link>





          <Link
            to="/orders"
            className="hover:text-orange-100"
          >
            Orders
          </Link>





          <Link
            to="/profile"
            className="hover:text-orange-100"
          >
            Profile
          </Link>







          {
            user ? (

              <>


                <span className="font-semibold">

                  👋 {profile?.first_name || "User"}

                </span>





                <button

                  onClick={logout}

                  className="
                    bg-white
                    text-orange-500
                    px-3
                    py-2
                    rounded-full
                    font-semibold
                  "

                >

                  Logout

                </button>



              </>


            ) : (


              <>


                <Link
                  to="/login"
                  className="hover:text-orange-100"
                >

                  Login

                </Link>



                <Link
                  to="/register"
                  className="hover:text-orange-100"
                >

                  Register

                </Link>



              </>


            )

          }







          <button

            onClick={openCart}

            className="
              bg-white
              text-orange-500
              px-4
              py-2
              rounded-full
              font-semibold
            "

          >

            🛒


            {
              cartItems > 0 && (

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