import { useState } from "react";

function AddMaterial({
  setShowForm,
  updateProduct,
  addProduct,
  editingProduct,
  setEditingProduct,
}) {
  const [category, setCategory] = useState(
    editingProduct?.category || "Material"
  );

  const [name, setName] = useState(
    editingProduct?.name || ""
  );

  const [specification, setSpecification] = useState(
    editingProduct?.specification || ""
  );

  const [quantity, setQuantity] = useState(
  editingProduct?.quantity ?? ""
);

const [price, setPrice] = useState(
  editingProduct?.price ?? ""
);

  const handleSave = async () => {

    // Construction Material
    if (category === "Material") {

      const material = {
        name: name.trim(),
        specification: specification.trim(),
        pricePerKg: Number(price),
        quantityInKg: Number(quantity),
      };

      if (editingProduct) {
        await updateProduct(
          material,
          editingProduct.id,
          category
        );
      } else {
        await addProduct(material, category);
      }

    }

    // PPE
    if (category === "PPE") {

      const safetyMaterial = {
        name: name.trim(),
        pricePerUnit: Number(price),
        quantityInStock: Number(quantity),
      };

      if (editingProduct) {
        await updateProduct(
          safetyMaterial,
          editingProduct.id,
          category
        );
      } else {
        await addProduct(
          safetyMaterial,
          category
        );
      }
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl shadow-lg w-[450px]">

        <h2 className="font-bold text-2xl mb-4">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>

        <div className="flex flex-col gap-3">

          {/* Category */}
          <div>
            <h5 className="font-semibold mb-1">
              Category
            </h5>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);

                // Clear specification when switching to PPE
                if (e.target.value === "PPE") {
                  setSpecification("");
                }
              }}
              className="w-full border border-gray-300 rounded-lg p-2"
              disabled={!!editingProduct}
            >
              <option value="Material">
                Construction Material
              </option>

              <option value="PPE">
                Worker Safety Equipment (PPE)
              </option>
            </select>
          </div>

          {/* Name */}
          <div>
            <h5 className="font-semibold mb-1">
              Product Name
            </h5>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="e.g. Cement / Safety Helmet"
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Specification */}
          {category === "Material" && (
            <div>
              <h5 className="font-semibold mb-1">
                Specification
              </h5>

              <input
                type="text"
                value={specification}
                onChange={(e) =>
                  setSpecification(e.target.value)
                }
                placeholder="e.g. OPC 53 / 12mm"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          )}

          {/* Quantity */}
          <div>
            <h5 className="font-semibold mb-1">
              Quantity ({category === "PPE" ? "pcs" : "kg"})
            </h5>

            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              placeholder={
                category === "PPE"
                  ? "e.g. 120"
                  : "e.g. 500"
              }
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Price */}
          <div>
            <h5 className="font-semibold mb-1">
              Price ({category === "PPE" ? "per unit" : "per kg"})
            </h5>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              placeholder={
                category === "PPE"
                  ? "e.g. 350"
                  : "e.g. 42"
              }
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-3">

            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="bg-gray-400 px-4 py-2 text-white rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-500 rounded-lg px-4 py-2 text-white"
            >
              {editingProduct ? "Update" : "Save"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AddMaterial;