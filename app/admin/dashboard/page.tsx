"use client";
export const runtime = "edge";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function AdminDashboard() {
  const [view, setView] = useState("add-video");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [aiReport, setAiReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const reportRef = useRef<HTMLDivElement>(null);

  const [videoData, setVideoData] = useState({
    title: "",
    name: "",
    link: "",
    description: "",
    class_date: "",
    class_type: "visual",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/");

    if (view === "students") {
      fetch(
        `${apiUrl}/api/admin/students?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
        .then((res) => res.json())
        .then((data) => {
          setStudents(data.students || []);
          setTotalPages(data.totalPages || 1);
        })
        .catch(() => console.error("Failed to fetch students"));
    }
  }, [view, router, currentPage]);

  const fetchReport = async (studentId: number) => {
    setReportLoading(true);
    setAiReport(null);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        `${apiUrl}/api/admin/student-report/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setAiReport(data);
    } catch (error) {
      alert("Could not generate report");
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (view === "manage-lessons") {
      const token = localStorage.getItem("adminToken");
      fetch(`${apiUrl}/api/admin/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setLessons(Array.isArray(data) ? data : []))
        .catch(() => setLessons([]));
    }
  }, [view]);

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${apiUrl}/api/admin/videos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setLessons(lessons.filter((l) => l.id !== id));
      }
    } catch (error) {
      alert("Failed to delete lesson");
    }
  };

  const handleDelete = async (studentId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName}?`))
      return;

    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${apiUrl}/api/admin/students/${studentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setStudents(students.filter((s: any) => s.id !== studentId));
        alert("Student removed successfully.");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Delete failed.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Connection error.");
    }
  };
  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");

    try {
      await fetch(`${apiUrl}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Backend logout failed, proceeding with local logout");
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      window.location.href = "/";
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("adminToken");

    try {
      const res = await fetch(`${apiUrl}/api/admin/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(videoData),
      });

      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
        setVideoData({
          title: "",
          name: "",
          link: "",
          description: "",
          class_date: "",
          class_type: "visual",
        });
      }
    } catch (error) {
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex font-sans">
      <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tighter">
            Learning<span className="text-indigo-400">Styles</span>
          </h1>
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">
            Admin Control
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView("add-video")}
            className={`w-full text-left p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${view === "add-video" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
          >
            <span>+</span> Publish Lesson
          </button>
          <button
            onClick={() => setView("students")}
            className={`w-full text-left p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${view === "students" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
          >
            <span>👥</span> Student Directory
          </button>
          <button
            onClick={() => setView("manage-lessons")}
            className={`w-full text-left p-4 rounded-xl font-bold transition-all flex items-center gap-3 ${view === "manage-lessons" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-slate-800"}`}
          >
            <span>📚</span> Manage Lessons
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left p-4 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        {view === "manage-lessons" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <header className="mb-8">
              <h2 className="text-3xl font-black uppercase italic text-slate-900">
                Lesson Management
              </h2>
              <p className="text-slate-500 font-bold text-sm">
                Review or remove existing curriculum materials.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {lessons.map((lesson: any) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0">
                      {lesson.class_type?.charAt(0) || "V"}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg leading-tight">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {lesson.name} •{" "}
                        {new Date(lesson.class_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="px-5 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    Delete Lesson
                  </button>
                </div>
              ))}

              {lessons.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="font-bold text-slate-400">
                    No lessons found in the database.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "add-video" && (
          <div className="max-w-3xl">
            <header className="mb-8">
              <h2 className="text-4xl font-black text-slate-900 italic uppercase">
                Publish New Lesson
              </h2>
              <p className="text-slate-500 font-bold">
                Schedule live classes and learning materials for your students.
              </p>
            </header>

            {successMsg && (
              <div className="bg-green-500 text-white p-4 rounded-2xl font-bold mb-6 animate-bounce">
                ✓ Lesson published successfully!
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={videoData.title}
                      required
                      placeholder="e.g. EPS Topik Grammar"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all font-black text-slate-900 placeholder:font-bold"
                      onChange={(e) =>
                        setVideoData({ ...videoData, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={videoData.name}
                      required
                      placeholder="e.g. Mr. Kalinga"
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all font-black text-slate-900 placeholder:font-bold"
                      onChange={(e) =>
                        setVideoData({ ...videoData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Zoom / YouTube Link
                    </label>
                    <input
                      type="url"
                      value={videoData.link}
                      required
                      placeholder="https://zoom.us/..."
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all font-black text-slate-900 placeholder:font-bold"
                      onChange={(e) =>
                        setVideoData({ ...videoData, link: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1">
                      Class Schedule
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={videoData.class_date}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all font-black text-slate-900 placeholder:font-bold"
                      onChange={(e) =>
                        setVideoData({
                          ...videoData,
                          class_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Learning Category
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["visual", "auditory", "kinesthetic"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setVideoData({ ...videoData, class_type: type })
                        }
                        className={`p-4 rounded-2xl border-2 font-black capitalize transition-all ${
                          videoData.class_type === type
                            ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg"
                            : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Brief Description
                  </label>
                  <textarea
                    value={videoData.description}
                    required
                    placeholder="What is this lesson about?"
                    rows={3}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none focus:border-indigo-600 focus:bg-white transition-all font-black text-slate-900 placeholder:font-bold"
                    onChange={(e) =>
                      setVideoData({
                        ...videoData,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl text-xl hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-[0.98] disabled:bg-slate-400"
                >
                  {loading
                    ? "COMMUNICATING WITH SERVER..."
                    : "PUBLISH LESSON NOW"}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === "students" && (
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <header className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 italic uppercase">
                Student Registry
              </h2>
              <p className="text-slate-500 font-bold">
                A complete list of registered students and their contact info.
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Name
                    </th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Email
                    </th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 font-black text-slate-900">
                        {student.name}
                      </td>
                      <td className="py-4 font-medium text-slate-500">
                        {student.email}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            fetchReport(student.id);
                          }}
                          className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-xs hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          VIEW AI AUDIT
                        </button>
                      </td>
                      <td>
                        {" "}
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="bg-red-50 text-red-500 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete Student"
                        >
                          <span className="text-lg">×</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-slate-500">
                  Showing page{" "}
                  <span className="text-slate-900">{currentPage}</span> of{" "}
                  {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-4 py-2 rounded-xl font-black text-xs border-2 border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:text-slate-400 transition-all"
                  >
                    PREVIOUS
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                            currentPage === page
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "text-slate-400 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-4 py-2 rounded-xl font-black text-xs border-2 border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-slate-100 disabled:hover:text-slate-400 transition-all"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            </div>
            {selectedStudent && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end">
                <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
                  {/* Report Header */}
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic text-slate-900">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                        Performance Analysis Audit
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-slate-400 font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-8 space-y-10 pb-20">
                    {reportLoading ? (
                      <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                        <p className="font-black text-indigo-600 animate-pulse uppercase text-xs tracking-widest">
                          Generating Visual Insights...
                        </p>
                      </div>
                    ) : (
                      aiReport && (
                        <>
                          {/* VISUAL 1: DONUT CHART & PRIMARY STYLE */}
                          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-10">
                            <div className="w-44 h-44 shrink-0">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      {
                                        name: "Auditory",
                                        value: aiReport.scores?.auditory || 0,
                                      },
                                      {
                                        name: "Visual",
                                        value: aiReport.scores?.visual || 0,
                                      },
                                      {
                                        name: "Kinetic",
                                        value:
                                          aiReport.scores?.kinesthetic || 0,
                                      },
                                    ]}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                  >
                                    <Cell fill="#6366f1" /> {/* Indigo */}
                                    <Cell fill="#a855f7" /> {/* Purple */}
                                    <Cell fill="#f97316" /> {/* Orange */}
                                  </Pie>
                                  <Tooltip
                                    contentStyle={{
                                      borderRadius: "15px",
                                      border: "none",
                                      fontWeight: "bold",
                                    }}
                                    itemStyle={{ color: "#1e293b" }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="text-center md:text-left">
                              <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-2">
                                Primary Learning Style
                              </p>
                              <h4 className="text-3xl font-black italic uppercase leading-tight mb-3">
                                {aiReport.learning_style || "Analyzing..."}
                              </h4>
                              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md border border-indigo-500/30 font-bold">
                                  AUDITORY: {aiReport.scores?.auditory}%
                                </span>
                                <span className="text-[9px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30 font-bold">
                                  VISUAL: {aiReport.scores?.visual}%
                                </span>
                                <span className="text-[9px] bg-orange-500/20 text-orange-300 px-2 py-1 rounded-md border border-orange-500/30 font-bold">
                                  KINETIC: {aiReport.scores?.kinesthetic}%
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* VISUAL 2: COMPETENCY PROGRESS BARS & ANALYSIS */}
                          <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Skill Competency Breakdown
                            </h4>

                            {[
                              {
                                label: "Auditory Processing",
                                score: aiReport.scores?.auditory,
                                color: "bg-indigo-600",
                                text: aiReport.auditory_analysis,
                                icon: "👂",
                              },
                              {
                                label: "Visual Recognition",
                                score: aiReport.scores?.visual,
                                color: "bg-purple-600",
                                text: aiReport.visual_analysis,
                                icon: "👁️",
                              },
                              {
                                label: "Kinesthetic Application",
                                score: aiReport.scores?.kinesthetic,
                                color: "bg-orange-500",
                                text: aiReport.kinesthetic_analysis,
                                icon: "✋",
                              },
                            ].map((item) => (
                              <div key={item.label} className="group">
                                <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>{" "}
                                    {item.label}
                                  </span>
                                  <span className="text-lg font-black text-slate-900 italic">
                                    {item.score}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/50">
                                  <div
                                    className={`${item.color} h-full transition-all duration-1000 ease-out`}
                                    style={{ width: `${item.score}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                  {item.text}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* STRENGTHS & WEAKNESSES GRID */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <span className="text-green-500">●</span> Key
                                Strengths
                              </h4>
                              {aiReport.strengths?.map(
                                (s: string, i: number) => (
                                  <div
                                    key={i}
                                    className="text-xs bg-green-50 text-green-700 px-4 py-3 rounded-xl font-bold border border-green-100"
                                  >
                                    ✓ {s}
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="space-y-3">
                              <h4 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-2">
                                <span className="text-red-500">●</span> Critical
                                Gaps
                              </h4>
                              {aiReport.weaknesses?.map(
                                (w: string, i: number) => (
                                  <div
                                    key={i}
                                    className="text-xs bg-red-50 text-red-700 px-4 py-3 rounded-xl font-bold border border-red-100"
                                  >
                                    ⚠ {w}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* ROADMAP / SUGGESTIONS */}
                          <div className="bg-white border-4 border-slate-900 p-8 rounded-[2rem] shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]">
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                              <span className="text-xl"></span> Actionable
                              Roadmap
                            </h4>
                            <div className="space-y-3">
                              {aiReport.suggestions?.map(
                                (step: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-indigo-100 transition-all group"
                                  >
                                    <span className="bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 group-hover:bg-indigo-600 transition-colors">
                                      {i + 1}
                                    </span>
                                    <p className="text-sm font-bold text-slate-800 leading-snug">
                                      {step}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* AI SUGGESTION BOX */}
                          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl shadow-indigo-100 border-4 border-slate-900">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl"></span>
                              <h4 className="font-black uppercase tracking-tighter text-xl italic leading-none">
                                Executive Insight
                              </h4>
                            </div>
                            <p className="text-indigo-50 text-sm leading-relaxed font-bold italic opacity-90">
                              "{aiReport.ai_suggestion}"
                            </p>
                          </div>
                        </>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
            {students.length === 0 && (
              <p className="mt-8 text-center font-bold text-slate-400">
                No students recorded.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
