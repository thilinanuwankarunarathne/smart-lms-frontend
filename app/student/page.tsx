"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function StudentVideoList() {
  const [videos, setVideos] = useState([]);
  const [studentName, setStudentName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const name = localStorage.getItem("studentName");
    if (!token) {
      router.push("/"); 
    } else {
      setStudentName(name || "Student");
    }

    const fetchVideos = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/admin/videos`);
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos");
      }
    };
    fetchVideos();
  }, [router]);

  const getStatus = (dateString: string) => {
    if (!dateString) return null;
    const classDate = new Date(dateString);
    const now = new Date();
    
    if (classDate > now && classDate.getTime() - now.getTime() < 86400000) {
      return { label: "Upcoming Soon", color: "bg-amber-400 text-amber-900" };
    }
    if (classDate < now) {
      return { label: "Recorded / Past", color: "bg-emerald-400 text-emerald-900" };
    }
    return { label: "Scheduled", color: "bg-indigo-400 text-indigo-900" };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-6 md:p-12">
      
      {/* Navbar / Header */}
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">
            Hello, <span className="text-indigo-600">{studentName}</span>
          </h1>
          <p className="text-slate-500 font-bold mt-1">Select a lesson to start learning.</p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); router.push("/"); }}
          className="text-xs font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
        >
          Logout
        </button>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video: any) => {
          const status = getStatus(video.class_date);
          const formattedDate = video.class_date 
            ? new Date(video.class_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            : "On Demand";

          return (
            <Link href={`/student/${video.id}`} key={video.id} className="block group">
              <div className="bg-white border-4 border-slate-900 h-full flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-2 group-hover:shadow-[12px_12px_0px_0px_rgba(79,70,229,1)] transition-all duration-300 rounded-2xl overflow-hidden">
                
                <div className="w-full aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <img 
                    src={`https://img.youtube.com/vi/${video.link.split('v=')[1]}/0.jpg`} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                  />
                  {status && (
                    <span className={`absolute top-4 left-4 ${status.color} text-[10px] font-black px-3 py-1 uppercase rounded-full border-2 border-slate-900 shadow-sm`}>
                      {status.label}
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-white p-3 rounded-full border-4 border-slate-900">
                        <svg className="w-6 h-6 fill-slate-900" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                     </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-xs font-black uppercase tracking-widest">{formattedDate}</span>
                  </div>

                  <h2 className="text-xl font-black mb-1 group-hover:text-indigo-600 transition-colors uppercase leading-tight">
                    {video.title}
                  </h2>
                  <p className="text-slate-500 text-sm font-bold mb-4 italic">Instructor: {video.name}</p>
                  
                  <div className="mt-auto pt-4 border-t-2 border-slate-100 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Start Class</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}