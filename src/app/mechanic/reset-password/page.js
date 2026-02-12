"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const username = localStorage.getItem("reset_username");
    const otp = localStorage.getItem("reset_otp");

    if (!username || !otp) {
      router.push("/mechanic/forgot-password");
    }

  }, []);

  const handleReset = async (e) => {

    e.preventDefault();

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    const username = localStorage.getItem("reset_username");
    const otp = localStorage.getItem("reset_otp");

    console.log("RESET:", { username, otp });

    const res = await fetch("/api/v1/mechanic/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        otp,
        newPassword: password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Reset failed");
      setLoading(false);
      return;
    }

    // ✅ Clear storage
    localStorage.removeItem("reset_username");
    localStorage.removeItem("reset_otp");

    alert("Password reset successful");

    router.push("/mechanic/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleReset}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >

        <h2 className="text-xl font-bold mb-4">
          Reset Password
        </h2>

        {error && (
          <p className="text-red-500 mb-3">{error}</p>
        )}

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
}
