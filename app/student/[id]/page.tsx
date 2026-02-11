"use client";
import { useState } from "react";

export default function WatchVideoPage() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState("visual");
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save student
    // await fetch("http://localhost:5000/api/student/register", { ... })
    setIsRegistered(true); // Unlocks the tabs
    alert("Details saved! You can now access the assessments.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border-4 border-slate-900 p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        
        <div className="w-full aspect-video bg-slate-900 border-4 border-slate-900 mb-8 flex items-center justify-center">
          <p className="font-bold text-white text-xl">[ YouTube Video Player ]</p>
        </div>

        {/* Conditional Rendering: Show Registration OR Success Message */}
        {!isRegistered ? (
          <div className="bg-slate-100 p-6 border-4 border-slate-900 mb-10">
            <h2 className="text-2xl font-bold mb-2">Step 1: Save Details to Unlock Assessment</h2>
            <p className="mb-4 text-slate-600 font-bold">You must register to submit your answers.</p>
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Full Name" required className="p-3 border-2 border-slate-900 outline-none" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="p-3 border-2 border-slate-900 outline-none" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone Number" required className="p-3 border-2 border-slate-900 outline-none" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              <button type="submit" className="md:col-span-3 bg-slate-900 text-white font-bold py-3 hover:bg-slate-800">
                Save & Unlock
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-100 border-4 border-green-900 p-4 mb-10 text-green-900 font-bold text-center">
            Registration confirmed. You may now complete the assessment below.
          </div>
        )}

        {/* Step 2: Assessment Section (Disabled if not registered) */}
        <div className={`${!isRegistered ? "opacity-50 pointer-events-none select-none" : ""}`}>
          <h2 className="text-2xl font-bold mb-4">Step 2: Assessment</h2>
          
          <div className="flex border-b-4 border-slate-900 mb-6">
            {["visual", "auditory", "kinetics"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                className={`flex-1 py-3 font-bold border-4 border-b-0 ${tab !== "visual" ? "border-l-0" : ""} border-slate-900 capitalize transition-colors ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-slate-100"}`}>
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Answers submitted!"); }}>
            <div className="space-y-4 mb-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <label className="font-bold mb-1 capitalize">{activeTab} Question {i + 1}</label>
                  <input type="text" disabled={!isRegistered} placeholder="Your answer..." className="p-3 border-2 border-slate-900 outline-none focus:bg-slate-100 disabled:bg-slate-200" />
                </div>
              ))}
            </div>
            <button type="submit" disabled={!isRegistered} className="w-full bg-slate-900 text-white font-bold py-4 text-lg hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed">
              Submit Assessment
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}