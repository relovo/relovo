import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function AdminProducts() {


  const [products, setProducts] = useState([]);

  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);


  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);





  useEffect(() => {

    loadProducts();

  }, []);






  async function loadProducts(){


    setLoading(true);



    const { data: productsData, error } = await supabase

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

    }

    else{

      setProducts(productsData || []);

    }








    const { data: storesData } = await supabase

      .from("Stores")

      .select("*");



    setStores(storesData || []);







    const { data: categoriesData } = await supabase

      .from("Categories")

      .select("*");



    setCategories(categoriesData || []);




    setLoading(false);


  }









  function getStoreName(id){


    const store = stores.find(

      item => item.id === id

    );


    return store ? store.name : "No store";


  }








  function getCategoryName(id){


    const category = categories.find(

      item => item.id === id

    );


    return category ? category.name : "No category";


  }









  const filteredProducts = products.filter(product =>


    product.name

      ?.toLowerCase()

      .includes(

        search.toLowerCase()

      )


  );









  async function deleteProduct(id){



    const confirmDelete = window.confirm(

      "Delete product?"

    );



    if(!confirmDelete){

      return;

    }





    const {error} = await supabase

      .from("Products")

      .delete()

      .eq(

        "id",

        id

      );





    if(error){

      alert(error.message);

    }

    else{

      loadProducts();

    }


  }









  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-7xl mx-auto">



        <h1 className="text-4xl font-bold mb-8">

          🛒 Relovo Admin Products

        </h1>





        <div className="bg-white rounded-2xl shadow p-6 mb-8">


          <input

            value={search}

            onChange={(e)=>setSearch(e.target.value)}

            placeholder="Search products..."

            className="border p-3 rounded-xl w-full"

          />


        </div>







        {loading && (

          <p>

            Loading products...

          </p>

        )}







        <div className="grid md:grid-cols-3 gap-6">



          {filteredProducts.map(product => (



            <div

              key={product.id}

              className="bg-white rounded-2xl shadow p-5"

            >




              {product.image && (

                <img

                  src={product.image}

                  alt={product.name}

                  className="w-full h-40 object-cover rounded-xl"

                />

              )}






              <h2 className="text-xl font-bold mt-4">

                {product.name}

              </h2>






              <p className="text-gray-500">

                🏪 {getStoreName(product.store_id)}

              </p>






              <p className="text-gray-500">

                📂 {getCategoryName(product.category_id)}

              </p>







              <p className="font-bold mt-3">

                £{product.price}

              </p>






              {product.offer_price && (

                <p className="text-orange-500 font-bold">

                  Offer £{product.offer_price}

                </p>

              )}







              <p className="mt-3">

                Stock: {product.stock ?? 0}

              </p>







              <p>

                {product.available

                ?

                "🟢 Available"

                :

                "🔴 Not available"

                }

              </p>







              <button

                onClick={()=>deleteProduct(product.id)}

                className="bg-red-500 text-white px-5 py-2 rounded-xl mt-5"

              >

                Delete

              </button>




            </div>


          ))}



        </div>


      </div>


    </div>


  );


}



export default AdminProducts;