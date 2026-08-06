function ProductCard({ product, storeName, addToCart }) {


  const image =

    product.image ||

    product.image_url ||

    "";





  function handleAddToCart() {


    addToCart({

      id: Number(product.id),

      name: product.name,

      price: Number(product.price),

      image: image,

      store_id: product.store_id,

      category_id: product.category_id

    });


  }







  return (


    <div

      style={{

        border: "1px solid #ddd",

        borderRadius: "12px",

        padding: "15px",

        width: "220px",

        background: "white"

      }}

    >






      {

        image ? (


          <img

            src={image}

            alt={product.name}

            style={{

              width:"100%",

              height:"150px",

              objectFit:"cover",

              borderRadius:"10px"

            }}

          />


        )

        :


        (


          <div

            style={{

              height:"150px",

              display:"flex",

              alignItems:"center",

              justifyContent:"center",

              background:"#f5f5f5"

            }}

          >

            No image

          </div>


        )

      }









      <h3>

        {product.name}

      </h3>







      <p>

        🏪 {storeName}

      </p>







      <h3>

        £{Number(product.price).toFixed(2)}

      </h3>








      <button

        onClick={handleAddToCart}

        style={{

          padding:"10px",

          width:"100%",

          cursor:"pointer"

        }}

      >

        Add to cart 🛒

      </button>





    </div>


  );


}



export default ProductCard;