import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Products() {


  const [products, setProducts] = useState([]);

  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);


  const [form, setForm] = useState({

    name:"",
    description:"",
    image:"",
    price:"",
    offer_price:"",
    store_id:"",
    category_id:"",
    brand:"",
    available:true

  });


  const [loading,setLoading] = useState(false);






  useEffect(()=>{

    loadData();

  }, []);









  async function loadData(){


    const {data:productsData,error:productsError}=await supabase

      .from("products")

      .select("*")

      .order(
        "created_at",
        {
          ascending:false
        }
      );



    if(productsError){

      console.log(productsError);

    } else {

      setProducts(productsData || []);

    }






    const {data:storesData}=await supabase

      .from("stores")

      .select("*");



    setStores(storesData || []);








    const {data:categoriesData}=await supabase

      .from("categories")

      .select("*");



    setCategories(categoriesData || []);


  }









  function handleChange(e){


    const {name,value,type,checked}=e.target;


    setForm({

      ...form,

      [name]:

      type==="checkbox"

      ?

      checked

      :

      value

    });


  }









  async function addProduct(){


    if(!form.name || !form.price){

      alert("Name and price required");

      return;

    }




    setLoading(true);




    const {error}=await supabase

      .from("products")

      .insert({

        ...form,

        price:Number(form.price),

        offer_price:

          form.offer_price

          ?

          Number(form.offer_price)

          :

          null

      });





    if(error){

      console.log(error);

      alert(error.message);

    } else {


      alert("Product added");

      setForm({

        name:"",
        description:"",
        image:"",
        price:"",
        offer_price:"",
        store_id:"",
        category_id:"",
        brand:"",
        available:true

      });


      loadData();


    }



    setLoading(false);


  }









  return (

    <div className="
      min-h-screen
      bg-gray-50
      p-8
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">


        <h1 className="
          text-4xl
          font-bold
          mb-8
        ">

          🛒 Relovo Products Manager

        </h1>








        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">


          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            Add New Product

          </h2>







          <div className="
            grid
            md:grid-cols-2
            gap-4
          ">





            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="border p-3 rounded-xl"
            />



            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border p-3 rounded-xl"
            />



            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="border p-3 rounded-xl"
            />



            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-3 rounded-xl"
            />



            <input
              name="offer_price"
              value={form.offer_price}
              onChange={handleChange}
              placeholder="Offer price"
              className="border p-3 rounded-xl"
            />







            <select

              name="store_id"

              value={form.store_id}

              onChange={handleChange}

              className="border p-3 rounded-xl"

            >

              <option value="">

                Select store

              </option>


              {
                stores.map(store=>(

                  <option

                    key={store.id}

                    value={store.id}

                  >

                    {store.name}

                  </option>

                ))
              }


            </select>







            <select

              name="category_id"

              value={form.category_id}

              onChange={handleChange}

              className="border p-3 rounded-xl"

            >

              <option value="">

                Select category

              </option>



              {
                categories.map(category=>(

                  <option

                    key={category.id}

                    value={category.id}

                  >

                    {category.name}

                  </option>

                ))
              }


            </select>







          </div>





          <textarea

            name="description"

            value={form.description}

            onChange={handleChange}

            placeholder="Description"

            className="
              border
              p-3
              rounded-xl
              w-full
              mt-4
            "

          />






          <label className="
            flex
            gap-3
            mt-4
          ">


            <input

              type="checkbox"

              name="available"

              checked={form.available}

              onChange={handleChange}

            />


            Available


          </label>







          <button

            onClick={addProduct}

            disabled={loading}

            className="
              mt-5
              bg-orange-500
              text-white
              px-6
              py-3
              rounded-full
              font-bold
            "

          >

            {
              loading
              ?
              "Saving..."
              :
              "Add Product"
            }


          </button>






        </div>









        <div className="
          grid
          md:grid-cols-3
          gap-5
        ">


          {
            products.map(product=>(


              <div

                key={product.id}

                className="
                  bg-white
                  rounded-2xl
                  shadow
                  p-5
                "

              >


                {
                  product.image && (

                    <img

                      src={product.image}

                      className="
                        w-full
                        h-40
                        object-cover
                        rounded-xl
                        mb-4
                      "

                    />

                  )
                }




                <h3 className="font-bold text-lg">

                  {product.name}

                </h3>



                <p>

                  £{product.price}

                </p>


                {

                  product.offer_price && (

                    <p className="text-orange-500 font-bold">

                      Offer £{product.offer_price}

                    </p>

                  )

                }



              </div>


            ))
          }


        </div>






      </div>


    </div>

  );


}


export default Products;