"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    adminIdentifier: ""
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === "student") {
        const endpoint = isLogin ? "/api/student/login" : "/api/student/register";
        const res = await fetch(`${apiUrl}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password
          })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("studentToken", data.token);
          localStorage.setItem("studentName", data.name || formData.name);
          localStorage.setItem("studentId", data.studentId);
          console.log("Student login successful, token stored:", data.studentId);
          const token = localStorage.getItem("studentToken");
          const studentId = localStorage.getItem("studentId");
          router.push("/student");
        } else {
          alert(data.message || "Student login failed.");
        }

      } else {
        const res = await fetch(`${apiUrl}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.adminIdentifier,
            password: formData.password
          })
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("adminToken", data.token);
          router.push("/admin/dashboard");
        } else {
          alert("Invalid Admin Credentials");
        }
      }

    } catch (error) {
      alert("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] flex flex-col font-sans">
      
      <div className="lg:hidden p-6 text-center pt-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
          KANDY<span className="text-indigo-600">LMS</span>
        </h1>
        <p className="text-sm text-slate-500 font-bold mt-2">Smart Learning Portal</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16 items-center">
          
          <div className="hidden lg:flex flex-col justify-center h-full space-y-8">
            <div>
              <div className="inline-block bg-indigo-100 text-indigo-700 font-black px-3 py-1 rounded-full text-xs uppercase tracking-widest mb-4">
                Welcome to the Future
              </div>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter italic leading-none">
                KANDY<br/>
                <span className="text-indigo-600">LMS</span>
              </h1>
            </div>
            <p className="text-xl text-slate-600 font-medium max-w-md leading-relaxed">
              Master the Korean language with our smart, adaptive learning system. Join live classes and track your progress in real-time.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-slate-700">Live Classes</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-700">Smart Quiz</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-700">Certified</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl w-full overflow-hidden ring-1 ring-slate-900/5 relative">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            <div className="flex p-2 gap-2 bg-slate-50/50 m-2 rounded-2xl">
              <button 
                onClick={() => setRole("student")}
                className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all duration-300 ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                STUDENT
              </button>
              <button 
                onClick={() => setRole("admin")}
                className={`flex-1 py-3 font-bold text-sm rounded-xl transition-all duration-300 ${role === 'admin' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
              >
                ADMIN
              </button>
            </div>

            <div className="p-8 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-1">
                  {role === 'student' ? (isLogin ? "Welcome Back" : "Start Learning") : "Admin Portal"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  {role === 'student' 
                    ? (isLogin ? "Please login to continue your lessons." : "Create an account to get started.") 
                    : "Secure access for instructors only."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {role === 'student' && !isLogin && (
                  <>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <input type="text" required placeholder="Full Name" className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      </div>
                      <input type="tel" required placeholder="Phone Number" className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                    </div>
                  </>
                )}
                {role === 'student' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                    </div>
                    <input type="email" required placeholder="Email Address" className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                )}

                {role === 'admin' && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <input type="text" required placeholder="Username or Email" className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, adminIdentifier: e.target.value})} />
                  </div>
                )}

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input type="password" required placeholder="Password" className="w-full pl-11 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full text-white font-black py-4 rounded-xl text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all active:translate-y-0 disabled:bg-slate-300 disabled:cursor-not-allowed ${role === 'student' ? 'bg-indigo-600' : 'bg-slate-900 shadow-slate-300'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      PROCESSING...
                    </span>
                  ) : (role === 'student' ? (isLogin ? "LOGIN" : "CREATE ACCOUNT") : "ADMIN LOGIN")}
                </button>

              </form>

              {role === 'student' && (
                <div className="mt-8 text-center">
                  <p className="text-slate-400 text-xs font-bold mb-2 uppercase tracking-wide">
                    {isLogin ? "New to Kandy LMS?" : "Already a member?"}
                  </p>
                  <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-indigo-600 font-black hover:text-indigo-800 transition-colors border-b-2 border-indigo-100 hover:border-indigo-600"
                  >
                    {isLogin ? "Create Student Account" : "Back to Login"}
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}