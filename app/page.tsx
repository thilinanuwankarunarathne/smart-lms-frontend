import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Student Pathway */}
        <Link href="/student" className="block group">
          <div className="bg-white border-4 border-slate-900 p-12 h-full flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] transition-all">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">I am a Student</h2>
            <p className="text-slate-600 font-bold">Watch lessons and complete your assessments.</p>
          </div>
        </Link>

        {/* Admin Pathway */}
        <Link href="/admin/login" className="block group">
          <div className="bg-slate-900 border-4 border-slate-900 p-12 h-full flex flex-col items-center justify-center text-center shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] group-hover:-translate-y-1 group-hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all">
            <h2 className="text-3xl font-bold text-white mb-4">I am an Admin</h2>
            <p className="text-slate-300 font-bold">Manage video lessons and content.</p>
          </div>
        </Link>

      </div>
    </div>
  );
}