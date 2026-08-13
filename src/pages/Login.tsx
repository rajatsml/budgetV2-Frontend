import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateInputs = (uid: string, pwd: string) => {
    const u = uid.trim();
    const p = pwd.trim();
    if (!u.trim() || !p.trim()) return "User ID and password are required";
    if (!u) return "User ID is required";
    if (!p) return "Password is required";
    return null;
  };

  const handleLogin = async (_role: "admin" | "user") => {
    const clientValidation = validateInputs(userId, password);
    if (clientValidation) {
      setError(clientValidation);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Build payload: if numeric userId => use { userId, password, type }
      const trimmed = userId.trim();
      let payload: any;
      if (/^\d+$/.test(trimmed)) {
        payload = {
          userId: Number(trimmed),
          password,
          type: _role === "admin" ? 1 : 2,
        };
      } else {
        // fallback to username-based payload
        payload = { username: trimmed, password };
      }

      const res = await axios.post(
        "http://localhost:5024/api/Auth/login",
        payload,
        {
          headers: { "Content-Type": "application/json", Accept: "*/*" },
        },
      );

      const data = res.data;

      // Validate response minimal shape
      if (!data || !data.token) {
        throw new Error("Invalid response from server");
      }

      // If admin tab clicked, ensure returned role is admin
      if (_role === "admin") {
        const roleVal = (data?.role || "").toString().toLowerCase();
        if (roleVal !== "admin") {
          // clear any stored auth and show message
          try {
            (useUserStore as any).setState({ user: null });
            localStorage.removeItem("capex_auth");
          } catch (e) {}
          setError("Not an admin user");
          return;
        }
      }

      const userObj = {
        token: data.token,
        tokenType: data.tokenType,
        expiresAt: Date.now() + (Number(data.expiresInSeconds) || 3600) * 1000,
        expiresInSeconds: Number(data.expiresInSeconds) || 3600,
        userId: data.userId,
        username: data.username,
        role: data.role,
      };

      // Persist to zustand store and localStorage
      try {
        (useUserStore as any).setState({ user: userObj });
        localStorage.setItem("capex_auth", JSON.stringify(userObj));
      } catch (e) {
        console.warn("Failed to save auth", e);
      }

      navigate("/home");
    } catch (err: any) {
      // axios error handling
      const msg =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-xl bg-white lg:grid-cols-2 border border-gray-300">
        {/* Left Branding Section */}
        <div className="bg-linear-to-br from-gray-600 via-gray-600 to-gray-800 p-12 text-white flex flex-col justify-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Project Based Budget <br />
              Allocation Portal 💵
            </h1>

            <p className="mt-6 text-lg leading-relaxed">
              Platform for Project Creation, Budget Management, Approval
              Workflow and Department Collaboration.
            </p>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-lg">
            <h2 className="mb-2 text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="mb-8 text-gray-500">
              Sign in to access the Budget Allocation Portal
            </p>

            {error && (
              <div className="alert bg-red-500 mb-6 text-white">
                <span>{error}</span>
              </div>
            )}

            {/* DaisyUI Tabs */}
            <div className="tabs tabs-lift w-full">
              {/* Admin Login Tab */}
              <input
                type="radio"
                name="login_tabs"
                className="tab"
                aria-label="Admin Login"
                defaultChecked
              />

              <div className="tab-content border-base-300 bg-base-100 p-6 rounded-box">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Administrator Login
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Access project creation, approvals and administration.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">User ID</span>
                    </label>

                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter User ID"
                      className={`input input-bordered w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter Password"
                      className={`input input-bordered w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                  </div>

                  <button
                    onClick={() => handleLogin("admin")}
                    className={`btn bg-red-500 text-white w-full mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    Sign In as Admin
                  </button>
                </div>
              </div>

              {/* User Login Tab */}
              <input
                type="radio"
                name="login_tabs"
                className="tab"
                aria-label="User Login"
              />

              <div className="tab-content border-base-300 bg-base-100 p-6 rounded-box">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    User Login
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Access project information and approval requests.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">User ID</span>
                    </label>

                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => {
                        setUserId(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter User ID"
                      className={`input input-bordered w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Password</span>
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Enter Password"
                      className={`input input-bordered w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading}
                    />
                  </div>

                  <button
                    onClick={() => handleLogin("user")}
                    className={`btn bg-red-500 text-white w-full mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                    aria-busy={loading}
                  >
                    Sign In as User
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              © 2026 Budget Allocation Portal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
