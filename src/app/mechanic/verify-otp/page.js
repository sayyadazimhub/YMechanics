'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


export default function VerifyOtpPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-fill username from URL (optional)
  const emailFromUrl = searchParams.get("email") || "";
  const nameFromUrl = searchParams.get("name") || "";

  const [username, setUsername] = useState(emailFromUrl);
  const [name, setName] = useState(nameFromUrl);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);


  // ======================================
  // SUBMIT OTP
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!username || !otp) {
      setError("All fields are required");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch("/api/v1/mechanic/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          otp
        })
      });

      const data = await res.json();


      if (!res.ok) {
        setError(data.message || "Verification failed");
        return;
      }


      setSuccess("OTP verified successfully! Redirecting...");

      // Redirect to login after 2 sec
      setTimeout(() => {
        router.push("/mechanic/login");
      }, 2000);


    } catch (err) {

      console.error(err);
      setError("Server error");

    } finally {

      setLoading(false);
    }
  };


  // ======================================
  // RESEND OTP
  // ======================================
  const handleResend = async () => {
    if (!username) {
      setError("Email/Username is required for resend");
      return;
    }

    try {
      setResendLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/v1/mechanic/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Resend failed");
        return;
      }

      setSuccess("OTP has been resent to your email.");
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error(err);
      setError("Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">

      <div className="w-full max-w-md rounded-2xl shadow-xl p-8">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center ">
          Verify Your Email
        </h1>

        <p className="text-center mb-3 mt-2">
          Hello <span className="font-bold">{name || 'Mechanic'}</span>,
          please enter the OTP sent to <span className="font-bold ">{username}</span>
        </p>


        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 py-2 rounded ">
            <span style={{ color: "lightcoral", fontWeight: "bold" }}>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            <span style={{ color: "black", fontWeight: "bold" }}>{success}</span>
          </div>
        )}


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Username (Locked) */}
            <span className="text-xs italic text-slate-500">Email for verification</span>
          <div className="bg-slate-50 border rounded-lg px-2 py-2 flex justify-between items-center">
            <input
              type="text"
              value={username}
              readOnly
              className="w-full bg-transparent border-0 focus:ring-0 text-black"
            />
          </div>


          {/* OTP */}
          <div>
            <label className="block text-sm font-medium mb-2">
              OTP Code
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full border text-blue-500 rounded-lg px-3 py-2 tracking-widest text-center font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              style={{ color: "#3B82F6" }}
              required
            />
          </div>

        {/* {i want btn bg blue and text color weight } */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-400 hover:to-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>


        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Didn’t receive OTP? Check spam folder.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || resendCooldown > 0}
            className="w-full text-center text-sm text-blue-600 hover:underline mt-2 disabled:text-black-400 disabled:no-underline"
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </div>

      </div>

    </div>
  );
}
