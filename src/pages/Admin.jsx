function Admin() {

  return (

    <div className="min-h-screen bg-gray-50 p-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">

          🛠 Relovo Admin Dashboard

        </h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Orders Today</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Revenue</h2>
            <p className="text-3xl font-bold mt-2">£0.00</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Pending</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-gray-500">Drivers Active</h2>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-8">

          <h2 className="text-2xl font-bold mb-4">

            📦 Orders

          </h2>

          <p className="text-gray-500">

            Orders will appear here.

          </p>

        </div>

      </div>

    </div>

  );

}

export default Admin;