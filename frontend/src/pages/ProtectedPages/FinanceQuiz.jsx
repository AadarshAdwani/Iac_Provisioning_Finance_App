import { useState } from "react";

const QUIZ_BASE_URL = "/quiz-api";

const FinanceQuiz = () => {
  const [stage, setStage] = useState("upload");
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongTopics, setWrongTopics] = useState([]);
  const [report, setReport] = useState(null);
  const [answerDetail, setAnswerDetail] = useState([]);

  // ── UPLOAD & GENERATE ──────────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return setError("Please select a PDF file.");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("num_questions", numQuestions);

      const res = await fetch(`${QUIZ_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) return setError(data.error || "Upload failed.");

      const qRes  = await fetch(`${QUIZ_BASE_URL}/questions`);
      const qData = await qRes.json();
      setQuestions(qData.questions);
      setCurrentIndex(0);
      setScore(0);
      setWrongTopics([]);
      setAnswerDetail([]);
      setStage("quiz");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── SUBMIT ANSWER ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await fetch(`${QUIZ_BASE_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: questions[currentIndex].id,
          answer:      selected,
        }),
      });
      const data = await res.json();
      setFeedback(data);

      const newScore = data.is_correct ? score + 1 : score;
      const newWrong = data.is_correct
        ? wrongTopics
        : [...wrongTopics, data.topic];

      setScore(newScore);
      setWrongTopics(newWrong);
      setAnswerDetail((prev) => [
        ...prev,
        {
          question:       questions[currentIndex].question,
          topic:          questions[currentIndex].topic,
          options:        questions[currentIndex].options,
          user_answer:    selected,
          correct_answer: data.correct_answer,
          is_correct:     data.is_correct,
          explanation:    data.explanation,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── NEXT QUESTION or FINISH ────────────────────────────────────────
  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected("");
      setFeedback(null);
    } else {
      setLoading(true);
      try {
        const res = await fetch(`${QUIZ_BASE_URL}/result`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score:        score,
            total:        questions.length,
            wrong_topics: wrongTopics,
          }),
        });
        const data = await res.json();
        setReport(data);
        setStage("report");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // ── RETAKE ─────────────────────────────────────────────────────────
  const handleRetake = () => {
    setStage("upload");
    setFile(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelected("");
    setFeedback(null);
    setScore(0);
    setWrongTopics([]);
    setReport(null);
    setAnswerDetail([]);
    setError("");
  };

  // ══════════════════════════════════════════════════════════════════
  //  RENDER — UPLOAD SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (stage === "upload") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>📊 FinanceIQ — AI Quiz Bot</h2>
          <p style={styles.subtitle}>
            Upload any Investment Report PDF and test your finance knowledge
          </p>

          <div style={styles.uploadBox}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ marginBottom: "8px" }}
            />
            {file && <p style={styles.fileName}>📄 {file.name}</p>}
          </div>

          <div style={styles.countSection}>
            <label style={styles.label}>How many questions?</label>
            <div style={styles.countRow}>
              {[4, 6, 8, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumQuestions(n)}
                  style={{
                    ...styles.countBtn,
                    ...(numQuestions === n ? styles.countBtnActive : {}),
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            onClick={handleUpload}
            disabled={loading}
            style={styles.primaryBtn}
          >
            {loading ? "Analysing PDF..." : "Analyse & Generate Quiz →"}
          </button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  //  RENDER — QUIZ SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (stage === "quiz") {
    const q      = questions[currentIndex];
    const isLast = currentIndex + 1 === questions.length;

    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.quizHeader}>
            <span style={styles.questionCount}>
              QUESTION {currentIndex + 1} OF {questions.length}
            </span>
            <span style={styles.scoreBadge}>SCORE: {score}</span>
          </div>

          <p style={styles.topicTag}>{q.topic}</p>
          <h3 style={styles.questionText}>{q.question}</h3>

          <div style={styles.optionsGrid}>
            {q.options.map((opt, i) => {
              const letter = opt[0];
              let btnStyle = { ...styles.optionBtn };
              if (feedback) {
                if (letter === feedback.correct_answer)
                  btnStyle = { ...btnStyle, ...styles.optionCorrect };
                else if (letter === selected)
                  btnStyle = { ...btnStyle, ...styles.optionWrong };
              } else if (selected === letter) {
                btnStyle = { ...btnStyle, ...styles.optionSelected };
              }
              return (
                <button
                  key={i}
                  style={btnStyle}
                  onClick={() => !feedback && setSelected(letter)}
                  disabled={!!feedback}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              style={{
                ...styles.feedbackBox,
                ...(feedback.is_correct
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong),
              }}
            >
              <p style={styles.feedbackVerdict}>
                {feedback.is_correct ? "✅ Correct!" : "❌ Incorrect"}
              </p>
              {!feedback.is_correct && (
                <>
                  <p>
                    <strong>Correct Answer:</strong> {feedback.correct_answer}
                  </p>
                  <p style={styles.explanation}>{feedback.explanation}</p>
                </>
              )}
            </div>
          )}

          <div style={styles.actionRow}>
            {!feedback ? (
              <button
                onClick={handleSubmit}
                disabled={!selected || loading}
                style={styles.primaryBtn}
              >
                {loading ? "Evaluating..." : "Submit Answer"}
              </button>
            ) : (
              <button onClick={handleNext} style={styles.primaryBtn}>
                {isLast ? "View Report →" : "Next Question →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  //  RENDER — REPORT SCREEN
  // ══════════════════════════════════════════════════════════════════
  if (stage === "report" && report) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.reportHeader}>
            <div style={styles.accuracyCircle}>
              <span style={styles.accuracyNumber}>{report.percentage}%</span>
              <span style={styles.accuracyLabel}>Score</span>
            </div>
            <div>
              <h2 style={styles.gradeTitle}>{report.grade}</h2>
              <p style={styles.gradeMsg}>{report.message}</p>
              <p>
                <strong>{report.score}</strong> out of{" "}
                <strong>{report.total}</strong> correct
              </p>
            </div>
          </div>

          {report.wrong_topics?.length > 0 && (
            <div style={styles.weakTopics}>
              <h3>📌 Topics to Review</h3>
              <div style={styles.topicTags}>
                {report.wrong_topics.map((t, i) => (
                  <span key={i} style={styles.topicTag2}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleRetake} style={styles.primaryBtn}>
            Upload New PDF
          </button>
        </div>
      </div>
    );
  }

  return null;
};

// ── Inline Styles ──────────────────────────────────────────────────────────
const styles = {
  page: {
    padding: "24px",
    maxWidth: "780px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    marginBottom: "8px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "24px",
  },
  uploadBox: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "24px",
    textAlign: "center",
    marginBottom: "20px",
  },
  fileName: {
    marginTop: "8px",
    fontSize: "0.85rem",
    color: "#555",
  },
  countSection: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: 600,
    display: "block",
    marginBottom: "8px",
  },
  countRow: {
    display: "flex",
    gap: "8px",
  },
  countBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "pointer",
    background: "#f5f5f5",
  },
  countBtnActive: {
    background: "#6c63ff",
    color: "#fff",
    border: "1px solid #6c63ff",
  },
  primaryBtn: {
    marginTop: "20px",
    padding: "12px 28px",
    background: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    display: "block",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.85rem",
    marginBottom: "8px",
  },
  quizHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    fontSize: "0.8rem",
    color: "#888",
  },
  questionCount: {
    fontWeight: 600,
  },
  scoreBadge: {
    fontWeight: 700,
    color: "#333",
  },
  topicTag: {
    fontSize: "0.75rem",
    color: "#6c63ff",
    fontWeight: 700,
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  questionText: {
    fontSize: "1.1rem",
    marginBottom: "20px",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  optionBtn: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    background: "#fafafa",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "0.9rem",
  },
  optionSelected: {
    border: "1px solid #6c63ff",
    background: "#f0eeff",
  },
  optionCorrect: {
    border: "1px solid #22c55e",
    background: "#f0fdf4",
  },
  optionWrong: {
    border: "1px solid #ef4444",
    background: "#fef2f2",
  },
  feedbackBox: {
    marginTop: "16px",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "8px",
  },
  feedbackCorrect: {
    background: "#f0fdf4",
    borderLeft: "4px solid #22c55e",
  },
  feedbackWrong: {
    background: "#fef2f2",
    borderLeft: "4px solid #ef4444",
  },
  feedbackVerdict: {
    fontWeight: 700,
    marginBottom: "8px",
  },
  explanation: {
    fontSize: "0.9rem",
    color: "#555",
    lineHeight: 1.6,
    marginTop: "8px",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  reportHeader: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
  },
  accuracyCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#6c63ff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  },
  accuracyNumber: {
    fontSize: "1.4rem",
    fontWeight: 700,
  },
  accuracyLabel: {
    fontSize: "0.7rem",
  },
  gradeTitle: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "4px",
  },
  gradeMsg: {
    color: "#555",
    marginBottom: "8px",
  },
  weakTopics: {
    marginBottom: "20px",
  },
  topicTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
  },
  topicTag2: {
    padding: "4px 12px",
    background: "#f0eeff",
    color: "#6c63ff",
    borderRadius: "20px",
    fontSize: "0.8rem",
  },
};

export default FinanceQuiz;