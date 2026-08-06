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

      className="
        bg-white
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition
        duration-300
        overflow-hidden
        border
        border-gray-100
      "

    >





      {/* IMAGE */}

      <div className="
        h-48
        bg-gray-100
        overflow-hidden
      ">


        {
          image ? (


            <img

              src={image}

              alt={product.name}

              className="
                w-full
                h-full
                object-cover
                hover:scale-105
                transition
                duration-300
              "

            />


          )


          :


          (

            <div

              className="
                h-full
                flex
                items-center
                justify-center
                text-gray-400
              "

            >

              No image

            </div>

          )

        }


      </div>







      {/* CONTENT */}


      <div className="
        p-5
      ">





        <h3 className="
          font-bold
          text-lg
          text-gray-800
          truncate
        ">

          {product.name}

        </h3>






        <p className="
          text-sm
          text-gray-500
          mt-2
        ">

          🏪 {storeName}

        </p>







        <div className="
          flex
          justify-between
          items-center
          mt-4
        ">



          <span className="
            text-xl
            font-bold
            text-orange-500
          ">


            £{Number(product.price).toFixed(2)}


          </span>






          <button

            onClick={handleAddToCart}

            className="
              bg-orange-500
              text-white
              px-4
              py-2
              rounded-full
              font-semibold
              hover:bg-orange-600
              transition
            "

          >

            Add 🛒


          </button>




        </div>





      </div>






    </div>


  );

}


export default ProductCard;