import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Addresses() {


  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);



  const [form, setForm] = useState({

    label: "Home",

    address_line: "",

    city: "",

    postcode: "",

    instructions: ""

  });





  useEffect(() => {

    loadUser();

  }, []);





  async function loadUser(){


    const {

      data

    } = await supabase.auth.getSession();



    const currentUser = data.session?.user;



    setUser(currentUser);



    if(currentUser){

      loadAddresses(currentUser.id);

    }


  }







  async function loadAddresses(userId){


    const {

      data,

      error

    } = await supabase


      .from("addresses")

      .select("*")

      .eq(

        "user_id",

        userId

      )

      .order(

        "created_at",

        {

          ascending:false

        }

      );



    console.log(
      "ADDRESSES:",
      data
    );



    console.log(
      "ADDRESS ERROR:",
      error
    );



    setAddresses(data || []);

    setLoading(false);


  }









  async function saveAddress(e){


    e.preventDefault();



    if(!user) return;



    const {

      error

    } = await supabase


      .from("addresses")


      .insert([


        {

          user_id:user.id,

          ...form

        }


      ]);





    if(error){

      console.log(error);

      alert(error.message);

      return;

    }




    alert(
      "Address saved 📍"
    );



    setForm({

      label:"Home",

      address_line:"",

      city:"",

      postcode:"",

      instructions:""

    });



    loadAddresses(user.id);


  }









  if(loading){

    return (

      <div className="p-10 text-center">

        Loading...

      </div>

    );

  }







  return (


    <div className="max-w-4xl mx-auto p-6">


      <h1 className="text-3xl font-bold">

        📍 My Addresses

      </h1>





      <form

        onSubmit={saveAddress}

        className="
        bg-white
        shadow
        rounded-xl
        p-6
        mt-6
        space-y-4
        "


      >


        <select

          className="border p-3 rounded w-full"

          value={form.label}

          onChange={e=>

            setForm({

              ...form,

              label:e.target.value

            })

          }

        >

          <option>Home</option>

          <option>Work</option>

          <option>Other</option>


        </select>





        <input

          className="border p-3 rounded w-full"

          placeholder="Address"

          value={form.address_line}

          onChange={e=>

            setForm({

              ...form,

              address_line:e.target.value

            })

          }

        />






        <input

          className="border p-3 rounded w-full"

          placeholder="City"

          value={form.city}

          onChange={e=>

            setForm({

              ...form,

              city:e.target.value

            })

          }

        />






        <input

          className="border p-3 rounded w-full"

          placeholder="Postcode"

          value={form.postcode}

          onChange={e=>

            setForm({

              ...form,

              postcode:e.target.value

            })

          }

        />







        <textarea

          className="border p-3 rounded w-full"

          placeholder="Delivery instructions"

          value={form.instructions}

          onChange={e=>

            setForm({

              ...form,

              instructions:e.target.value

            })

          }

        />





        <button

          className="
          bg-orange-500
          text-white
          px-6
          py-3
          rounded-full
          font-semibold
          "

        >

          Save Address 📍

        </button>




      </form>








      <div className="mt-8 space-y-4">


      {

        addresses.map(address => (


          <div

            key={address.id}

            className="
            bg-white
            shadow
            rounded-xl
            p-5
            "

          >


            <h2 className="font-bold text-xl">

              📍 {address.label}

            </h2>



            <p>

              {address.address_line}

            </p>


            <p>

              {address.city} {address.postcode}

            </p>



            {

              address.instructions &&

              <p className="text-gray-500">

                {address.instructions}

              </p>

            }



          </div>


        ))

      }


      </div>





    </div>


  );

}



export default Addresses;