import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Products() {


  const [Products, setProducts] = useState([]);

  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);


  const [search, setSearch] = useState("");

  const [selectedStore, setSelectedStore] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");


  const [editingId, setEditingId] = useState(null);



  const emptyForm = {

    name:"",
    description:"",
    image:"",
    price:"",
    offer_price:"",
    store_id:"",
    category_id:"",
    brand:"",
    available:true

  };



  const [form,setForm] = useState(emptyForm);



  const [loading,setLoading] = useState(false);









  useEffect(()=>{

    loadData();

  }, []);









  async function loadData(){



    const {data:ProductsData,error} = await supabase

      .from("Products")

      .select("*")

      .order(
        "created_at",
        {
          ascending:false
        }
      );



    if(error){

      console.log(error);

    } else {

      setProducts(ProductsData || []);

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









  async function saveProduct(){



    if(!form.name || !form.price){

      alert("Name and price required");

      return;

    }




    setLoading(true);




    const productData = {


      ...form,


      price:Number(form.price),


      offer_price:

      form.offer_price

      ?

      Number(form.offer_price)

      :

      null


    };









    let result;





    if(editingId){



      result = await supabase

      .from("Products")

      .update(productData)

      .eq(

        "id",

        editingId

      );



    } else {



      result = await supabase

      .from("Products")

      .insert(productData);



    }







    if(result.error){


      console.log(result.error);

      alert(result.error.message);



    } else {



      alert(

        editingId

        ?

        "Product updated"

        :

        "Product added"

      );



      setForm(emptyForm);

      setEditingId(null);

      loadData();



    }





    setLoading(false);



  }









  function editProduct(product){



    setEditingId(product.id);



    setForm({

      name:product.name || "",

      description:product.description || "",

      image:product.image || "",

      price:product.price || "",

      offer_price:product.offer_price || "",

      store_id:product.store_id || "",

      category_id:product.category_id || "",

      brand:product.brand || "",

      available:product.available


    });



    window.scrollTo({

      top:0,

      behavior:"smooth"

    });



  }






  async function deleteProduct(id){



    const confirmDelete = window.confirm(

      "Delete this product?"

    );



    if(!confirmDelete) return;




    const {error}=await supabase

      .from("Products")

      .delete()

      .eq(

        "id",

        id

      );





    if(error){

      alert(error.message);

    } else {


      loadData();


    }



  }

    const filteredProducts = Products.filter(product => {


    const matchSearch =

      product.name

      ?.toLowerCase()

      .includes(

        search.toLowerCase()

      );



    const matchStore =

      selectedStore

      ?

      product.store_id === selectedStore

      :

      true;



    const matchCategory =

      selectedCategory

      ?

      product.category_id === selectedCategory

      :

      true;



    return (

      matchSearch &&

      matchStore &&

      matchCategory

    );


  });










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

            {
              editingId

              ?

              "Edit Product"

              :

              "Add New Product"
            }

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

                stores.map(store => (

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

                categories.map(category => (

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







          <div className="flex gap-4 mt-5">


            <button

              onClick={saveProduct}

              disabled={loading}

              className="
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

                editingId

                ?

                "Update Product"

                :

                "Add Product"

              }


            </button>






            {

              editingId && (


                <button

                  onClick={() => {

                    setEditingId(null);

                    setForm(emptyForm);

                  }}

                  className="
                    bg-gray-300
                    px-6
                    py-3
                    rounded-full
                  "

                >

                  Cancel

                </button>


              )

            }



          </div>






        </div>









        <div className="
          bg-white
          rounded-2xl
          shadow
          p-6
          mb-8
        ">


          <div className="
            grid
            md:grid-cols-3
            gap-4
          ">


            <input

              placeholder="🔍 Search product"

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              className="border p-3 rounded-xl"

            />





            <select

              value={selectedStore}

              onChange={(e)=>setSelectedStore(e.target.value)}

              className="border p-3 rounded-xl"

            >

              <option value="">

                All stores

              </option>


              {

                stores.map(store => (

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

              value={selectedCategory}

              onChange={(e)=>setSelectedCategory(e.target.value)}

              className="border p-3 rounded-xl"

            >

              <option value="">

                All categories

              </option>



              {

                categories.map(category => (

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


        </div>








        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">


          {

            filteredProducts.map(product => (


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
                      "

                    />

                  )

                }






                <h3 className="
                  font-bold
                  text-lg
                  mt-4
                ">

                  {product.name}

                </h3>





                <p>

                  £{product.price}

                </p>





                {

                  product.offer_price && (

                    <p className="
                      text-orange-500
                      font-bold
                    ">

                      Offer £{product.offer_price}

                    </p>

                  )

                }







                <div className="
                  flex
                  gap-3
                  mt-5
                ">


                  <button

                    onClick={()=>editProduct(product)}

                    className="
                      bg-blue-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                    "

                  >

                    ✏️ Edit

                  </button>





                  <button

                    onClick={()=>deleteProduct(product.id)}

                    className="
                      bg-red-500
                      text-white
                      px-4
                      py-2
                      rounded-xl
                    "

                  >

                    🗑 Delete

                  </button>



                </div>




              </div>


            ))

          }


        </div>






      </div>


    </div>


  );


}



export default Products;
