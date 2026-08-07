import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function AdminProducts() {


  const [products, setProducts] = useState([]);

  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);


  const [search, setSearch] = useState("");

  const [storeFilter, setStoreFilter] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");


  const [loading, setLoading] = useState(true);






  useEffect(() => {

    loadData();

  }, []);









  async function loadData(){


    setLoading(true);




    const {data: productsData, error: productsError} = await supabase

      .from("Products")

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








    const {data: storesData} = await supabase

      .from("Stores")

      .select("*");



    setStores(storesData || []);







    const {data: categoriesData} = await supabase

      .from("Categories")

      .select("*");



    setCategories(categoriesData || []);





    setLoading(false);


  }









  function storeName(id){


    const store = stores.find(

      s => s.id === id

    );


    return store?.name || "-";


  }







  function categoryName(id){


    const category = categories.find(

      c => c.id === id

    );


    return category?.name || "-";


  }









  const filteredProducts = products.filter(product => {



    const searchOK =

      product.name

      ?.toLowerCase()

      .includes(

        search.toLowerCase()

      );





    const storeOK =

      storeFilter

      ?

      product.store_id === storeFilter

      :

      true;






    const categoryOK =

      categoryFilter

      ?

      product.category_id === categoryFilter

      :

      true;






    return (

      searchOK &&

      storeOK &&

      categoryOK

    );


  });





    const totalProducts = products.length;


  const availableProducts = products.filter(

    product => product.available

  ).length;



  const outOfStock = products.filter(

    product => (product.stock ?? 0) <= 0

  ).length;




  const offers = products.filter(

    product => product.offer_price

  ).length;









  async function deleteProduct(id){


    const confirmDelete = window.confirm(

      "Delete this product?"

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

    } else {

      loadData();

    }



  }









  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-7xl mx-auto">



        <h1 className="text-4xl font-bold mb-8">

          🛒 Relovo Admin Products V3

        </h1>







        <div className="grid md:grid-cols-4 gap-5 mb-8">



          <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500">

              Total Products

            </p>

            <h2 className="text-3xl font-bold">

              {totalProducts}

            </h2>

          </div>






          <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500">

              Available

            </p>

            <h2 className="text-3xl font-bold">

              {availableProducts}

            </h2>

          </div>






          <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500">

              Out of Stock

            </p>

            <h2 className="text-3xl font-bold">

              {outOfStock}

            </h2>

          </div>






          <div className="bg-white rounded-2xl shadow p-5">

            <p className="text-gray-500">

              Offers

            </p>

            <h2 className="text-3xl font-bold">

              {offers}

            </h2>

          </div>



        </div>









        <div className="bg-white rounded-2xl shadow p-6 mb-8">


          <div className="grid md:grid-cols-3 gap-4">



            <input

              value={search}

              onChange={(e)=>setSearch(e.target.value)}

              placeholder="Search product..."

              className="border p-3 rounded-xl"

            />





            <select

              value={storeFilter}

              onChange={(e)=>setStoreFilter(e.target.value)}

              className="border p-3 rounded-xl"

            >

              <option value="">

                All Stores

              </option>



              {stores.map(store=>(

                <option

                  key={store.id}

                  value={store.id}

                >

                  {store.name}

                </option>

              ))}



            </select>







            <select

              value={categoryFilter}

              onChange={(e)=>setCategoryFilter(e.target.value)}

              className="border p-3 rounded-xl"

            >

              <option value="">

                All Categories

              </option>



              {categories.map(category=>(

                <option

                  key={category.id}

                  value={category.id}

                >

                  {category.name}

                </option>

              ))}



            </select>



          </div>


        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">


          <table className="w-full">


            <thead className="bg-gray-100">


              <tr>


                <th className="p-4 text-left">
                  Image
                </th>


                <th className="p-4 text-left">
                  Product
                </th>


                <th className="p-4 text-left">
                  Store
                </th>


                <th className="p-4 text-left">
                  Category
                </th>


                <th className="p-4 text-left">
                  Price
                </th>


                <th className="p-4 text-left">
                  Stock
                </th>


                <th className="p-4 text-left">
                  Status
                </th>


                <th className="p-4 text-left">
                  Action
                </th>


              </tr>


            </thead>





            <tbody>



              {filteredProducts.map(product => (



                <tr

                  key={product.id}

                  className="border-t"

                >



                  <td className="p-4">


                    {product.image ? (


                      <img

                        src={product.image}

                        alt={product.name}

                        className="w-16 h-16 rounded-xl object-cover"

                      />


                    )

                    :

                    (

                      <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">

                        📦

                      </div>

                    )

                    }


                  </td>








                  <td className="p-4 font-bold">


                    {product.name}



                    {product.offer_price && (


                      <p className="text-orange-500 text-sm">

                        🔥 Offer

                      </p>


                    )}


                  </td>







                  <td className="p-4">


                    🏪 {storeName(product.store_id)}


                  </td>







                  <td className="p-4">


                    📂 {categoryName(product.category_id)}


                  </td>







                  <td className="p-4">


                    <div>

                      £{product.price}

                    </div>



                    {product.offer_price && (


                      <div className="text-orange-500">


                        £{product.offer_price}


                      </div>


                    )}



                  </td>







                  <td className="p-4">


                    {product.stock ?? 0}



                  </td>







                  <td className="p-4">


                    {product.available ?


                      (

                        <span className="text-green-600 font-bold">

                          🟢 Available

                        </span>

                      )


                      :


                      (

                        <span className="text-red-600 font-bold">

                          🔴 Disabled

                        </span>

                      )


                    }


                  </td>







                  <td className="p-4">


                    <button


                      onClick={()=>deleteProduct(product.id)}


                      className="bg-red-500 text-white px-4 py-2 rounded-xl"


                    >

                      🗑 Delete


                    </button>



                  </td>






                </tr>



              ))}



            </tbody>




          </table>




        </div>





      </div>


    </div>


  );


}



export default AdminProducts;