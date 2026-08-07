import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminEditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);



  const [product, setProduct] = useState({

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

    loadData();

  },[]);






  async function loadData(){


    setLoading(true);



    const [
      productResponse,
      storesResponse,
      categoriesResponse
    ] = await Promise.all([


      supabase

        .from("Products")

        .select("*")

        .eq("id",id)

        .single(),



      supabase

        .from("Stores")

        .select("*")

        .order("name"),




      supabase

        .from("Categories")

        .select("*")

        .order("name")

    ]);





    if(productResponse.error){

      alert(productResponse.error.message);

      return;

    }





    if(storesResponse.error){

      alert(storesResponse.error.message);

      return;

    }





    if(categoriesResponse.error){

      alert(categoriesResponse.error.message);

      return;

    }







    const data = productResponse.data;



    setProduct({

      name:data.name || "",

      description:data.description || "",

      image:data.image || "",

      price:data.price || "",

      offer_price:data.offer_price || "",

      brand:data.brand || "",

      stock:data.stock || 0,

      available:data.available ?? true,

      store_id:data.store_id || "",

      category_id:data.category_id || ""

    });




    setStores(storesResponse.data || []);

    setCategories(categoriesResponse.data || []);

    setLoading(false);


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


    setSaving(true);



    const {error}=await supabase

      .from("Products")

      .update({

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

        store_id:product.store_id || null,

        category_id:product.category_id || null

      })

      .eq("id",id);







    if(error){

      alert(error.message);

      setSaving(false);

      return;

    }




    alert("✅ Product updated");


    navigate("/admin/products");


  }








  async function deleteProduct(){


    const confirmDelete = window.confirm(
      "Delete this product?"
    );



    if(!confirmDelete){

      return;

    }




    const {error}=await supabase

      .from("Products")

      .delete()

      .eq("id",id);





    if(error){

      alert(error.message);

      return;

    }




    alert("✅ Product deleted");

    navigate("/admin/products");


  }









  if(loading){

    return (

      <div className="p-8">

        Loading...

      </div>

    );

  }








  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto bg-white shadow rounded-2xl p-8">



        <h1 className="text-3xl font-bold mb-6">

          ✏️ Edit Product

        </h1>





        <div className="space-y-4">





          <input

            name="name"

            value={product.name}

            onChange={handleChange}

            className="w-full border p-3 rounded"

            placeholder="Product name"

          />





          <input

            name="brand"

            value={product.brand}

            onChange={handleChange}

            className="w-full border p-3 rounded"

            placeholder="Brand"

          />






          <textarea

            name="description"

            value={product.description}

            onChange={handleChange}

            className="w-full border p-3 rounded"

            placeholder="Description"

          />






          <input

            name="image"

            value={product.image}

            onChange={handleChange}

            className="w-full border p-3 rounded"

            placeholder="Image URL"

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

            className="w-full border p-3 rounded"

            placeholder="Price"

          />







          <input

            name="offer_price"

            value={product.offer_price}

            onChange={handleChange}

            type="number"

            className="w-full border p-3 rounded"

            placeholder="Offer price"

          />







          <input

            name="stock"

            value={product.stock}

            onChange={handleChange}

            type="number"

            className="w-full border p-3 rounded"

            placeholder="Stock"

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







          <div className="flex gap-3 mt-6">



            <button

              onClick={saveProduct}

              style={{

                background:"#16a34a",

                color:"white",

                padding:"12px 20px",

                borderRadius:"10px",

                fontWeight:"bold"

              }}

            >

              💾 {saving ? "Saving..." : "Save Product"}

            </button>






            <button

              onClick={deleteProduct}

              style={{

                background:"#dc2626",

                color:"white",

                padding:"12px 20px",

                borderRadius:"10px",

                fontWeight:"bold"

              }}

            >

              🗑 Delete

            </button>






            <button

              onClick={()=>navigate("/admin/products")}

              style={{

                background:"#6b7280",

                color:"white",

                padding:"12px 20px",

                borderRadius:"10px"

              }}

            >

              Cancel

            </button>



          </div>





        </div>



      </div>


    </div>


  );


}


export default AdminEditProduct;