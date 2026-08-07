import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminNewProduct() {


  const navigate = useNavigate();


  const [stores, setStores] = useState([]);

  const [categories, setCategories] = useState([]);


  const [form, setForm] = useState({

    name: "",
    description: "",
    image: "",
    price: "",
    offer_price: "",
    store_id: "",
    category_id: "",
    brand: "",
    stock: 0,
    available: true

  });



  useEffect(() => {

    loadOptions();

  }, []);






  async function loadOptions(){


    const { data: storesData, error: storesError } = await supabase

      .from("Stores")

      .select("*");



    if(storesError){

      console.log(storesError);

    }


    setStores(storesData || []);







    const { data: categoriesData, error: categoriesError } = await supabase

      .from("Categories")

      .select("*");



    if(categoriesError){

      console.log(categoriesError);

    }


    setCategories(categoriesData || []);



  }









  function handleChange(e){


    const { name, value, type, checked } = e.target;



    setForm({

      ...form,


      [name]:

        type === "checkbox"

        ?

        checked

        :

        value


    });


  }









  async function saveProduct(e){


    e.preventDefault();




    const product = {


      name: form.name,

      description: form.description,

      image: form.image,


      price: Number(form.price),


      offer_price:

        form.offer_price

        ?

        Number(form.offer_price)

        :

        null,



      store_id: form.store_id,


      category_id: form.category_id,


      brand: form.brand,


      stock: Number(form.stock),


      available: form.available


    };







    const { error } = await supabase

      .from("Products")

      .insert([product]);







    if(error){


      alert(

        "Error: " + error.message

      );


      return;


    }







    alert("✅ Product created successfully");



    navigate("/admin/products");



  }









  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">



        <h1 className="text-3xl font-bold mb-6">

          ➕ Add New Product

        </h1>







        <form

          onSubmit={saveProduct}

          className="space-y-4"

        >







          <input

            name="name"

            placeholder="Product name"

            value={form.name}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

            required

          />







          <input

            name="brand"

            placeholder="Brand"

            value={form.brand}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

          />







          <textarea

            name="description"

            placeholder="Description"

            value={form.description}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

          />







          <input

            name="image"

            placeholder="Image URL"

            value={form.image}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

          />







          <select

            name="store_id"

            value={form.store_id}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

            required

          >

            <option value="">

              Select Store

            </option>


            {stores.map(store => (

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

            required

          >

            <option value="">

              Select Category

            </option>


            {categories.map(category => (

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

            placeholder="Price £"

            value={form.price}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

            required

          />







          <input

            name="offer_price"

            type="number"

            step="0.01"

            placeholder="Offer Price £"

            value={form.offer_price}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

          />







          <input

            name="stock"

            type="number"

            placeholder="Stock quantity"

            value={form.stock}

            onChange={handleChange}

            className="border p-3 rounded-xl w-full"

          />







          <label className="flex items-center gap-3">


            <input

              type="checkbox"

              name="available"

              checked={form.available}

              onChange={handleChange}

            />


            Product Available


          </label>







          <button


            type="submit"


            style={{


              backgroundColor:"#16a34a",

              color:"#ffffff",

              padding:"12px 32px",

              borderRadius:"12px",

              fontWeight:"bold",

              boxShadow:"0 4px 10px rgba(0,0,0,0.15)",

              cursor:"pointer"


            }}


          >

            ✅ Save Product


          </button>






        </form>


      </div>


    </div>


  );


}



export default AdminNewProduct;