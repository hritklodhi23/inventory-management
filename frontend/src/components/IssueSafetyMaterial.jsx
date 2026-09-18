import { useState } from "react";
function IssueSafetyMaterial({
  selectedProduct,
  setShowSafetyForm,
  fetchProducts,
  fetchSafetyLogs,
}) {
  
  const [workerId, setWorkerId] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [remarks, setRemarks] = useState("");

  
 const handleSave = async () => {
  if (!selectedProduct) {
    alert("Safety material not found");
    return;
  }

  if (!workerId.trim()) {
    alert("Please enter worker ID");
    return;
  }

  if (!workerName.trim()) {
    alert("Please enter worker name");
    return;
  }

  if (Number(quantity) <= 0) {
    alert("Quantity must be greater than 0");
    return;
  }

  if (Number(quantity) > Number(selectedProduct.quantity)) {
    alert(
      `Insufficient stock! Available: ${selectedProduct.quantity} pcs`
    );
    return;
  }

  try {
    const params = new URLSearchParams({
      materialId: selectedProduct.id,
      workerId: workerId.trim(),
      workerName: workerName.trim(),
      quantity: quantity,
    });

    if (remarks.trim()) {
      params.append("remarks", remarks.trim());
    }

    const response = await fetch(
      `http://localhost:8080/api/safety-materials/issue?${params}`,
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
      "PPE issued successfully:",
      savedLog
    );

    // Refresh product quantities
    await fetchProducts();

    // Refresh PPE issuance logs
    if (fetchSafetyLogs) {
      await fetchSafetyLogs();
    }

    // Close form
    setShowSafetyForm(false);

  } catch (error) {
    console.error(
      "Error issuing PPE:",
      error
    );

    alert(
      error.message ||
      "Failed to issue safety material"
    );
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl shadow-lg w-[450px]">

        <h2 className="font-bold text-2xl mb-4">
          Issue PPE to Worker
        </h2>

        <div className="flex flex-col gap-3">

          {/* Safety Material */}
          <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50">
  <p className="text-sm text-gray-500">
    Safety Equipment
  </p>

  <p className="font-semibold">
    {selectedProduct?.name}
  </p>
</div>
{selectedProduct && (
  <p className="text-sm text-gray-600">
    Available stock:{" "}
    <span className="font-semibold">
      {selectedProduct.quantity} pcs
    </span>
  </p>
)}

          {/* Available Stock */}
          {selectedProduct && (
            <p className="text-sm text-gray-600">
              Available stock:{" "}
              <span className="font-semibold">
                {selectedProduct.quantity} pcs
              </span>
            </p>
          )}

          {/* Worker ID */}
          <input
            type="text"
            placeholder="Worker ID (e.g. W-101)"
            value={workerId}
            onChange={(e) =>
              setWorkerId(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          {/* Worker Name */}
          <input
            type="text"
            placeholder="Worker Name"
            value={workerName}
            onChange={(e) =>
              setWorkerName(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          {/* Quantity */}
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-2"
          />

          {/* Remarks */}
          <textarea
            placeholder="Remarks (optional)"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-2 resize-none"
            rows="3"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-3">

            <button
              onClick={() =>
                setShowSafetyForm(false)
              }
              className="bg-gray-400 px-4 py-2 text-white rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="bg-blue-500 rounded-lg px-4 py-2 text-white"
            >
              Issue PPE
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default IssueSafetyMaterial;