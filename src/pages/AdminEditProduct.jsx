import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminEditProduct() {


  const { id } = useParams();

  const navigate = useNavigate();



  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);




  const [form, setForm] = useState({

    name:"",
    description:"",
    image:"",
    price:"",
    offer_price:"",
    store_id:"",
    category_id:"",
    brand:"",
    stock:0,
    available:true

  });








  useEffect(()=>{

    loadProduct();

    loadOptions();

  },[]);










  async function loadProduct(){



    const {data,error}=await supabase

      .from("Products")

      .select("*")

      .eq("id",id)

      .single();




    if(error){

      console.log(error);

      return;

    }




    setForm({

      name:data.name || "",

      description:data.description || "",

      image:data.image || "",

      price:data.price || "",

      offer_price:data.offer_price || "",

      store_id:data.store_id || "",

      category_id:data.category_id || "",

      brand:data.brand || "",

      stock:data.stock || 0,

      available:data.available

    });



    setLoading(false);


  }









  async function loadOptions(){



    const {data:storesData}=await supabase

      .from("Stores")

      .select("*");



    setStores(storesData || []);







    const {data:categoriesData}=await supabase

      .from("Categories")

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









  async function updateProduct(e){


    e.preventDefault();





    const {error}=await supabase

      .from("Products")

      .update({

        name:form.name,

        description:form.description,

        image:form.image,

        price:Number(form.price),

        offer_price:

          form.offer_price

          ?

          Number(form.offer_price)

          :

          null,

        store_id:form.store_id,

        category_id:form.category_id,

        brand:form.brand,

        stock:Number(form.stock),

        available:form.available


      })

      .eq("id",id);







    if(error){


      alert(error.message);

      return;


    }







    alert("✅ Product updated");


    navigate("/admin/products");


  }









  if(loading){


    return (

      <div className="p-8">

        Loading product...

      </div>

    );


  }









  return (

    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">


        <h1 className="text-3xl font-bold mb-6">

          ✏️ Edit Product

        </h1>






        <form

          onSubmit={updateProduct}

          className="space-y-4"

        >





        <input

          name="name"

          value={form.name}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Product name"

        />





        <input

          name="brand"

          value={form.brand}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Brand"

        />






        <input

          name="image"

          value={form.image}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Image URL"

        />






        <textarea

          name="description"

          value={form.description}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Description"

        />






        <select

          name="store_id"

          value={form.store_id}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

        >

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

          value={form.category_id}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

        >

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

          type="number"

          step="0.01"

          value={form.price}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Price"

        />







        <input

          name="offer_price"

          type="number"

          step="0.01"

          value={form.offer_price}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Offer price"

        />







        <input

          name="stock"

          type="number"

          value={form.stock}

          onChange={handleChange}

          className="border p-3 rounded-xl w-full"

          placeholder="Stock"

        />







        <label className="flex gap-2">

          <input

            type="checkbox"

            name="available"

            checked={form.available}

            onChange={handleChange}

          />

          Available

        </label>








        <button

          type="submit"

          style={{

            background:"#2563eb",

            color:"white",

            padding:"12px 32px",

            borderRadius:"12px",

            fontWeight:"bold",

            cursor:"pointer"

          }}

        >

          💾 Update Product

        </button>






        </form>


      </div>


    </div>


  );


}



export default AdminEditProduct;