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
      data,
      error
    } = await supabase.auth.getUser();





    if (error) {

      console.log(error);

      setLoading(false);

      return;

    }






    const currentUser = data.user;





    console.log("AUTH USER:", currentUser);





    if (!currentUser) {

      setLoading(false);

      return;

    }





    setUser(currentUser);







    const {

      data: profileData,

      error: profileError

    } = await supabase


      .from("Profiles")


      .select("*")


      .eq("user_id", currentUser.id)


      .maybeSingle();







    console.log("PROFILE DATA:", profileData);

    console.log("PROFILE ERROR:", profileError);







    if (profileData) {

      setProfile(profileData);

    }





    setLoading(false);



  }









  if (loading) {


    return (

      <div

        style={{

          padding:"30px"

        }}

      >

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

          padding:"25px",

          marginTop:"20px"

        }}

      >





        <h2>

          👤{" "}

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





      </div>









      <div

        style={{

          background:"white",

          border:"1px solid #ddd",

          borderRadius:"15px",

          padding:"25px",

          marginTop:"20px"

        }}

      >





        <h2>

          Personal Information

        </h2>







        <p>

          📧 Email:

          {" "}

          {user?.email || "-"}

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









      <div

        style={{

          background:"white",

          border:"1px solid #ddd",

          borderRadius:"15px",

          padding:"25px",

          marginTop:"20px"

        }}

      >





        <h2>

          📦 Orders

        </h2>





        <p>

          Your orders will appear here.

        </p>





      </div>







    </div>


  );


}





export default Profile;