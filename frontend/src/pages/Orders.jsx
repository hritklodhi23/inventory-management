import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/orders";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    materialName: "",
    category: "Construction",
    quantity: "",
    requestedBy: "",
  });

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // CREATE ORDER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          materialName: formData.materialName,
          category: formData.category,
          quantity: Number(formData.quantity),
          requestedBy: formData.requestedBy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      // Reset form
      setFormData({
        materialName: "",
        category: "Construction",
        quantity: "",
        requestedBy: "",
      });

      setShowForm(false);

      // Refresh orders
      fetchOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to create order.");
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      setError("");

      const response = await fetch(
        `${API_URL}/${id}/status?status=${status}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      fetchOrders();
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    }
  };

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Orders
          </h1>

          <p className="text-gray-500 mt-1">
            Manage material orders and requests
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Create Order
        </button>

      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      {/* ================= CREATE ORDER FORM ================= */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Create New Order
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >

            {/* Material Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material Name
              </label>

              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                placeholder="Enter material name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Construction">
                  Construction
                </option>

                <option value="PPE">
                  PPE
                </option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Requested By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested By
              </label>

              <input
                type="text"
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                placeholder="Enter requester name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-3">

              <button
                type="submit"
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Create Order
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ================= ORDERS TABLE ================= */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Order ID
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Material
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Quantity
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Requested By
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>

              <th className="p-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="p-8 text-center text-gray-500"
                >
                  No orders found
                </td>

              </tr>

            ) : (

              orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50"
                >

                  {/* Order ID */}
                  <td className="p-4 font-medium text-gray-800">
                    ORD-{order.id}
                  </td>

                  {/* Material */}
                  <td className="p-4 text-gray-700">
                    {order.materialName}
                  </td>

                  {/* Category */}
                  <td className="p-4 text-gray-700">
                    {order.category}
                  </td>

                  {/* Quantity */}
                  <td className="p-4 text-gray-700">
                    {order.quantity}
                  </td>

                  {/* Requested By */}
                  <td className="p-4 text-gray-700">
                    {order.requestedBy}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-700">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>

                  {/* Actions */}
                  <td className="p-4">

                    {order.status === "PENDING" ? (

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            updateStatus(order.id, "APPROVED")
                          }
                          className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(order.id, "REJECTED")
                          }
                          className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-700 transition"
                        >
                          Reject
                        </button>

                      </div>

                    ) : (

                      <span className="text-gray-400 text-sm">
                        No actions
                      </span>

                    )}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}