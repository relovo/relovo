function Categories({
  categories,
  selectedCategory,
  setSelectedCategory
}) {


  return (

    <div

      style={{

        display: 'flex',

        gap: '10px',

        flexWrap: 'wrap',

        marginBottom: '20px'

      }}

    >



      <button

        onClick={() => setSelectedCategory('All')}

        style={{

          padding: '10px 15px',

          borderRadius: '20px',

          cursor: 'pointer'

        }}

      >

        All

      </button>




      {categories.map(category => (


        <button

          key={category.id}

          onClick={() =>
            setSelectedCategory(category.id)
          }

          style={{

            padding: '10px 15px',

            borderRadius: '20px',

            cursor: 'pointer'

          }}

        >

          {category.name}

        </button>


      ))}



    </div>

  )


}


export default Categories