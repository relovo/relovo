function Profile() {


  return (


    <div className="
      min-h-screen
      bg-gray-50
      py-10
      px-4
    ">


      <div className="
        max-w-4xl
        mx-auto
      ">



        <h1 className="
          text-3xl
          font-bold
          mb-8
        ">

          👤 My Profile

        </h1>








        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          p-6
          mb-6
        ">


          <div className="
            flex
            items-center
            gap-5
          ">



            <div className="
              w-20
              h-20
              rounded-full
              bg-orange-500
              text-white
              flex
              items-center
              justify-center
              text-3xl
              font-bold
            ">

              👤

            </div>





            <div>


              <h2 className="
                text-2xl
                font-bold
              ">

                Guest User

              </h2>



              <p className="
                text-gray-500
              ">

                Welcome to Relovo 🚚

              </p>



            </div>



          </div>



        </div>









        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mb-6
        ">



          <div className="
            bg-white
            rounded-xl
            p-5
            shadow-sm
          ">

            <p className="text-gray-500">

              📦 Orders

            </p>


            <h3 className="
              text-2xl
              font-bold
            ">

              0

            </h3>


          </div>







          <div className="
            bg-white
            rounded-xl
            p-5
            shadow-sm
          ">

            <p className="text-gray-500">

              💷 Total spent

            </p>


            <h3 className="
              text-2xl
              font-bold
            ">

              £0.00

            </h3>


          </div>







          <div className="
            bg-white
            rounded-xl
            p-5
            shadow-sm
          ">

            <p className="text-gray-500">

              ⭐ Points

            </p>


            <h3 className="
              text-2xl
              font-bold
            ">

              0

            </h3>


          </div>



        </div>









        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          p-6
          mb-6
        ">



          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            Personal Information

          </h2>





          <div className="
            space-y-3
            text-gray-700
          ">


            <p>

              📧 Email:
              {" "}
              Not connected

            </p>



            <p>

              📱 Phone:
              {" "}
              -

            </p>




            <p>

              📍 Default Address:
              {" "}
              -

            </p>



          </div>



        </div>









        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          p-6
        ">



          <h2 className="
            text-xl
            font-bold
            mb-4
          ">

            Account Features

          </h2>





          <div className="
            space-y-4
          ">


            <div>

              📍 Saved Addresses

            </div>



            <div>

              ❤️ Favourite Products

            </div>



            <div>

              💳 Payment Methods

            </div>



            <div>

              🔔 Notifications

            </div>



            <div>

              🎁 Loyalty Points

            </div>



            <div>

              ⚙️ Account Settings

            </div>



          </div>




        </div>






      </div>


    </div>


  );


}



export default Profile;