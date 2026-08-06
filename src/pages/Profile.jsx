import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Profile() {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);


  const [newAddress, setNewAddress] = useState({

    label: "Home",
    address_line: "",
    city: "",
    postcode: "",
    instructions: ""

  });




  useEffect(() => {

    loadProfile();

  }, []);





  async function loadProfile() {


    const {
      data
    } = await supabase.auth.getUser();



    const currentUser = data.user;



    if (!currentUser) {

      setLoading(false);
      return;

    }



    setUser(currentUser);




    const {
      data: profileData
    } = await supabase

      .from("Profiles")

      .select("*")

      .eq("user_id", currentUser.id)

      .maybeSingle();



    setProfile(profileData);




    const {
      data: addressData,
      error
    } = await supabase

      .from("addresses")

      .select("*")

      .eq("user_id", currentUser.id)

      .order("created_at", {
        ascending:false
      });



    if(error){

      console.log(error);

    }


    setAddresses(addressData || []);

    setLoading(false);

  }







  async function addAddress(){


    if(
      !newAddress.address_line ||
      !newAddress.city ||
      !newAddress.postcode
    ){

      alert("Complete address fields");

      return;

    }



    const {
      error
    } = await supabase

      .from("addresses")

      .insert([

        {

          user_id:user.id,

          ...newAddress

        }

      ]);



    if(error){

      console.log(error);

      alert(error.message);

      return;

    }



    setNewAddress({

      label:"Home",
      address_line:"",
      city:"",
      postcode:"",
      instructions:""

    });



    loadProfile();


  }







  if(loading){

    return (

      <div style={{padding:"30px"}}>

        Loading profile...

      </div>

    );

  }






  return (

    <div

      style={{

        maxWidth:"800px",

        margin:"40px auto",

        padding:"20px"

      }}

    >



      <h1>

        👤 My Profile

      </h1>





      <div className="card">

        <h2>

          👤 {profile

          ?

          `${profile.first_name} ${profile.last_name}`

          :

          "Guest User"}

        </h2>


        <p>

          📧 {user?.email}

        </p>


        <p>

          📱 {profile?.phone || "-"}

        </p>


        <p>

          👤 Role: {profile?.role || "customer"}

        </p>

      </div>






      <div className="card">

        <h2>

          📍 My Addresses

        </h2>



        {

          addresses.length === 0

          ?

          <p>

            No saved addresses

          </p>

          :

          addresses.map(address=>(


            <div

              key={address.id}

              style={{

                borderBottom:"1px solid #ddd",

                padding:"10px 0"

              }}

            >

              <strong>

                🏠 {address.label}

              </strong>


              <p>

                {address.address_line}

              </p>


              <p>

                {address.city}

                {" "}

                {address.postcode}

              </p>


              {

                address.instructions &&

                <small>

                  📝 {address.instructions}

                </small>

              }


            </div>


          ))

        }



      </div>








      <div className="card">


        <h2>

          ➕ Add Address

        </h2>




        <input

          placeholder="Label"

          value={newAddress.label}

          onChange={(e)=>

            setNewAddress({

              ...newAddress,

              label:e.target.value

            })

          }

        />



        <input

          placeholder="Address"

          value={newAddress.address_line}

          onChange={(e)=>

            setNewAddress({

              ...newAddress,

              address_line:e.target.value

            })

          }

        />



        <input

          placeholder="City"

          value={newAddress.city}

          onChange={(e)=>

            setNewAddress({

              ...newAddress,

              city:e.target.value

            })

          }

        />



        <input

          placeholder="Postcode"

          value={newAddress.postcode}

          onChange={(e)=>

            setNewAddress({

              ...newAddress,

              postcode:e.target.value

            })

          }

        />



        <input

          placeholder="Instructions"

          value={newAddress.instructions}

          onChange={(e)=>

            setNewAddress({

              ...newAddress,

              instructions:e.target.value

            })

          }

        />




        <button

          onClick={addAddress}

        >

          Save Address 📍

        </button>


      </div>






    </div>

  );


}



export default Profile;