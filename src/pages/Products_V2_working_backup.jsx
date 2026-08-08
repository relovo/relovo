import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";


function Products() {

  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
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
  };

  const [form, setForm] = useState(emptyForm);


  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    setDataLoading(true);


    const { data: productsData, error: productsError } =
      await supabase
        .from("Products")
        .select("*")
        .order("created_at", {
          ascending: false
        });


    if (productsError) {

      console.log("PRODUCTS ERROR:", productsError);

      alert(productsError.message);

    } else {

      setProducts(productsData || []);

    }


    const { data: storesData, error: storesError } =
      await supabase
        .from("Stores")
        .select("*")
        .order("name");


    if (storesError) {

      console.log("STORES ERROR:", storesError);

      alert(storesError.message);

    } else {

      setStores(storesData || []);

    }


    const { data: categoriesData, error: categoriesError } =
      await supabase
        .from("Categories")
        .select("*")
        .order("name");


    if (categoriesError) {

      console.log("CATEGORIES ERROR:", categoriesError);

      alert(categoriesError.message);

    } else {

      setCategories(categoriesData || []);

    }


    setDataLoading(false);

  }


  function handleChange(e) {

    const {
      name,
      value,
      type,
      checked
    } = e.target;


    setForm(prev => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value

    }));

  }


  async function saveProduct() {

    if (!form.name.trim() || !form.price) {

      alert("Name and price are required");

      return;

    }


    setLoading(true);


    const productData = {

      name: form.name.trim(),

      description:
        form.description.trim() || null,

      image:
        form.image.trim() || null,

      price:
        Number(form.price),

      offer_price:
        form.offer_price
          ? Number(form.offer_price)
          : null,

      store_id:
        form.store_id || null,

      category_id:
        form.category_id || null,

      brand:
        form.brand.trim() || null,

      stock:
        Number(form.stock) || 0,

      available:
        form.available

    };


    let result;


    if (editingId) {

      result = await supabase
        .from("Products")
        .update(productData)
        .eq("id", editingId);

    } else {

      result = await supabase
        .from("Products")
        .insert(productData);

    }


    if (result.error) {

      console.log("SAVE PRODUCT ERROR:", result.error);

      alert(result.error.message);

      setLoading(false);

      return;

    }


    alert(
      editingId
        ? "✅ Product updated"
        : "✅ Product added"
    );


    setForm(emptyForm);

    setEditingId(null);

    await loadData();

    setLoading(false);

  }


  function editProduct(product) {

    setEditingId(product.id);


    setForm({

      name: product.name || "",

      description:
        product.description || "",

      image:
        product.image || "",

      price:
        product.price ?? "",

      offer_price:
        product.offer_price ?? "",

      store_id:
        product.store_id || "",

      category_id:
        product.category_id || "",

      brand:
        product.brand || "",

      stock:
        product.stock ?? 0,

      available:
        product.available ?? true

    });


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }


  function cancelEdit() {

    setEditingId(null);

    setForm(emptyForm);

  }


  async function deleteProduct(id) {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmDelete) {

      return;

    }


    const { error } =
      await supabase
        .from("Products")
        .delete()
        .eq("id", id);


    if (error) {

      console.log("DELETE ERROR:", error);

      alert(error.message);

      return;

    }


    alert("✅ Product deleted");

    await loadData();

  }


  function addToCart(product) {

    if (!product.available) {

      alert("This product is currently unavailable");

      return;

    }


    if ((product.stock ?? 0) <= 0) {

      alert("This product is out of stock");

      return;

    }


    setCart(prev => {

      const existing =
        prev.find(
          item => item.id === product.id
        );


      if (existing) {

        if (
          existing.quantity >=
          (product.stock ?? 0)
        ) {

          alert("Maximum available stock reached");

          return prev;

        }


        return prev.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }


      return [

        ...prev,

        {
          ...product,
          quantity: 1
        }

      ];

    });

  }


  function increaseQuantity(id) {

    setCart(prev =>
      prev.map(item => {

        if (item.id !== id) {

          return item;

        }


        if (
          item.quantity >=
          (item.stock ?? 0)
        ) {

          return item;

        }


        return {

          ...item,

          quantity:
            item.quantity + 1

        };

      })
    );

  }


  function decreaseQuantity(id) {

    setCart(prev =>
      prev

        .map(item => {

          if (item.id !== id) {

            return item;

          }


          return {

            ...item,

            quantity:
              item.quantity - 1

          };

        })

        .filter(
          item => item.quantity > 0
        )
    );

  }


  function removeFromCart(id) {

    setCart(prev =>
      prev.filter(
        item => item.id !== id
      )
    );

  }


  function getStoreName(storeId) {

    const store =
      stores.find(
        item => item.id === storeId
      );


    return store?.name || "Store not selected";

  }


  function getCategoryName(categoryId) {

    const category =
      categories.find(
        item => item.id === categoryId
      );


    return category?.name ||
      "Category not selected";

  }


  const filteredProducts =
    products.filter(product => {

      const searchText =
        search.trim().toLowerCase();


      const searchMatch =
        !searchText ||

        product.name
          ?.toLowerCase()
          .includes(searchText) ||

        product.brand
          ?.toLowerCase()
          .includes(searchText);


      const storeMatch =
        selectedStore
          ? product.store_id === selectedStore
          : true;


      const categoryMatch =
        selectedCategory
          ? product.category_id === selectedCategory
          : true;


      return (
        searchMatch &&
        storeMatch &&
        categoryMatch
      );

    });


  const cartTotal =
    cart.reduce(
      (total, item) => {

        const price =
          item.offer_price ??
          item.price ??
          0;


        return (
          total +
          Number(price) *
          item.quantity
        );

      },
      0
    );


  const cartItems =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  if (dataLoading) {

    return (

      <div className="min-h-screen bg-gray-50 p-8">

        <div className="max-w-7xl mx-auto">

          <div className="bg-white rounded-2xl shadow p-8">

            <h1 className="text-2xl font-bold">

              Loading products...

            </h1>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-7xl mx-auto">


        {/* HEADER */}

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <div>

            <h1 className="text-4xl font-bold">

              🛒 Relovo Products

            </h1>

            <p className="text-gray-500 mt-2">

              Browse products from your favourite stores

            </p>

          </div>


          <div className="bg-white rounded-2xl shadow px-6 py-4">

            <div className="font-bold">

              🛒 Cart: {cartItems}

            </div>

            <div className="text-green-600 font-bold">

              £{cartTotal.toFixed(2)}

            </div>

          </div>

        </div>


        {/* ADMIN FORM */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">

            {editingId
              ? "✏️ Edit Product"
              : "➕ Add Product"}

          </h2>


          <div className="grid md:grid-cols-2 gap-4">


            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="border p-3 rounded-xl"
            />


            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Brand"
              className="border p-3 rounded-xl"
            />


            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="border p-3 rounded-xl"
            />


            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Price"
              className="border p-3 rounded-xl"
            />


            <input
              name="offer_price"
              value={form.offer_price}
              onChange={handleChange}
              type="number"
              step="0.01"
              placeholder="Offer price"
              className="border p-3 rounded-xl"
            />


            <input
              name="stock"
              value={form.stock}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder="Stock"
              className="border p-3 rounded-xl"
            />


            <select
              name="store_id"
              value={form.store_id}
              onChange={handleChange}
              className="border p-3 rounded-xl"
            >

              <option value="">

                Select store

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
              className="border p-3 rounded-xl"
            >

              <option value="">

                Select category

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

          </div>


          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded-xl w-full mt-4"
          />


          <label className="flex gap-3 mt-4 items-center">

            <input
              type="checkbox"
              name="available"
              checked={form.available}
              onChange={handleChange}
            />

            <span>

              🟢 Available

            </span>

          </label>


          <div className="flex gap-4 mt-5">


            <button
              onClick={saveProduct}
              disabled={loading}
              style={{
                background: "#f97316",
                color: "white",
                padding: "12px 24px",
                borderRadius: "999px",
                fontWeight: "bold",
                cursor: loading
                  ? "not-allowed"
                  : "pointer"
              }}
            >

              {loading
                ? "Saving..."
                : editingId
                  ? "Update Product"
                  : "Add Product"}

            </button>


            {editingId && (

              <button
                onClick={cancelEdit}
                style={{
                  background: "#d1d5db",
                  color: "#111827",
                  padding: "12px 24px",
                  borderRadius: "999px",
                  fontWeight: "bold"
                }}
              >

                Cancel

              </button>

            )}

          </div>

        </div>


        {/* FILTERS */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-4">

            🔎 Find Products

          </h2>


          <div className="grid md:grid-cols-3 gap-4">


            <input
              value={search}
              onChange={
                e => setSearch(e.target.value)
              }
              placeholder="🔍 Search product or brand"
              className="border p-3 rounded-xl"
            />


            <select
              value={selectedStore}
              onChange={
                e =>
                  setSelectedStore(
                    e.target.value
                  )
              }
              className="border p-3 rounded-xl"
            >

              <option value="">

                All stores

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
              value={selectedCategory}
              onChange={
                e =>
                  setSelectedCategory(
                    e.target.value
                  )
              }
              className="border p-3 rounded-xl"
            >

              <option value="">

                All categories

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

          </div>


          <div className="mt-4 text-gray-500">

            Showing {filteredProducts.length}
            {" "}
            of {products.length} products

          </div>

        </div>


        {/* PRODUCTS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">


          {filteredProducts.map(product => {


            const displayPrice =
              product.offer_price ??
              product.price;


            const hasOffer =
              product.offer_price &&
              Number(product.offer_price) <
              Number(product.price);


            const outOfStock =
              Number(product.stock ?? 0) <= 0;


            return (

              <div
                key={product.id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >


                {/* IMAGE */}

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />

                ) : (

                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl">

                    🛒

                  </div>

                )}


                <div className="p-5">


                  <div className="flex justify-between gap-3">

                    <h3 className="font-bold text-lg">

                      {product.name}

                    </h3>


                    {product.available ? (

                      <span className="text-green-600 text-sm font-bold whitespace-nowrap">

                        🟢 Available

                      </span>

                    ) : (

                      <span className="text-red-600 text-sm font-bold whitespace-nowrap">

                        🔴 Hidden

                      </span>

                    )}

                  </div>


                  {product.brand && (

                    <p className="text-gray-500 text-sm mt-1">

                      {product.brand}

                    </p>

                  )}


                  <div className="text-sm text-gray-500 mt-3">

                    🏪 {getStoreName(product.store_id)}

                  </div>


                  <div className="text-sm text-gray-500">

                    📂 {getCategoryName(product.category_id)}

                  </div>


                  <div className="mt-4">


                    {hasOffer && (

                      <span className="text-gray-400 line-through mr-2">

                        £{Number(product.price).toFixed(2)}

                      </span>

                    )}


                    <span
                      className={
                        hasOffer
                          ? "text-green-600 font-bold text-xl"
                          : "font-bold text-xl"
                      }
                    >

                      £{Number(displayPrice).toFixed(2)}

                    </span>


                  </div>


                  <div className="text-sm text-gray-500 mt-2">

                    📦 Stock: {product.stock ?? 0}

                  </div>


                  <div className="flex flex-wrap gap-2 mt-5">


                    <button
                      onClick={() =>
                        addToCart(product)
                      }
                      disabled={
                        !product.available ||
                        outOfStock
                      }
                      style={{
                        background:
                          !product.available ||
                          outOfStock
                            ? "#9ca3af"
                            : "#16a34a",
                        color: "white",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "10px",
                        fontWeight:
                          "bold",
                        cursor:
                          !product.available ||
                          outOfStock
                            ? "not-allowed"
                            : "pointer"
                      }}
                    >

                      {outOfStock
                        ? "Out of stock"
                        : "🛒 Add to cart"}

                    </button>


                    <button
                      onClick={() =>
                        editProduct(product)
                      }
                      style={{
                        background: "#2563eb",
                        color: "white",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "10px",
                        fontWeight:
                          "bold"
                      }}
                    >

                      ✏️ Edit

                    </button>


                    <button
                      onClick={() =>
                        deleteProduct(
                          product.id
                        )
                      }
                      style={{
                        background: "#dc2626",
                        color: "white",
                        padding:
                          "10px 16px",
                        borderRadius:
                          "10px",
                          fontWeight:
                            "bold"
                      }}
                    >

                      🗑 Delete

                    </button>

                  </div>


                  {/* CART QUANTITY */}

                  {cart.some(
                    item =>
                      item.id === product.id
                  ) && (

                    <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-xl p-3">

                      <span className="font-bold">

                        In cart

                      </span>


                      <div className="flex items-center gap-3">


                        <button
                          onClick={() =>
                            decreaseQuantity(
                              product.id
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg font-bold"
                        >

                          −

                        </button>


                        <span className="font-bold">

                          {
                            cart.find(
                              item =>
                                item.id ===
                                product.id
                            )?.quantity || 0
                          }

                        </span>


                        <button
                          onClick={() =>
                            increaseQuantity(
                              product.id
                            )
                          }
                          className="bg-gray-200 px-3 py-1 rounded-lg font-bold"
                        >

                          +

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              </div>

            );

          })}

        </div>


        {/* EMPTY */}

        {filteredProducts.length === 0 && (

          <div className="bg-white rounded-2xl shadow p-10 text-center mt-6">

            <div className="text-5xl mb-4">

              🔍

            </div>

            <h2 className="text-xl font-bold">

              No products found

            </h2>

            <p className="text-gray-500 mt-2">

              Try changing your search or filters.

            </p>

          </div>

        )}


        {/* CART SUMMARY */}

        {cart.length > 0 && (

          <div className="fixed bottom-6 right-6 bg-white shadow-2xl rounded-2xl p-5 border max-w-sm w-full">

            <div className="flex justify-between items-center">

              <div>

                <div className="font-bold">

                  🛒 Your cart

                </div>

                <div className="text-gray-500">

                  {cartItems} item(s)

                </div>

              </div>


              <div className="text-green-600 font-bold text-xl">

                £{cartTotal.toFixed(2)}

              </div>

            </div>


            <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">


              {cart.map(item => (

                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm"
                >

                  <span>

                    {item.name} × {item.quantity}

                  </span>


                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                    className="text-red-500 font-bold"
                  >

                    Remove

                  </button>

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </div>

  );

}


export default Products;