function DealsToday({
  products,
  addToCart
}) {


  const deals = products.slice(4, 8)



  return (

    <section

      style={{

        marginBottom: '30px'

      }}

    >


      <h2>
        🔥 Deals Today
      </h2>




      <div

        style={{

          display: 'flex',

          gap: '15px',

          flexWrap: 'wrap'

        }}

      >



        {deals.map(product => (



          <div

            key={product.id}

            style={{

              width: '220px',

              border: '2px solid #ff8c00',

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




            <p

              style={{

                textDecoration: 'line-through'

              }}

            >

              £{product.price}

            </p>





            <h3>

              SALE £

              {(product.price * 0.8).toFixed(2)}

            </h3>





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


export default DealsToday