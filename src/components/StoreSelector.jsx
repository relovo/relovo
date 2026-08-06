function StoreSelector({
  stores,
  selectedStore,
  setSelectedStore
}) {


  return (

    <div

      style={{

        display: 'flex',

        gap: '12px',

        flexWrap: 'wrap',

        marginBottom: '20px'

      }}

    >



      <button

        onClick={() => setSelectedStore('All')}

        style={{

          padding: '12px 18px',

          borderRadius: '20px',

          cursor: 'pointer'

        }}

      >

        🏪 All

      </button>




      {stores.map(store => (


        <button

          key={store.id}

          onClick={() => setSelectedStore(store.id)}

          style={{

            padding: '12px 18px',

            borderRadius: '20px',

            cursor: 'pointer'

          }}

        >


          {store.name}


        </button>


      ))}



    </div>

  )


}


export default StoreSelector