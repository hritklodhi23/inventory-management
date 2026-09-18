import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // Get response from backend
      const user = await response.json();

      console.log("Login successful:", user);

      // Store complete user information
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Store JWT token separately
      localStorage.setItem(
        "token",
        user.token
      );

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
        "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      {/* Heading */}

      <h1 className="text-4xl font-bold">
        Inventory Management
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Efficient Asset tracking system
      </p>

      {/* Login Card */}

      <div className="bg-white min-h-[420px] w-[320px] rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Sign in to continue
        </p>

        <form onSubmit={handleLogin}>

          {/* Email */}

          <div className="mt-8">

            <label className="block mb-2 text-lg font-medium">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />

          </div>

          {/* Password */}

          <div className="mt-6">

            <label className="block mb-2 text-lg font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
            />

          </div>

          {/* Error Message */}

          {error && (
            <p className="text-red-500 text-sm mt-4">
              {error}
            </p>
          )}

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;