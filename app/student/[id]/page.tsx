"use client";
import { useState } from "react";

// Added params so Next.js knows this is a dynamic route
export default function WatchVideoPage({ params }: { params: { id: string } }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [studentId, setStudentId] = useState(null); // Saves the DB ID after registration
  const [activeTab, setActiveTab] = useState("visual");
  const [formData, setFormData] = useState({ name: "", email: "", phoneNumber: "" });
  
  // New state to securely hold the 30 answers without losing them when switching tabs
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:5000/api/student/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsRegistered(true);
        setStudentId(data.studentId); // Store the ID so we can link it to their answers later
        alert("Details saved! You can now access the assessments.");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to connect to the server. Is your Node backend running?");
    }
  };

  // Function to handle saving answers to state
  const handleAnswerChange = (index: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [`${activeTab}_${index}`]: value // e.g., creates keys like "visual_0", "auditory_5"
    }));
  };

  const submitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Answers ready to send to DB:", { studentId, videoId: params.id, answers });
    alert("Answers submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white border-4 border-slate-900 p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        
        <div className="w-full aspect-video bg-slate-900 border-4 border-slate-900 mb-8 flex items-center justify-center">
          <p className="font-bold text-white text-xl">[ YouTube Video Player for Video ID: {params.id} ]</p>
        </div>

        {/* Conditional Rendering: Show Registration OR Success Message */}
        {!isRegistered ? (
          <div className="bg-slate-100 p-6 border-4 border-slate-900 mb-10">
            <h2 className="text-2xl font-bold mb-2">Step 1: Save Details to Unlock Assessment</h2>
            <p className="mb-4 text-slate-600 font-bold">You must register to submit your answers.</p>
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Full Name" required className="p-3 border-2 border-slate-900 outline-none focus:bg-white" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required className="p-3 border-2 border-slate-900 outline-none focus:bg-white" onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone Number" required className="p-3 border-2 border-slate-900 outline-none focus:bg-white" onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              <button type="submit" className="md:col-span-3 bg-slate-900 text-white font-bold py-3 hover:bg-slate-800 transition-colors">
                Save & Unlock
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-100 border-4 border-green-900 p-4 mb-10 text-green-900 font-bold text-center">
            Registration confirmed. You may now complete the assessment below.
          </div>
        )}

        {/* Step 2: Assessment Section */}
        <div className={`${!isRegistered ? "opacity-50 pointer-events-none select-none" : ""}`}>
          <h2 className="text-2xl font-bold mb-4">Step 2: Assessment</h2>
          
          <div className="flex border-b-4 border-slate-900 mb-6">
            {["visual", "auditory", "kinetics"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                type="button"
                className={`flex-1 py-3 font-bold border-4 border-b-0 ${tab !== "visual" ? "border-l-0" : ""} border-slate-900 capitalize transition-colors ${activeTab === tab ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-slate-100"}`}>
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={submitAssessment}>
            <div className="space-y-4 mb-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <label className="font-bold mb-1 capitalize">{activeTab} Question {i + 1}</label>
                  <input 
                    type="text" 
                    disabled={!isRegistered} 
                    value={answers[`${activeTab}_${i}`] || ""} 
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    placeholder="Your answer..." 
                    className="p-3 border-2 border-slate-900 outline-none focus:bg-slate-100 disabled:bg-slate-200" 
                  />
                </div>
              ))}
            </div>
            <button type="submit" disabled={!isRegistered} className="w-full bg-slate-900 text-white font-bold py-4 text-lg hover:bg-slate-800 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors">
              Submit Assessment
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}