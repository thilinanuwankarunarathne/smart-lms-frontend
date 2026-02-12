"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function TakeTestPage({ params }: { params: Promise<{ category: string }> | { category: string } }) {
  const [category, setCategory] = useState<string>("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      if (params instanceof Promise) {
        const resolved = await params;
        setCategory(resolved.category);
      } else {
        setCategory((params as any).category);
      }
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!category) return;

    const token = localStorage.getItem("studentToken");
    const studentId = localStorage.getItem("studentId");

    if (!token || !studentId) {
      alert("Please login to access this assessment.");
      router.push("/");
      return;
    }
    
    setIsAuthorized(true);

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/student/test/${category}`);
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, router]);

  const handleChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
        router.push("/");
        return;
    }

    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
      questionId: parseInt(qId),
      answer: val
    }));

    try {
      const res = await fetch(`${apiUrl}/api/student/test/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, answers: formattedAnswers })
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Assessment Completed! Your Score: ${data.score}`);
        router.push("/student");
      }
    } catch (error) {
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const getOptions = (optData: any) => {
    if (!optData) return [];
    if (Array.isArray(optData)) return optData;
    try { return JSON.parse(optData); } catch (e) { return []; }
  };

  if (!isAuthorized && !loading) return null;
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="font-bold text-slate-500">Loading Assessment...</p>
    </div>
  );

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar Header */}
        <div className="sticky top-4 z-50 mb-6 bg-white/80 backdrop-blur-md border-2 border-slate-900 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black uppercase italic text-slate-900">{category} Test</h1>
            <p className="text-xs font-bold text-slate-500">{answeredCount} of {questions.length} answered</p>
          </div>
          <div className="w-32 bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-900">
            <div 
                className="bg-indigo-600 h-full transition-all duration-500" 
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white border-4 border-slate-900 p-12 text-center rounded-3xl">
            <p className="text-xl font-bold text-slate-400">No questions found.</p>
            <button onClick={() => router.push("/student")} className="mt-4 text-indigo-600 font-bold underline">Return to Library</button>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q: any, index: number) => {
              const isAnswered = !!answers[q.id];
              return (
                <div 
                  key={q.id} 
                  className={`bg-white border-4 p-6 transition-all duration-300 rounded-3xl ${isAnswered ? 'border-indigo-600 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)]' : 'border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border-2 ${isAnswered ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-100 border-slate-900 text-slate-900'}`}>
                      Question {index + 1}
                    </span>
                    {isAnswered && (
                      <span className="flex items-center gap-1 text-indigo-600 font-black text-sm animate-bounce">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ANSWERED
                      </span>
                    )}
                  </div>

                  <p className="font-bold text-lg text-slate-800 mb-6 leading-relaxed">{q.question_text}</p>

                  {q.question_type === 'mcq' ? (
                    <div className="grid grid-cols-1 gap-3">
                      {getOptions(q.options).map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => handleChange(q.id, opt)}
                          className={`group text-left p-4 rounded-2xl border-2 font-bold transition-all flex items-center justify-between ${
                            answers[q.id] === opt 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                            : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-600'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id] === opt ? 'bg-white border-white' : 'border-slate-300'}`}>
                             {answers[q.id] === opt && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="Type your answer clearly..." 
                        value={answers[q.id] || ""}
                        className="w-full p-4 pr-12 rounded-2xl border-2 border-slate-200 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 font-bold text-slate-700 transition-all bg-slate-50 focus:bg-white"
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        />
                        {isAnswered && <span className="absolute right-4 top-4 text-indigo-600">✓</span>}
                    </div>
                  )}
                </div>
              );
            })}

            <button 
              onClick={handleSubmit} 
              disabled={submitting || answeredCount < questions.length}
              className="w-full mt-10 bg-slate-900 text-white font-black py-6 rounded-3xl text-2xl hover:bg-indigo-600 hover:shadow-[0_10px_20px_rgba(79,70,229,0.4)] transition-all disabled:bg-slate-300 disabled:shadow-none transform active:scale-95 flex flex-col items-center justify-center gap-1"
            >
              {submitting ? "SUBMITTING..." : "COMPLETE ASSESSMENT"}
              {answeredCount < questions.length && <span className="text-[10px] uppercase opacity-70">Answer all questions to enable</span>}
            </button>
            <div className="h-20"></div> {/* Bottom Spacer */}
          </div>
        )}
      </div>
    </div>
  );
}