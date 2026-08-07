import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminEditProduct() {


  const { id } = useParams();

  const navigate = useNavigate();


  const [loading,setLoading] = useState(true);

  const [saving,setSaving] = useState(false);



  const [product,setProduct] = useState({

    name:"",
    description:"",
    image:"",
    price:"",
    offer_price:"",
    brand:"",
    stock:0,
    available:true

  });





  useEffect(()=>{

    loadProduct();

  },[]);








  async function loadProduct(){


    setLoading(true);



    const {data,error}=await supabase

      .from("Products")

      .select("*")

      .eq("id",id)

      .single();





    if(error){

      console.log(error);

      alert(error.message);

      setLoading(false);

      return;

    }





    setProduct({

      name:data.name || "",

      description:data.description || "",

      image:data.image || "",

      price:data.price || "",

      offer_price:data.offer_price || "",

      brand:data.brand || "",

      stock:data.stock || 0,

      available:data.available ?? true

    });



    setLoading(false);


  }









  function handleChange(e){


    const {name,value,type,checked}=e.target;


    setProduct(prev=>({

      ...prev,

      [name]:

        type==="checkbox"

        ? checked

        : value

    }));


  }









  async function updateProduct(){


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

        available:product.available

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






        <div className="space-y-4">





          <input

            name="name"

            value={product.name}

            onChange={handleChange}

            placeholder="Product name"

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







          <input

            name="brand"

            value={product.brand}

            onChange={handleChange}

            placeholder="Brand"

            className="w-full border p-3 rounded"

          />







          <input

            name="price"

            value={product.price}

            onChange={handleChange}

            placeholder="Price"

            type="number"

            className="w-full border p-3 rounded"

          />








          <input

            name="offer_price"

            value={product.offer_price}

            onChange={handleChange}

            placeholder="Offer price"

            type="number"

            className="w-full border p-3 rounded"

          />







          <input

            name="stock"

            value={product.stock}

            onChange={handleChange}

            placeholder="Stock"

            type="number"

            className="w-full border p-3 rounded"

          />







          <label className="flex gap-3 items-center">


            <input

              type="checkbox"

              name="available"

              checked={product.available}

              onChange={handleChange}

            />


            Available


          </label>







          <div className="flex gap-3 mt-6">





            <button

              onClick={updateProduct}

              disabled={saving}

              style={{

                background:"#16a34a",

                color:"white",

                padding:"12px 20px",

                borderRadius:"10px",

                fontWeight:"bold"

              }}

            >

              {saving ? "Saving..." : "💾 Save Product"}

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

                borderRadius:"10px",

                fontWeight:"bold"

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