function Filters({
  stores,
  categories,
  selectedStore,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch
}) {


  return (

    <div

      style={{

        padding: '20px',

        background: '#f7f7f7',

        borderRadius: '12px',

        marginBottom: '20px'

      }}

    >


      <input

        type="text"

        placeholder="🔍 Search products..."

        value={search}

        onChange={(e) => setSearch(e.target.value)}

        style={{

          width: '100%',

          padding: '12px',

          marginBottom: '15px',

          borderRadius: '8px',

          border: '1px solid #ddd'

        }}

      />




      <h4>
        Supermarkets
      </h4>


      <button

        onClick={() => setSelectedStore('All')}

      >

        All

      </button>


      {stores.map(store => (

        <button

          key={store.id}

          onClick={() => setSelectedStore(store.id)}

          style={{

            marginLeft: '8px'

          }}

        >

          {store.name}

        </button>

      ))}




      <h4>
        Categories
      </h4>



      <button

        onClick={() => setSelectedCategory('All')}

      >

        All

      </button>



      {categories.map(category => (

        <button

          key={category.id}

          onClick={() => setSelectedCategory(category.id)}

          style={{

            marginLeft: '8px'

          }}

        >

          {category.name}

        </button>

      ))}



    </div>

  )

}


export default Filters