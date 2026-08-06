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

    loadData();

  }, []);






  async function loadData() {


    setLoading(true);



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







    if (productsError) {

      console.log(
        "Products error:",
        productsError
      );

    }



    if (storesError) {

      console.log(
        "Stores error:",
        storesError
      );

    }



    if (categoriesError) {

      console.log(
        "Categories error:",
        categoriesError
      );

    }







    setProducts(productsData || []);

    setStores(storesData || []);

    setCategories(categoriesData || []);



    setLoading(false);


  }








  function getStoreName(storeId) {


    const store = stores.find(

      (store) =>

        store.id === storeId

    );



    return store

      ? store.name

      : "Unknown";


  }







  const filteredProducts = products.filter(

    (product) => {


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


    }

  );
    return (

    <div>


      <Hero />



      <PopularProducts

        products={products}

        addToCart={addToCart}

      />



      <DealsToday

        products={products}

        addToCart={addToCart}

      />





      <h2>

        Grocery delivery 🚚

      </h2>






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







      <StoreSelector

        stores={stores}

        selectedStore={selectedStore}

        setSelectedStore={setSelectedStore}

      />








      <Categories

        categories={categories}

        selectedCategory={selectedCategory}

        setSelectedCategory={setSelectedCategory}

      />







      {

        loading &&

        (

          <p>

            Loading products...

          </p>

        )

      }








      <div

        style={{

          display:"flex",

          flexWrap:"wrap",

          gap:"15px"

        }}

      >



        {

          filteredProducts.map(

            (product) => (


              <ProductCard


                key={product.id}


                product={product}


                storeName={

                  getStoreName(

                    product.store_id

                  )

                }


                addToCart={addToCart}


              />


            )

          )

        }



      </div>








      {

        !loading &&

        filteredProducts.length === 0 &&

        (

          <p>

            No products found

          </p>

        )

      }





    </div>

  );


}



export default Home;