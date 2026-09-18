import { Link, useNavigate } from "react-router-dom";

function Sidebar({ setActivePage, activePage }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove logged-in user and JWT token
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (

    <div className="w-60 min-h-screen bg-[#121220] flex flex-col px-5 text-white">

      {/* Sidebar Title */}

      <h1 className="text-2xl font-bold mt-2 mb-10">
        Inventory MS
      </h1>


     {/* Navigation */}

<div className="flex flex-col gap-4 text-lg font-semibold">

  {/* Dashboard */}
  <button
    onClick={() => setActivePage("dashboard")}
    className={`w-full px-2 py-3 rounded-md text-left ${
      activePage === "dashboard"
        ? "bg-[#5858e7] text-white"
        : "hover:bg-[#5858e7]"
    }`}
  >
    Dashboard
  </button>

  {/* Products */}
  <button
    onClick={() => setActivePage("products")}
    className={`w-full px-2 py-3 rounded-md text-left ${
      activePage === "products"
        ? "bg-[#5858e7] text-white"
        : "hover:bg-[#5858e7]"
    }`}
  >
    Products
  </button>

  {/* Usage Logs */}
  <button
    onClick={() => setActivePage("usagelogs")}
    className={`w-full px-2 py-3 rounded-md text-left ${
      activePage === "usagelogs"
        ? "bg-[#5858e7] text-white"
        : "hover:bg-[#5858e7]"
    }`}
  >
    Usage Logs
  </button>

  {/* Orders */}
  <Link
    to="/orders"
    className="w-full px-2 py-3 rounded-md text-left hover:bg-[#5858e7] active:scale-95 transition duration-150"
  >
    Orders
  </Link>

  {/* Profile */}
  <Link
    to="/profile"
    className="w-full px-2 py-3 rounded-md text-left hover:bg-[#5858e7] active:scale-95 transition duration-150"
  >
    Profile
  </Link>

</div>

      {/* Logout */}

      <button
        onClick={handleLogout}
        className="mt-auto mb-8 px-2 py-1 rounded-md text-left text-lg font-semibold hover:bg-[#5858e7] active:scale-95 transition duration-150"
      >
        Logout
      </button>

    </div>
  );
}

export default Sidebar;