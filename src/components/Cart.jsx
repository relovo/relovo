import { useNavigate } from "react-router-dom";


function Cart({

  cart,

  removeFromCart,

  increaseQuantity,

  decreaseQuantity

}) {


  const navigate = useNavigate();





  const total = cart.reduce(

    (sum, item) =>

      sum + item.price * item.quantity,

    0

  );






  return (


    <div

      style={{

        position:"fixed",

        right:"20px",

        bottom:"20px",

        width:"320px",

        background:"white",

        border:"1px solid #ddd",

        borderRadius:"15px",

        padding:"20px",

        boxShadow:"0 5px 20px rgba(0,0,0,0.15)"

      }}

    >






      <h2>

        🛒 Cart

      </h2>







      {

        cart.length === 0

        ?

        (

          <p>

            Your cart is empty

          </p>

        )


        :


        (

          cart.map(item => (



            <div

              key={item.id}

              style={{

                marginBottom:"15px",

                borderBottom:"1px solid #eee",

                paddingBottom:"10px"

              }}

            >



              <strong>

                {item.name}

              </strong>





              <p>

                £{item.price.toFixed(2)}

              </p>





              <button

                onClick={() =>

                  decreaseQuantity(item.id)

                }

              >

                -

              </button>





              <span

                style={{

                  margin:"0 10px"

                }}

              >

                {item.quantity}

              </span>





              <button

                onClick={() =>

                  increaseQuantity(item.id)

                }

              >

                +

              </button>






              <button

                onClick={() =>

                  removeFromCart(item.id)

                }

                style={{

                  marginLeft:"10px"

                }}

              >

                ❌

              </button>





            </div>



          ))

        )



      }







      <h3>

        Total: £{total.toFixed(2)}

      </h3>








      {

        cart.length > 0 &&

        (

          <button

            onClick={() =>

              navigate("/checkout")

            }

            style={{

              width:"100%",

              padding:"12px",

              background:"#ff8c00",

              color:"white",

              border:"none",

              borderRadius:"10px",

              cursor:"pointer"

            }}

          >

            Checkout 🚚

          </button>

        )

      }






    </div>


  );


}



export default Cart;