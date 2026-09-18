import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import AddMaterial from "../components/AddMaterial";
import DashboardCard from "../components/DashboardCard";
import MaterialTable from "../components/MaterialTable";
import UsageLogsTable from "../components/UsageLogsTable";
import IssueMaterial from "../components/IssueMaterial";
import IssueSafetyMaterial from "../components/IssueSafetyMaterial";
import SafetyLogsTable from "../components/SafetyLogsTable";

function Dashboard() {

  // =========================
  // STATES
  // =========================

  const [activePage, setActivePage] = useState("dashboard");

  const [showForm, setShowForm] = useState(false);

  const [showUsageForm, setShowUsageForm] = useState(false);

  const [showSafetyForm, setShowSafetyForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);

  const [usageLogs, setUsageLogs] = useState([]);

  const [safetyLogs, setSafetyLogs] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);

  const [selectedSafetyMaterial, setSelectedSafetyMaterial] =
    useState(null);


  // =========================
  // FETCH CONSTRUCTION MATERIALS
  // =========================

  const fetchConstructionMaterials = async () => {

    const response = await fetch(
      "http://localhost:8080/api/construction-materials"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch construction materials"
      );
    }

    const data = await response.json();

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: "Material",
      specification: item.specification,
      quantity: item.quantityInKg,
      unit: "kg",
      price: item.pricePerKg,
    }));
  };


  // =========================
  // FETCH PPE
  // =========================

  const fetchSafetyMaterials = async () => {

    const response = await fetch(
      "http://localhost:8080/api/safety-materials"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch safety materials"
      );
    }

    const data = await response.json();

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      category: "PPE",
      specification: null,
      quantity: item.quantityInStock,
      unit: "pcs",
      price: item.pricePerUnit,
    }));
  };


  // =========================
  // FETCH ALL PRODUCTS
  // =========================

  const fetchProducts = async () => {

    try {

      const materials =
        await fetchConstructionMaterials();

      const safetyMaterials =
        await fetchSafetyMaterials();

      setProducts([
        ...materials,
        ...safetyMaterials,
      ]);

    } catch (error) {

      console.error(
        "Error fetching products:",
        error
      );

    }
  };


  // =========================
  // FETCH MATERIAL USAGE LOGS
  // =========================

  const fetchUsageLogs = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/construction-materials/usage-logs"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch usage logs"
        );
      }

      const data = await response.json();

      setUsageLogs(data);

    } catch (error) {

      console.error(
        "Error fetching usage logs:",
        error
      );

    }
  };


  // =========================
  // FETCH PPE ISSUANCE LOGS
  // =========================

  const fetchSafetyLogs = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/safety-materials/logs"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch PPE logs"
        );
      }

      const data = await response.json();

      setSafetyLogs(data);

    } catch (error) {

      console.error(
        "Error fetching PPE logs:",
        error
      );

    }
  };


  // =========================
  // INITIAL DATA LOAD
  // =========================

  useEffect(() => {
  fetchProducts();
  fetchUsageLogs();
  fetchSafetyLogs();

  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);


  // =========================
  // ADD PRODUCT
  // =========================

  const addProduct = async (
    newProduct,
    category
  ) => {

    try {

      let url;

      if (category === "Material") {

        url =
          "http://localhost:8080/api/construction-materials";

      } else if (category === "PPE") {

        url =
          "http://localhost:8080/api/safety-materials";

      } else {

        throw new Error(
          "Invalid product category"
        );

      }


      const response = await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(newProduct),
        }
      );


      if (!response.ok) {

        const errorMessage =
          await response.text();

        throw new Error(
          errorMessage ||
          "Failed to add product"
        );

      }


      const savedProduct =
        await response.json();

      console.log(
        "Product added:",
        savedProduct
      );


      await fetchProducts();

    } catch (error) {

      console.error(
        "Error adding product:",
        error
      );

      alert(
        error.message ||
        "Failed to add product"
      );

    }
  };


  // =========================
  // UPDATE PRODUCT
  // =========================

  const updateProduct = async (
    updatedProduct,
    id,
    category
  ) => {

    try {

      let url;

      if (category === "Material") {

        url =
          `http://localhost:8080/api/construction-materials/${id}`;

      } else if (category === "PPE") {

        url =
          `http://localhost:8080/api/safety-materials/${id}`;

      } else {

        throw new Error(
          "Invalid product category"
        );

      }


      const response = await fetch(
        url,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedProduct),
        }
      );


      if (!response.ok) {

        const errorMessage =
          await response.text();

        throw new Error(
          errorMessage ||
          "Failed to update product"
        );

      }


      const savedProduct =
        await response.json();

      console.log(
        "Product updated:",
        savedProduct
      );


      await fetchProducts();

    } catch (error) {

      console.error(
        "Error updating product:",
        error
      );

      alert(
        error.message ||
        "Failed to update product"
      );

    }
  };


  // =========================
  // SEARCH PRODUCTS
  // =========================

  const filterProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );


  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalProducts =
    products.length;


  const totalMaterials =
    products.filter(
      (product) =>
        product.category === "Material"
    ).length;


  const totalPPE =
    products.filter(
      (product) =>
        product.category === "PPE"
    ).length;


  const lowStockItems =
    products.filter(
      (product) =>
        Number(product.quantity) > 0 &&
        Number(product.quantity) < 50
    ).length;


  const outOfStockItems =
    products.filter(
      (product) =>
        Number(product.quantity) === 0
    ).length;


  // =========================
  // RENDER
  // =========================

  return (

    <div className="min-h-screen flex">


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        setActivePage={setActivePage}
        activePage={activePage}
      />


      {/* =========================
          MAIN SECTION
      ========================= */}

      <div className="flex-1 flex flex-col">


        {/* =========================
            NAVBAR
        ========================= */}

        <div className="bg-[#f4f4f4] h-16 flex items-center justify-between px-6 border-b-2">

          <h2 className="text-xl font-semibold">

            {activePage === "dashboard" &&
              "Dashboard"}

            {activePage === "products" &&
              "Products"}

            {activePage === "usagelogs" &&
              "Usage Logs"}

          </h2>

<div className="flex items-center gap-2">
  <span>👤</span>

  <div className="flex flex-col">
    <span className="font-semibold">
      {user?.name || "User"}
    </span>

    <span className="text-xs text-gray-500">
      {user?.role || ""}
    </span>
  </div>
</div>

        </div>


        {/* =========================
            CONTENT AREA
        ========================= */}

        <div className="bg-[#F4F3F8] flex-1 p-6">


          {/* =========================
              DASHBOARD
          ========================= */}

          {activePage === "dashboard" && (

            <div>

              <div className="grid grid-cols-4 gap-6">


                <DashboardCard
                  title="Total Products"
                  value={totalProducts}
                />


                <DashboardCard
                  title="Construction Materials"
                  value={totalMaterials}
                />


                <DashboardCard
                  title="PPE Items"
                  value={totalPPE}
                />


                <DashboardCard
                  title="Low Stock Items"
                  value={lowStockItems}
                  color="text-red-500"
                />


                <DashboardCard
                  title="Out of Stock"
                  value={outOfStockItems}
                  color="text-orange-500"
                />

              </div>

            </div>

          )}


          {/* =========================
              PRODUCTS
          ========================= */}

          {activePage === "products" && (

            <div>


              <div className="flex justify-between items-center">

                <h1 className="text-2xl font-bold">
                  Products List
                </h1>

              </div>


              {/* Search + Add */}

              <div className="flex items-center gap-4 mt-4">


                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                />


                <button
                  onClick={() => {

                    setEditingProduct(null);

                    setShowForm(true);

                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  + Add New Product
                </button>


              </div>


              {/* Product Table */}

              <MaterialTable
                products={filterProducts}
                setEditingProduct={
                  setEditingProduct
                }
                setShowForm={setShowForm}
                onIssueSafetyMaterial={(
                  product
                ) => {

                  setSelectedSafetyMaterial(
                    product
                  );

                  setShowSafetyForm(true);

                }}
              />


            </div>

          )}


          {/* =========================
              USAGE LOGS
          ========================= */}

          {activePage === "usagelogs" && (

            <div>


              {/* Heading */}

              <div className="flex-col items-center">

                <h1 className="text-2xl font-bold">
                  Material Consumption Records
                </h1>


                <button
                  onClick={() =>
                    setShowUsageForm(true)
                  }
                  className="bg-blue-500 p-2 rounded-lg text-white mt-5"
                >
                  + Issue Material
                </button>

              </div>


              {/* Construction Material Logs */}

              <UsageLogsTable
                usageLogs={usageLogs}
              />


              {/* PPE Logs */}

              <SafetyLogsTable
                safetyLogs={safetyLogs}
              />


            </div>

          )}

        </div>

      </div>


      {/* =========================
          ADD / EDIT PRODUCT FORM
      ========================= */}

      {showForm && (

        <AddMaterial
          setShowForm={setShowForm}
          addProduct={addProduct}
          updateProduct={updateProduct}
          editingProduct={editingProduct}
          setEditingProduct={
            setEditingProduct
          }
        />

      )}


      {/* =========================
          ISSUE CONSTRUCTION MATERIAL
      ========================= */}

      {showUsageForm && (

        <IssueMaterial
          products={products.filter(
            (product) =>
              product.category ===
              "Material"
          )}

          setShowUsageForm={
            setShowUsageForm
          }

          fetchProducts={
            fetchProducts
          }

          fetchUsageLogs={
            fetchUsageLogs
          }
        />

      )}


      {/* =========================
          ISSUE PPE
      ========================= */}

      {showSafetyForm &&
        selectedSafetyMaterial && (

        <IssueSafetyMaterial
          selectedProduct={
            selectedSafetyMaterial
          }

          setShowSafetyForm={(
            value
          ) => {

            setShowSafetyForm(value);

            if (!value) {

              setSelectedSafetyMaterial(
                null
              );

            }

          }}

          fetchProducts={
            fetchProducts
          }

          fetchSafetyLogs={
            fetchSafetyLogs
          }
        />

      )}

    </div>
  );
}

export default Dashboard;