"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Save the JWT token to localStorage
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 border-4 border-slate-900 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Login</h1>
        
        {error && <p className="text-red-600 font-bold mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-3 border-2 border-slate-900 text-slate-900 outline-none focus:bg-slate-100"
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border-2 border-slate-900 text-slate-900 outline-none focus:bg-slate-100"
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 hover:bg-slate-800 transition-colors">
          Login
        </button>
      </form>
    </div>
  );
}