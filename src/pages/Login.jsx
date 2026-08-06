import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";


function Login() {


  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);






  async function handleLogin() {


    if (!email || !password) {

      alert("Please enter email and password");

      return;

    }



    setLoading(true);




    const {

      error

    } = await supabase.auth.signInWithPassword({

      email,

      password,

    });





    if (error) {


      alert(error.message);

      setLoading(false);

      return;


    }







    alert("Welcome back 🚚");



    navigate("/profile");



    setLoading(false);



  }







  return (


    <div
      className="
        min-h-screen
        bg-gray-50
        flex
        items-center
        justify-center
        px-4
      "
    >



      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow
          w-full
          max-w-md
        "
      >



        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-6
          "
        >
          🔐 Login to Relovo
        </h1>






        <input

          className="
            w-full
            border
            rounded-lg
            p-3
            mb-3
          "

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />







        <input

          className="
            w-full
            border
            rounded-lg
            p-3
            mb-5
          "

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />







        <button

          onClick={handleLogin}

          disabled={loading}

          className="
            w-full
            bg-orange-500
            hover:bg-orange-600
            text-white
            py-3
            rounded-lg
            font-bold
          "

        >

          {loading ? "Logging in..." : "Login"}

        </button>





      </div>



    </div>


  );


}



export default Login;