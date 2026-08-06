import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";


function Register() {


  const navigate = useNavigate();


  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);





  async function handleRegister() {


    if (!name || !email || !password) {

      alert("Please complete all fields");

      return;

    }



    setLoading(true);




    const {

      data,

      error

    } = await supabase.auth.signUp({

      email,

      password,

    });





    if (error) {

      alert(error.message);

      setLoading(false);

      return;

    }





    const user = data.user;




    if (user) {


      const {

        error: profileError

      } = await supabase

        .from("profiles")

        .insert([

          {

            id: user.id,

            full_name: name,

          }

        ]);





      if (profileError) {

        alert(profileError.message);

        setLoading(false);

        return;

      }


    }





    alert("Account created 🎉");


    navigate("/profile");


    setLoading(false);


  }





  return (


    <div className="
      min-h-screen
      bg-gray-50
      flex
      items-center
      justify-center
      px-4
    ">


      <div className="
        bg-white
        p-8
        rounded-2xl
        shadow
        w-full
        max-w-md
      ">


        <h1 className="
          text-3xl
          font-bold
          mb-6
          text-center
        ">

          🚚 Create Relovo Account

        </h1>




        <input

          className="
            w-full
            border
            p-3
            rounded-lg
            mb-3
          "

          placeholder="Full name"

          value={name}

          onChange={(e)=>setName(e.target.value)}

        />





        <input

          className="
            w-full
            border
            p-3
            rounded-lg
            mb-3
          "

          placeholder="Email"

          value={email}

          onChange={(e)=>setEmail(e.target.value)}

        />





        <input

          className="
            w-full
            border
            p-3
            rounded-lg
            mb-5
          "

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>setPassword(e.target.value)}

        />





        <button

          onClick={handleRegister}

          disabled={loading}

          className="
            w-full
            bg-orange-500
            text-white
            py-3
            rounded-lg
            font-bold
          "

        >

          {loading ? "Creating..." : "Register"}

        </button>




      </div>


    </div>


  );


}


export default Register;