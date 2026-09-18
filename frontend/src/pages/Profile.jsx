import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          User information not found.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>

        <p className="text-gray-500 mt-1">
          View your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow p-8 max-w-2xl">

        {/* Avatar + Name */}
        <div className="flex items-center gap-5 mb-8">

          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-3xl font-bold text-purple-600">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {user.name}
            </h2>

            <p className="text-gray-500">
              {user.role}
            </p>
          </div>

        </div>

        {/* User Information */}
        <div className="space-y-6">

          <div>
            <p className="text-sm text-gray-500">
              Full Name
            </p>

            <p className="text-gray-800 font-medium mt-1">
              {user.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email Address
            </p>

            <p className="text-gray-800 font-medium mt-1">
              {user.email || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
              {user.role || "USER"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;