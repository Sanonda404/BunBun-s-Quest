import { useState, useEffect } from "react";

type Question = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

type ReviewItem = {
  id: string;
  question: string;
  user_answer: string;
  correct_answer: string;
  explanation: string;
  topic: string;
};

export default function QuizModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"upload" | "quiz" | "review">("quiz");
  
  // Quiz Customization State
  const [quizTopic, setQuizTopic] = useState("Database Management Systems");
  const [numQuestions, setNumQuestions] = useState(3);
  const [questionType, setQuestionType] = useState("Multiple Choice");
  
  // Quiz Session State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Upload State
  const [docId, setDocId] = useState("");
  const [notesText, setNotesText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Review Bank State
  const [reviewBank, setReviewBank] = useState<ReviewItem[]>([]);

  const fetchReviewBank = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/quiz/review-bank");
      const data = await res.json();
      setReviewBank(data.review_bank || []);
    } catch (err) {
      console.error("Failed to fetch review bank:", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchReviewBank();
  }, [isOpen]);

  // Handler: Generate Quiz
  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setQuestions([]);
    setCurrentIdx(0);
    setScore(0);
    setIsAnswered(false);
    setSelectedOption(null);
    try {
      const res = await fetch("http://localhost:8000/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quizTopic,
          num_questions: numQuestions,
          question_type: questionType,
        }),
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Failed to generate quiz:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Upload Notes (Text or PDF)
  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus("Processing notes...");
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("document_id", docId || selectedFile.name);
        formData.append("topic", quizTopic);
        formData.append("file", selectedFile);

        const res = await fetch("http://localhost:8000/api/quiz/upload-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUploadStatus(`Success! PDF vectorized (${data.chunks_created} chunks).`);
        setSelectedFile(null);
      } else if (notesText) {
        const res = await fetch("http://localhost:8000/api/quiz/upload-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ document_id: docId || "note_doc", text: notesText, topic: quizTopic }),
        });
        const data = await res.json();
        setUploadStatus(`Success! Text vectorized (${data.chunks_created} chunks).`);
        setNotesText("");
      }
      setDocId("");
    } catch (err) {
      setUploadStatus("Upload failed. Check backend.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIdx];
    const isCorrect = option === currentQ.correct_answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      try {
        await fetch("http://localhost:8000/api/quiz/review-bank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQ.question,
            user_answer: option,
            correct_answer: currentQ.correct_answer,
            explanation: currentQ.explanation,
            topic: quizTopic,
          }),
        });
        fetchReviewBank();
      } catch (err) {
        console.error("Failed to save to review bank:", err);
      }
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIdx((prev) => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral/40 backdrop-blur-xs p-4">
      <div className="cozy-card w-full max-w-2xl bg-base-100 p-6 flex flex-col gap-4 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-base-300 pb-3">
          <h2 className="text-xl font-bold text-primary-content flex items-center gap-2">
            🧠 Knowledge Vault & Quiz Engine
          </h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-base-200 justify-center">
          <button
            className={`tab ${activeTab === "quiz" ? "tab-active bg-primary!" : ""}`}
            onClick={() => setActiveTab("quiz")}
          >
            ✏️ Take Quiz
          </button>
          <button
            className={`tab ${activeTab === "upload" ? "tab-active bg-primary!" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            📥 Upload Notes / PDF
          </button>
          <button
            className={`tab ${activeTab === "review" ? "tab-active bg-primary!" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            📚 Review Bank ({reviewBank.length})
          </button>
        </div>

        {/* TAB 1: QUIZ CONFIG & GAMEPLAY */}
        {activeTab === "quiz" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Topic (e.g. DBMS, Operating Systems)"
                className="input input-sm input-bordered rounded-xl text-xs sm:col-span-1"
              />
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="select select-sm select-bordered rounded-xl text-xs"
              >
                <option value="Multiple Choice">Multiple Choice</option>
                <option value="True/False">True / False</option>
                <option value="Fill-in-the-blank">Fill-in-the-blank</option>
              </select>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="input input-sm input-bordered rounded-xl text-xs w-16 text-center"
                />
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="btn btn-sm btn-primary rounded-full text-xs font-semibold flex-1"
                >
                  {isGenerating ? "Generating..." : "Generate ✨"}
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 text-sm opacity-70">
                Configure your topic, question type, and count above to start your AI quiz! 🌸
              </div>
            ) : currentIdx < questions.length ? (
              <div className="cozy-card p-5 bg-base-200/50 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-bold text-primary-content">
                  <span>Question {currentIdx + 1} of {questions.length}</span>
                  <span>Score: {score}</span>
                </div>

                <p className="font-semibold text-sm">{questions[currentIdx].question}</p>

                <div className="grid gap-2">
                  {questions[currentIdx].options.map((opt, i) => {
                    let btnClass = "btn-outline btn-secondary";
                    if (isAnswered) {
                      if (opt === questions[currentIdx].correct_answer) btnClass = "btn-success text-white";
                      else if (opt === selectedOption) btnClass = "btn-error text-white";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(opt)}
                        disabled={isAnswered}
                        className={`btn btn-sm rounded-xl text-left justify-start ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="p-3 bg-base-100 rounded-xl border border-base-300 text-xs space-y-2">
                    <p className="font-bold">
                      {selectedOption === questions[currentIdx].correct_answer ? "✨ Correct!" : "🌧️ Not quite!"}
                    </p>
                    <p>{questions[currentIdx].explanation}</p>
                    <button onClick={handleNextQuestion} className="btn btn-xs btn-primary rounded-lg float-right">
                      Next Question ➔
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <h3 className="text-lg font-bold">🎉 Quiz Completed!</h3>
                <p className="text-sm">You scored {score} out of {questions.length}!</p>
                <button onClick={handleGenerateQuiz} className="btn btn-sm btn-primary rounded-full">
                  Generate New Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD NOTES & PDF */}
        {activeTab === "upload" && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Document ID / Title"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              className="input input-sm input-bordered rounded-xl text-xs"
            />
            
            <div className="border-2 border-dashed border-base-300 rounded-xl p-4 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="file-input file-input-sm file-input-bordered w-full text-xs"
              />
              <span className="text-[10px] opacity-60 mt-1 block">Or paste text notes below:</span>
            </div>

            <textarea
              placeholder="Paste study notes here..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              rows={4}
              className="textarea textarea-bordered rounded-xl text-xs font-sans"
              disabled={!!selectedFile}
            />

            <button
              onClick={handleUpload}
              disabled={isUploading || (!selectedFile && !notesText)}
              className="btn btn-sm btn-secondary rounded-full font-semibold"
            >
              {isUploading ? "Processing..." : "Ingest into Knowledge Vault 📥"}
            </button>

            {uploadStatus && (
              <p className="text-xs text-center font-semibold mt-1">{uploadStatus}</p>
            )}
          </div>
        )}

        {/* TAB 3: REVIEW BANK */}
        {activeTab === "review" && (
          <div className="flex flex-col gap-3">
            {reviewBank.length === 0 ? (
              <div className="text-center py-10 text-sm opacity-70">
                No missed questions saved! Excellent job! 🌸
              </div>
            ) : (
              reviewBank.map((item) => (
                <div key={item.id} className="p-3 bg-base-200/60 rounded-xl border border-base-300 text-xs space-y-1">
                  <div className="font-bold text-primary-content">{item.question}</div>
                  <div className="text-error">Your Answer: {item.user_answer}</div>
                  <div className="text-success font-semibold">Correct: {item.correct_answer}</div>
                  <div className="text-neutral/80 pt-1 border-t border-base-300/50">{item.explanation}</div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="badge badge-xs badge-outline">{item.topic}</span>
                    <button
                      onClick={async () => {
                        await fetch(`http://localhost:8000/api/quiz/review-bank/${item.id}`, { method: "DELETE" });
                        fetchReviewBank();
                      }}
                      className="btn btn-xs btn-ghost text-error"
                    >
                      Mastered (Delete)
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}