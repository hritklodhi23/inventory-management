import { useEffect, useState } from "react";

function Products() {
  const [safetyMaterials, setSafetyMaterials] = useState([]);
  const [constructionMaterials, setConstructionMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FORM STATE 1: Issue Safety Gear ---
  const [issueForm, setIssueForm] = useState({
    materialId: "",
    workerId: "",
    workerName: "",
    quantity: 1,
    remarks: ""
  });

  // --- FORM STATE 2: Log Material Usage ---
  const [usageForm, setUsageForm] = useState({
    materialId: "",
    quantityUsedKg: "",
    locationUsed: "",
    loggedBy: ""
  });

  // Fetch initial data from Spring Boot
  const fetchAllData = () => {
    Promise.all([
      fetch("http://localhost:8080/api/safety-materials").then((res) => res.json()),
      fetch("http://localhost:8080/api/construction-materials").then((res) => res.json()),
    ])
      .then(([safetyData, constructionData]) => {
        setSafetyMaterials(safetyData);
        setConstructionMaterials(constructionData);
        setLoading(false);
      })
      .catch((error) => console.error("Error connecting to backend:", error));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- ACTION 1: SUBMIT SAFETY GEAR ISSUANCE ---
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    if (!issueForm.materialId || !issueForm.workerId || !issueForm.workerName) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const url = `http://localhost:8080/api/safety-materials/issue?materialId=${issueForm.materialId}&workerId=${encodeURIComponent(issueForm.workerId)}&workerName=${encodeURIComponent(issueForm.workerName)}&quantity=${issueForm.quantity}&remarks=${encodeURIComponent(issueForm.remarks)}`;
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        alert(`✅ Success! Issued ${issueForm.quantity} item(s) to worker ${issueForm.workerName}.`);
        fetchAllData(); // Refresh tables from MySQL immediately!
        setIssueForm({ materialId: "", workerId: "", workerName: "", quantity: 1, remarks: "" });
      } else {
        const errText = await response.text();
        alert("❌ Error: " + errText);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Spring Boot backend.");
    }
  };

  // --- ACTION 2: SUBMIT CONSTRUCTION MATERIAL USAGE ---
  const handleUsageSubmit = async (e) => {
    e.preventDefault();
    if (!usageForm.materialId || !usageForm.quantityUsedKg || !usageForm.locationUsed) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const url = `http://localhost:8080/api/construction-materials/use?materialId=${usageForm.materialId}&quantityUsedKg=${usageForm.quantityUsedKg}&locationUsed=${encodeURIComponent(usageForm.locationUsed)}&loggedBy=${encodeURIComponent(usageForm.loggedBy || "Site Supervisor")}`;
      const response = await fetch(url, { method: "POST" });

      if (response.ok) {
        alert(`✅ Success! Logged ${usageForm.quantityUsedKg}kg used at "${usageForm.locationUsed}".`);
        fetchAllData(); // Refresh tables from MySQL immediately!
        setUsageForm({ materialId: "", quantityUsedKg: "", locationUsed: "", loggedBy: "" });
      } else {
        const errText = await response.text();
        alert("❌ Error: " + errText);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Spring Boot backend.");
    }
  };

  if (loading) return <div style={{ padding: "30px" }}><h2>Loading Inventory Dashboard...</h2></div>;

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🏗️ Construction Site Interactive Inventory</h1>

      {/* ============================================================ */}
      {/* SECTION 1: SAFETY MATERIALS & ISSUANCE FORM */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", marginBottom: "40px" }}>
        <h2>🪖 1. Safety Gear Management (PPE)</h2>

        {/* INTERACTIVE FORM 1 */}
        <form onSubmit={handleIssueSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <select 
            value={issueForm.materialId} 
            onChange={(e) => setIssueForm({ ...issueForm, materialId: e.target.value })}
            required
            style={{ padding: "8px" }}
          >
            <option value="">-- Select Safety Material --</option>
            {safetyMaterials.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} (In Stock: {item.quantityInStock})
              </option>
            ))}
          </select>

          <input 
            type="text" 
            placeholder="Worker ID (e.g. W-104)" 
            value={issueForm.workerId}
            onChange={(e) => setIssueForm({ ...issueForm, workerId: e.target.value })}
            required
            style={{ padding: "8px" }}
          />

          <input 
            type="text" 
            placeholder="Worker Name (e.g. Vikram Singh)" 
            value={issueForm.workerName}
            onChange={(e) => setIssueForm({ ...issueForm, workerName: e.target.value })}
            required
            style={{ padding: "8px" }}
          />

          <input 
            type="number" 
            min="1" 
            value={issueForm.quantity}
            onChange={(e) => setIssueForm({ ...issueForm, quantity: e.target.value })}
            style={{ padding: "8px", width: "80px" }}
          />

          <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Issue Gear to Worker
          </button>
        </form>

        {/* TABLE 1 */}
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#e6f2ff" }}>
              <th>ID</th>
              <th>Material Name</th>
              <th>Price Per Unit ($)</th>
              <th>Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            {safetyMaterials.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.pricePerUnit}</td>
                <td style={{ fontWeight: "bold", color: item.quantityInStock < 10 ? "red" : "black" }}>
                  {item.quantityInStock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2: CONSTRUCTION MATERIALS & USAGE FORM */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
        <h2>🧱 2. Construction Raw Materials & Site Usage</h2>

        {/* INTERACTIVE FORM 2 */}
        <form onSubmit={handleUsageSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <select 
            value={usageForm.materialId} 
            onChange={(e) => setUsageForm({ ...usageForm, materialId: e.target.value })}
            required
            style={{ padding: "8px" }}
          >
            <option value="">-- Select Construction Material --</option>
            {constructionMaterials.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.specification ? `(${item.specification})` : ""} - Stock: {item.quantityInKg}kg
              </option>
            ))}
          </select>

          <input 
            type="number" 
            step="0.1" 
            placeholder="Quantity Used (kg)" 
            value={usageForm.quantityUsedKg}
            onChange={(e) => setUsageForm({ ...usageForm, quantityUsedKg: e.target.value })}
            required
            style={{ padding: "8px", width: "160px" }}
          />

          <input 
            type="text" 
            placeholder="Location (e.g. Tower 3 Floor 3)" 
            value={usageForm.locationUsed}
            onChange={(e) => setUsageForm({ ...usageForm, locationUsed: e.target.value })}
            required
            style={{ padding: "8px" }}
          />

          <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Log Material Used
          </button>
        </form>

        {/* TABLE 2 */}
        <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", backgroundColor: "white" }}>
          <thead>
            <tr style={{ backgroundColor: "#e6ffe6" }}>
              <th>ID</th>
              <th>Material Name</th>
              <th>Specification</th>
              <th>Price Per Kg ($)</th>
              <th>Stock Quantity (Kg)</th>
            </tr>
          </thead>
          <tbody>
            {constructionMaterials.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.specification || "N/A"}</td>
                <td>${item.pricePerKg}</td>
                <td style={{ fontWeight: "bold" }}>{item.quantityInKg} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Products;