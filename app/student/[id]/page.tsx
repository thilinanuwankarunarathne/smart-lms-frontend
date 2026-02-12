"use client";
export const runtime = 'edge';
import { useState, useEffect,use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function WatchVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("auditory"); // 'auditory' | 'visual' | 'kinesthetic'
  const [classData, setClassData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) {
      router.push("/");
      return;
    }
    setIsAuthenticated(true);

    const fetchClassDetails = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/videos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setClassData(data);
        }
      } catch (error) {
        console.error("Failed to fetch class details");
      }
    };
    fetchClassDetails();
  }, [id, router]);

  const formatClassTime = (dateStr: string) => {
    if (!dateStr) return "Schedule TBD";
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 lg:px-10 sticky top-0 z-50">
        <h1 className="font-black text-xl tracking-tighter text-slate-900">KANDY<span className="text-indigo-600">LMS</span></h1>
        <button onClick={() => router.push("/student")} className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          ← Back to Library
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 lg:p-10">
        
        <div className="flex border-b-2 border-slate-200 mb-8 overflow-x-auto">
          {['auditory', 'visual', 'kinesthetic'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-4 ${
                activeTab === tab 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab} Section
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main Class Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-xs font-bold uppercase tracking-widest">Live Zoom Class</p>
                </div>
                <h1 className="text-3xl font-black mb-1">{classData?.title || "Loading Lesson..."}</h1>
                <p className="text-slate-400 font-medium">Instructor: {classData?.name || "TBA"}</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-md">
                  <h3 className="text-indigo-900 font-bold uppercase text-xs mb-1">
                    {activeTab} Focus
                  </h3>
                  <p className="text-indigo-800 text-sm leading-relaxed">
                    {activeTab === 'auditory' && "Join the Zoom link below. Pay close attention to the pronunciation and listening exercises during this session."}
                    {activeTab === 'visual' && "Join the Zoom link below. Focus on the whiteboard, charts, and screen sharing segments presented by the instructor."}
                    {activeTab === 'kinesthetic' && "Join the Zoom link below. Be ready to participate in role-playing, writing exercises, and interactive drills."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="text-lg font-bold text-slate-900">{formatClassTime(classData?.class_date)}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Platform</p>
                     <p className="text-lg font-bold text-slate-900 flex items-center gap-2">
                       Zoom Meeting
                     </p>
                  </div>
                </div>

                <a 
                  href={classData?.link || "#"} 
                  target="_blank" 
                  className={`block w-full text-center py-5 rounded-xl font-black text-lg transition-all shadow-lg hover:-translate-y-1 ${
                    classData?.link 
                    ? "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {classData?.link ? "LAUNCH ZOOM CLASS" : "LINK NOT AVAILABLE"}
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Lesson Description</h3>
               <p className="text-slate-600 font-medium leading-relaxed">{classData?.description || "No description provided."}</p>
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase italic">Assessment</h3>
                <p className="text-slate-500 text-sm font-bold">Complete the test for the {activeTab} section.</p>
              </div>

              {activeTab === 'auditory' && (
                <Link href="/student/test/auditory" className="block group">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👂</div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Auditory Test</h4>
                      <p className="text-xs text-slate-400 font-bold">Start Now →</p>
                    </div>
                  </div>
                </Link>
              )}

              {activeTab === 'visual' && (
                <Link href="/student/test/visual" className="block group">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">👁️</div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Visual Test</h4>
                      <p className="text-xs text-slate-400 font-bold">Start Now →</p>
                    </div>
                  </div>
                </Link>
              )}

              {activeTab === 'kinesthetic' && (
                <Link href="/student/test/kinesthetic" className="block group">
                  <div className="bg-slate-50 border-2 border-slate-200 p-4 rounded-xl flex items-center gap-4 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✋</div>
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-indigo-700">Kinesthetic Test</h4>
                      <p className="text-xs text-slate-400 font-bold">Start Now →</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}