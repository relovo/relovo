import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";


function AdminProducts() {


  const navigate = useNavigate();


  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);




  useEffect(() => {

    loadProducts();

  }, []);





  async function loadProducts(){


    setLoading(true);



    const { data, error } = await supabase

      .from("Products")

      .select("*")

      .order("id", {
        ascending:false
      });





    if(error){

      console.log(error);

      alert(error.message);

      setLoading(false);

      return;

    }



    setProducts(data || []);

    setLoading(false);


  }







  async function deleteProduct(id){


    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );


    if(!confirmDelete){

      return;

    }





    const { error } = await supabase

      .from("Products")

      .delete()

      .eq("id", id);





    if(error){

      alert(error.message);

      return;

    }





    alert("✅ Product deleted");


    loadProducts();


  }








  if(loading){

    return (

      <div className="p-8">

        Loading products...

      </div>

    );

  }







  return (


    <div className="min-h-screen bg-gray-50 p-8">


      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-8">





        <div className="flex justify-between items-center mb-6">


          <h1 className="text-3xl font-bold">

            📦 Admin Products

          </h1>




          <button

            onClick={() =>
              navigate("/admin/products/new")
            }

            style={{

              background:"#16a34a",

              color:"white",

              padding:"12px 20px",

              borderRadius:"12px",

              fontWeight:"bold",

              cursor:"pointer"

            }}

          >

            ➕ New Product

          </button>



        </div>








        <div className="overflow-x-auto">


          <table className="w-full border-collapse">


            <thead>


              <tr className="border-b">


                <th className="p-3 text-left">
                  Image
                </th>


                <th className="p-3 text-left">
                  Product
                </th>


                <th className="p-3 text-left">
                  Price
                </th>


                <th className="p-3 text-left">
                  Stock
                </th>


                <th className="p-3 text-left">
                  Status
                </th>


                <th className="p-3 text-left">
                  Actions
                </th>


              </tr>


            </thead>







            <tbody>


            {products.map(product => (


              <tr
                key={product.id}
                className="border-b"
              >




                <td className="p-3">


                  {product.image && (

                    <img

                      src={product.image}

                      alt={product.name}

                      className="w-16 h-16 object-cover rounded"

                    />

                  )}


                </td>






                <td className="p-3">


                  <b>

                    {product.name}

                  </b>


                  <br/>


                  <span className="text-gray-500">

                    {product.brand}

                  </span>


                </td>








                <td className="p-3">


                  £{product.price}


                  {product.offer_price && (

                    <div className="text-green-600">

                      Offer £{product.offer_price}

                    </div>

                  )}


                </td>








                <td className="p-3">

                  {product.stock ?? 0}

                </td>








                <td className="p-3">


                  {product.available ? (

                    <span className="text-green-600 font-bold">

                      🟢 Available

                    </span>


                  ) : (


                    <span className="text-red-600 font-bold">

                      🔴 Hidden

                    </span>


                  )}


                </td>









                <td className="p-3">


                  <div className="flex gap-2">


                    <button

                      onClick={() =>
                        navigate(
                          `/admin/products/edit/${product.id}`
                        )
                      }

                      style={{

                        background:"#2563eb",

                        color:"white",

                        padding:"8px 14px",

                        borderRadius:"8px",

                        fontWeight:"bold",

                        cursor:"pointer"

                      }}

                    >

                      ✏️ Edit

                    </button>






                    <button

                      onClick={() =>
                        deleteProduct(product.id)
                      }

                      style={{

                        background:"#dc2626",

                        color:"white",

                        padding:"8px 14px",

                        borderRadius:"8px",

                        fontWeight:"bold",

                        cursor:"pointer"

                      }}

                    >

                      🗑 Delete

                    </button>



                  </div>


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