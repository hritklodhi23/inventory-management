import { useState } from "react";

function IssueMaterial({
  products,
  setShowUsageForm,
  fetchProducts,
  fetchUsageLogs,
}) {
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const selectedProduct = products.find(
    (product) => product.name === material
  );

  const handleSave = async () => {
    // Validate material
    if (!material) {
      alert("Please select a material");
      return;
    }

    // Validate quantity
    if (Number(quantity) <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    // Validate location
    if (!location.trim()) {
      alert("Please enter a location");
      return;
    }

    // Find selected material
    if (!selectedProduct) {
      alert("Material not found");
      return;
    }

    // Frontend stock validation
    if (Number(quantity) > Number(selectedProduct.quantityInKg)) {
      alert(
        `Insufficient stock! Available: ${selectedProduct.quantityInKg} kg`
      );
      return;
    }

    try {
      const params = new URLSearchParams({
        materialId: selectedProduct.id,
        quantityUsedKg: quantity,
        locationUsed: location.trim(),
        loggedBy: "Admin",
      });

      const response = await fetch(
        `http://localhost:8080/api/construction-materials/use?${params}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const savedLog = await response.json();

      console.log(
        "Material issued successfully:",
        savedLog
      );

      // Refresh inventory
      await fetchProducts();

      // Refresh usage logs
      if (fetchUsageLogs) {
        await fetchUsageLogs();
      }

      // Close form
      setShowUsageForm(false);

    } catch (error) {
      console.error("Error issuing material:", error);

      alert(
        error.message || "Failed to issue material"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl h-auto shadow-lg w-[450px]">

        <h2 className="font-bold text-2xl mb-4">
          Issue Material
        </h2>

        <div className="flex flex-col gap-3">

          {/* Material */}
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">
              Select Material
            </option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.name}
              >
                {product.name}
              </option>
            ))}
          </select>

          {/* Available Stock */}
          {selectedProduct && (
            <p className="text-sm text-gray-600">
              Available stock:{" "}
              <span className="font-semibold">
                {selectedProduct.quantityInKg} kg
              </span>
            </p>
          )}

          {/* Quantity */}
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Quantity"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            className="w-full border border-gray-300 rounded-lg p-2"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-3">

            <button
              onClick={() => {
                setShowUsageForm(false);
              }}
              className="bg-gray-400 px-4 py-2 text-white rounded-lg"
            >
              Cancel
            </button>

            <button
              className="bg-blue-500 rounded-lg px-4 py-2 text-white"
              onClick={handleSave}
            >
              Save
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default IssueMaterial;