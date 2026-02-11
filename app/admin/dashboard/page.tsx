"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [view, setView] = useState("add-video"); // "add-video" or "students"
  const [students, setStudents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");

    if (view === "students") {
      fetch("http://localhost:5000/api/admin/students", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => console.error("Failed to fetch students"));
    }
  }, [view, router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Top Navbar */}
      <nav className="bg-slate-900 text-white p-4 border-b-4 border-slate-900 flex justify-between items-center">
        <h1 className="text-xl font-bold">LMS Admin Panel</h1>
        <div className="space-x-4">
          <button onClick={() => setView("add-video")} className={`font-bold pb-1 ${view === "add-video" ? "border-b-2 border-white" : "text-slate-400 hover:text-white"}`}>
            Add Video
          </button>
          <button onClick={() => setView("students")} className={`font-bold pb-1 ${view === "students" ? "border-b-2 border-white" : "text-slate-400 hover:text-white"}`}>
            Student List
          </button>
          <button onClick={handleLogout} className="font-bold text-red-400 hover:text-red-300 ml-4">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto p-8">
        
        {view === "add-video" && (
          <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-2xl font-bold mb-6">Publish a New Lesson</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Video Title" className="w-full p-3 border-2 border-slate-900 outline-none" />
              <input type="text" placeholder="Instructor Name" className="w-full p-3 border-2 border-slate-900 outline-none" />
              <input type="url" placeholder="YouTube Link" className="w-full p-3 border-2 border-slate-900 outline-none" />
              <textarea placeholder="Description" rows={4} className="w-full p-3 border-2 border-slate-900 outline-none"></textarea>
              <button className="w-full bg-slate-900 text-white font-bold py-3 hover:bg-slate-800">Publish Video</button>
            </form>
          </div>
        )}

        {view === "students" && (
          <div className="bg-white border-4 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-2xl font-bold mb-6">Registered Students</h2>
            <table className="w-full text-left border-collapse border-2 border-slate-900">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 border-2 border-slate-900">Name</th>
                  <th className="p-3 border-2 border-slate-900">Email</th>
                  <th className="p-3 border-2 border-slate-900">Phone</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-100">
                    <td className="p-3 border-2 border-slate-900 font-bold">{student.name}</td>
                    <td className="p-3 border-2 border-slate-900">{student.email}</td>
                    <td className="p-3 border-2 border-slate-900">{student.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && <p className="mt-4 font-bold text-slate-500">No students found.</p>}
          </div>
        )}

      </div>
    </div>
  );
}