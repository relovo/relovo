import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminNewProduct() {


  const navigate = useNavigate();


  const [stores,setStores] = useState([]);

  const [categories,setCategories] = useState([]);

  const [saving,setSaving] = useState(false);


  const [product,setProduct] = useState({

    name:"",
    description:"",
    image:"",
    price:"",
    offer_price:"",
    brand:"",
    stock:0,
    available:true,
    store_id:"",
    category_id:""

  });





  useEffect(()=>{

    loadOptions();

  },[]);






  async function loadOptions(){


    const {data:storesData,error:storesError}=await supabase

      .from("Stores")

      .select("*")

      .order("name");



    if(storesError){

      console.log(storesError);

      alert(storesError.message);

      return;

    }





    const {data:categoriesData,error:categoriesError}=await supabase

      .from("Categories")

      .select("*")

      .order("name");



    if(categoriesError){

      console.log(categoriesError);

      alert(categoriesError.message);

      return;

    }




    setStores(storesData || []);

    setCategories(categoriesData || []);


  }








  function handleChange(e){


    const {
      name,
      value,
      type,
      checked
    } = e.target;



    setProduct(prev=>({

      ...prev,

      [name]:

        type==="checkbox"

        ? checked

        : value

    }));


  }










  async function saveProduct(){


    if(!product.name){

      alert("Product name required");

      return;

    }


    setSaving(true);





    const {error}=await supabase

      .from("Products")

      .insert([{

        name:product.name,

        description:product.description,

        image:product.image,

        price:Number(product.price),

        offer_price:

          product.offer_price

          ? Number(product.offer_price)

          : null,


        brand:product.brand,


        stock:Number(product.stock),


        available:product.available,


        store_id:

          product.store_id || null,


        category_id:

          product.category_id || null


      }]);







    if(error){

      console.log(error);

      alert(error.message);

      setSaving(false);

      return;

    }





    alert("✅ Product created");


    navigate("/admin/products");


  }









  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">



        <h1 className="text-3xl font-bold mb-6">

          ➕ New Product

        </h1>






        <div className="space-y-4">






          <input

            name="name"

            value={product.name}

            onChange={handleChange}

            placeholder="Product name"

            className="w-full border p-3 rounded"

          />







          <input

            name="brand"

            value={product.brand}

            onChange={handleChange}

            placeholder="Brand"

            className="w-full border p-3 rounded"

          />







          <textarea

            name="description"

            value={product.description}

            onChange={handleChange}

            placeholder="Description"

            className="w-full border p-3 rounded"

          />







          <input

            name="image"

            value={product.image}

            onChange={handleChange}

            placeholder="Image URL"

            className="w-full border p-3 rounded"

          />








          <select

            name="store_id"

            value={product.store_id}

            onChange={handleChange}

            className="w-full border p-3 rounded"

          >

            <option value="">

              Select Store

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

            name="category_id"

            value={product.category_id}

            onChange={handleChange}

            className="w-full border p-3 rounded"

          >

            <option value="">

              Select Category

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









          <input

            name="price"

            value={product.price}

            onChange={handleChange}

            type="number"

            placeholder="Price"

            className="w-full border p-3 rounded"

          />









          <input

            name="offer_price"

            value={product.offer_price}

            onChange={handleChange}

            type="number"

            placeholder="Offer price"

            className="w-full border p-3 rounded"

          />









          <input

            name="stock"

            value={product.stock}

            onChange={handleChange}

            type="number"

            placeholder="Stock"

            className="w-full border p-3 rounded"

          />









          <label className="flex gap-2 items-center">


            <input

              type="checkbox"

              name="available"

              checked={product.available}

              onChange={handleChange}

            />


            🟢 Available


          </label>









          <button

            onClick={saveProduct}

            disabled={saving}

            style={{

              background:"#16a34a",

              color:"white",

              padding:"12px 20px",

              borderRadius:"10px",

              fontWeight:"bold",

              width:"100%"

            }}

          >

            {saving ? "Saving..." : "💾 Save Product"}


          </button>






        </div>


      </div>


    </div>


  );


}



export default AdminNewProduct;