"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentVideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Fetch the videos from your public Node API
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/videos");
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to fetch videos");
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold border-b-4 border-slate-900 pb-4 mb-8">
          Kandy EPS Topik - Available Lessons
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: any) => (
            <Link href={`/student/${video.id}`} key={video.id} className="block group">
              <div className="bg-white border-4 border-slate-900 p-6 h-full flex flex-col shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="w-full aspect-video bg-slate-200 border-2 border-slate-900 mb-4 flex items-center justify-center">
                  <span className="font-bold text-slate-500">Video Preview</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{video.title}</h2>
                <p className="text-slate-600 font-bold mb-4">{video.name}</p>
                <p className="text-sm border-t-2 border-slate-900 pt-4 mt-auto">
                  Click to watch & complete assessment →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}