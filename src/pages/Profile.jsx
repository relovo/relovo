import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Profile() {

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    loadProfile();

  }, []);




  async function loadProfile() {


    const {
      data
    } = await supabase.auth.getUser();



    const currentUser = data.user;



    console.log("USER:", currentUser);



    if (!currentUser) {

      setLoading(false);
      return;

    }



    setUser(currentUser);



    const email =

      currentUser.email ||

      currentUser.user_metadata?.email ||

      currentUser.identities?.[0]?.identity_data?.email;



    console.log("SEARCH EMAIL:", email);





    const {

      data: profileData,

      error

    } = await supabase

      .from("Profiles")

      .select("*")

      .eq("email", email)

      .maybeSingle();





    console.log("PROFILE:", profileData);

    console.log("ERROR:", error);





    setProfile(profileData);

    setLoading(false);


  }







  if (loading) {

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





      <div

        style={{

          background:"white",

          border:"1px solid #ddd",

          borderRadius:"15px",

          padding:"25px"

        }}

      >



        <h2>

          👤

          {" "}

          {

          profile

          ?

          `${profile.first_name} ${profile.last_name}`

          :

          "Guest User"

          }

        </h2>



        <p>

          Welcome to Relovo 🚚

        </p>




        <p>

          📧 Email:

          {" "}

          {user?.email}

        </p>




        <p>

          📱 Phone:

          {" "}

          {profile?.phone || "-"}

        </p>




        <p>

          👤 Role:

          {" "}

          {profile?.role || "customer"}

        </p>




      </div>



    </div>

  );

}


export default Profile;