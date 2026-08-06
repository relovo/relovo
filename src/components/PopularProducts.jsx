function PopularProducts({
  products,
  addToCart
}) {


  const popular = products.slice(0, 4)



  return (

    <section

      style={{

        marginBottom: '30px'

      }}

    >


      <h2>
        ⭐ Popular Products
      </h2>



      <div

        style={{

          display: 'flex',

          gap: '15px',

          flexWrap: 'wrap'

        }}

      >



        {popular.map(product => (



          <div

            key={product.id}

            style={{

              width: '220px',

              border: '1px solid #ddd',

              borderRadius: '12px',

              padding: '15px',

              background: 'white'

            }}

          >




            {product.image && (

              <img

                src={product.image}

                alt={product.name}

                style={{

                  width: '100%',

                  height: '130px',

                  objectFit: 'cover',

                  borderRadius: '10px'

                }}

              />

            )}





            <h3>

              {product.name}

            </h3>



            <p>

              £{product.price}

            </p>




            <button

              onClick={() => addToCart(product)}

            >

              Add to cart

            </button>



          </div>



        ))}




      </div>



    </section>

  )


}


export default PopularProducts