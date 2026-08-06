import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

import ProductCard from "../components/ProductCard";
import Filters from "../components/Filters";
import Categories from "../components/Categories";
import StoreSelector from "../components/StoreSelector";
import Hero from "../components/Hero";
import PopularProducts from "../components/PopularProducts";
import DealsToday from "../components/DealsToday";


function Home({ addToCart }) {

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedStore, setSelectedStore] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");



  useEffect(() => {
    getData();
  }, []);




  async function getData() {


    const {
      data: productsData,
      error: productsError
    } = await supabase
      .from("Products")
      .select("*")
      .eq("available", true);



    const {
      data: storesData,
      error: storesError
    } = await supabase
      .from("Stores")
      .select("*");



    const {
      data: categoriesData,
      error: categoriesError
    } = await supabase
      .from("Categories")
      .select("*");




    if (productsError)
      console.log(productsError);


    if (storesError)
      console.log(storesError);


    if (categoriesError)
      console.log(categoriesError);



    setProducts(productsData || []);
    setStores(storesData || []);
    setCategories(categoriesData || []);

    setLoading(false);

  }





  function getStoreName(storeId) {

    const store = stores.find(
      item => item.id === storeId
    );


    return store
      ? store.name
      : "Unknown";

  }






  const filteredProducts = products.filter(product => {


    const matchesStore =
      selectedStore === "All"
      ||
      product.store_id === selectedStore;



    const matchesCategory =
      selectedCategory === "All"
      ||
      product.category_id === selectedCategory;




    const matchesSearch =
      product.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        );



    return (
      matchesStore &&
      matchesCategory &&
      matchesSearch
    );

  });







  return (

    <div className="min-h-screen bg-gray-50">


      <section className="max-w-7xl mx-auto px-4 py-6">


        <Hero />


        <div className="mt-8">
          <PopularProducts
            products={products}
            addToCart={addToCart}
          />
        </div>



        <div className="mt-8">
          <DealsToday
            products={products}
            addToCart={addToCart}
          />
        </div>



        <div className="mt-10">

          <h1 className="text-4xl font-bold text-gray-800">
            Grocery delivery 🚚
          </h1>


          <p className="text-gray-500 mt-2">
            Fresh products delivered to your door
          </p>

        </div>





        <div className="mt-8 bg-white rounded-2xl shadow p-5">


          <Filters

            stores={stores}

            categories={categories}

            selectedStore={selectedStore}

            setSelectedStore={setSelectedStore}

            selectedCategory={selectedCategory}

            setSelectedCategory={setSelectedCategory}

            search={search}

            setSearch={setSearch}

          />

        </div>





        <div className="mt-6">

          <StoreSelector

            stores={stores}

            selectedStore={selectedStore}

            setSelectedStore={setSelectedStore}

          />

        </div>






        <div className="mt-6">


          <Categories

            categories={categories}

            selectedCategory={selectedCategory}

            setSelectedCategory={setSelectedCategory}

          />


        </div>







        {
          loading && (

            <div className="text-center py-10">

              <p className="text-orange-500 text-lg">
                Loading products...
              </p>

            </div>

          )
        }









        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-6
          mt-8
        ">


          {
            filteredProducts.map(product => (


              <ProductCard


                key={product.id}


                product={product}


                storeName={
                  getStoreName(product.store_id)
                }


                addToCart={addToCart}


              />


            ))
          }


        </div>







        {
          !loading &&
          filteredProducts.length === 0 && (

            <div className="text-center py-10">

              <p className="text-gray-500">
                No products found
              </p>

            </div>

          )
        }





      </section>


    </div>

  );

}


export default Home;