function MaterialTable({
  products,
  setEditingProduct,
  setShowForm,
  onIssueSafetyMaterial,
}) {
  return (
    <div>
      <table className="w-full mt-6 bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Specification</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="p-6 text-center text-gray-500"
              >
                No materials found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={`${product.category}-${product.id}`}
                className="border-t"
              >
                {/* Name */}
                <td className="p-4">
                  {product.name}
                </td>

                {/* Category */}
                <td className="p-4">
                  {product.category}
                </td>

                {/* Specification */}
                <td className="p-4">
                  {product.specification || "-"}
                </td>

                {/* Quantity */}
                <td className="p-4">
                  {product.quantity} {product.unit}
                </td>

                {/* Price */}
                <td className="p-4">
                  ₹{product.price}
                </td>

                {/* Status */}
                <td className="p-4">
                  {Number(product.quantity) === 0 ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
                      Out of Stock
                    </span>
                  ) : Number(product.quantity) < 50 ? (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm">
                      Low Stock
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-sm">
                      In Stock
                    </span>
                  )}
                </td>

                {/* Actions */}
               <td className="p-4">
  <div className="flex gap-2">

    <button
      onClick={() => {
        setEditingProduct(product);
        setShowForm(true);
      }}
      className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-3 py-2"
    >
      Edit
    </button>

    {product.category === "PPE" && (
      <button
        onClick={() => {
          onIssueSafetyMaterial(product);
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2"
      >
        Issue
      </button>
    )}

  </div>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialTable;