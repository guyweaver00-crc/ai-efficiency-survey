import { useState } from "react";

// ─────────────────────────────────────────────
// CONFIGURATION — update these two values
// ─────────────────────────────────────────────
const WEB3FORMS_KEY = "41ab902b-8ad2-4af4-9cf8-db321b50da80";
const YOUR_EMAIL    = "guy@guyweaver.com";        // where result summaries are sent
// ─────────────────────────────────────────────

const questions = [
  {
    id: "ai_mindset",
    category: "AI Mindset",
    question: "When you sit down to use an AI tool, how do you think about it?",
    options: [
      { text: "A smarter search engine — I ask it questions and it gives me answers", score: 1 },
      { text: "A useful work tool — good for certain tasks like drafting or summarising", score: 2 },
      { text: "A capable assistant — I give it tasks and it helps me get things done faster", score: 3 },
      { text: "A skilled colleague — I brief it properly, give it context, and hold it to a high standard", score: 4 },
    ],
  },
  {
    id: "model_selection",
    category: "Model Selection",
    question: "When you start an AI task, how do you choose which model to use?",
    options: [
      { text: "I always use the same tool — whatever I opened first", score: 1 },
      { text: "I switch occasionally but don't follow a clear logic", score: 2 },
      { text: "I have a rough sense of which tools suit different tasks", score: 3 },
      { text: "I actively match model capability to task complexity and cost", score: 4 },
    ],
  },
  {
    id: "prompt_structure",
    category: "Prompt Quality",
    question: "How would you describe a typical prompt you write?",
    options: [
      { text: "A short question or instruction — I keep it simple", score: 1 },
      { text: "A paragraph with some context, but no fixed structure", score: 2 },
      { text: "I include role, context and instructions most of the time", score: 3 },
      { text: "I use a structured format: role, context, instructions, format, boundaries and example output", score: 4 },
    ],
  },
  {
    id: "context_files",
    category: "Context & Memory",
    question: "How do you handle background information the AI needs to know about you or your work?",
    options: [
      { text: "I re-explain my role and context at the start of most conversations", score: 1 },
      { text: "I copy and paste previous context when I remember to", score: 2 },
      { text: "I use custom instructions but haven't set up project files", score: 3 },
      { text: "I use project files and structured context documents that persist across sessions", score: 4 },
    ],
  },
  {
    id: "context_drift",
    category: "Context Drift",
    question: "What do you do when AI output starts to feel inconsistent or lower quality partway through a long session?",
    options: [
      { text: "I haven't noticed this happening", score: 1 },
      { text: "I notice it but keep going and hope it corrects itself", score: 2 },
      { text: "I start a new conversation but lose my earlier context", score: 3 },
      { text: "I use a context checkpoint prompt or summarise and reset deliberately", score: 4 },
    ],
  },
  {
    id: "task_architecture",
    category: "Task Architecture",
    question: "When tackling a complex task (e.g. research + analysis + a written output), how do you approach it?",
    options: [
      { text: "I write one prompt asking for everything at once", score: 1 },
      { text: "I do it in a couple of steps but don't plan it out", score: 2 },
      { text: "I break it into stages but the structure varies each time", score: 3 },
      { text: "I deliberately sequence tasks: research first, then analysis, then synthesis — each as a separate step", score: 4 },
    ],
  },
  {
    id: "reverse_prompting",
    category: "Prompt Optimisation",
    question: "Before running an important or complex prompt, what do you typically do to maximise the quality of the output?",
    options: [
      { text: "I write what comes to mind and run it — if it's wrong I correct it afterwards", score: 1 },
      { text: "I reread it and tweak the wording before sending", score: 2 },
      { text: "I think through what context and instructions the AI needs and structure it carefully", score: 3 },
      { text: "I have a specific preparation process I follow before running high-stakes prompts that consistently improves output quality", score: 4 },
    ],
  },
  {
    id: "multi_tool",
    category: "Tool Strategy",
    question: "Which best describes how you use AI tools day to day?",
    options: [
      { text: "I use one tool for everything — whichever my organisation provided", score: 1 },
      { text: "I occasionally use a second tool but there's no real logic to it", score: 2 },
      { text: "I use different tools for different types of task based on their strengths", score: 3 },
      { text: "I use multiple tools deliberately — matching each to the task, cross-referencing outputs, and using one to sense-check another", score: 4 },
    ],
  },
  {
    id: "document_handling",
    category: "Document Handling",
    question: "When you need AI to work with a document or large block of information, what do you typically do?",
    options: [
      { text: "I paste the full text directly into the chat", score: 1 },
      { text: "I paste the relevant sections but it's not always systematic", score: 2 },
      { text: "I upload documents when the tool allows it", score: 3 },
      { text: "I use structured files (MD, PDF) and know when each format works best", score: 4 },
    ],
  },
  {
    id: "verification",
    category: "Output Verification",
    question: "When AI produces facts, figures or analysis, how do you handle verification?",
    options: [
      { text: "I generally trust the output — it usually looks right", score: 1 },
      { text: "I check things that feel uncertain but don't have a consistent process", score: 2 },
      { text: "I verify numerical or factual claims as a habit", score: 3 },
      { text: "I have a deliberate verification step built into my workflow for any high-stakes output", score: 4 },
    ],
  },
  {
    id: "agents_automation",
    category: "Agents & Automation",
    question: "How familiar are you with AI agents and scheduled or automated tasks?",
    options: [
      { text: "I use AI through chat interfaces only — I didn't know automation was possible", score: 1 },
      { text: "I know agents exist but haven't set one up", score: 2 },
      { text: "I've built or used a basic agent for a specific task", score: 3 },
      { text: "I have automated workflows running regularly and know when to use agents vs chat tools", score: 4 },
    ],
  },
  {
    id: "data_security",
    category: "Data Security",
    question: "How confident are you about what data you should and shouldn't put into AI tools at work?",
    options: [
      { text: "I'm not sure what our policy is — I use my judgement", score: 1 },
      { text: "I know there are restrictions but I'm vague on the detail", score: 2 },
      { text: "I understand the policy and follow it", score: 3 },
      { text: "I understand the policy, follow it, and explain it clearly to colleagues", score: 4 },
    ],
  },
];

const getLevel = (score, max) => {
  const pct = score / max;
  if (pct >= 0.85) return { label: "Advanced", color: "#22c55e" };
  if (pct >= 0.65) return { label: "Proficient", color: "#3b82f6" };
  if (pct >= 0.4)  return { label: "Developing", color: "#f59e0b" };
  return { label: "Foundational", color: "#ef4444" };
};

const recommendations = {
  ai_mindset: {
    title: "AI Mindset",
    detail: "How you think about AI directly determines how you use it. People who treat AI as a search engine get search-engine-quality results. People who treat it as a skilled colleague — briefing it properly, giving it context, holding it to a standard — get fundamentally different output. The mindset shift is the foundation everything else builds on.",
  },
  model_selection: {
    title: "Model Selection",
    detail: "You are likely using expensive frontier models for tasks that lighter, cheaper models handle equally well. Learning to route tasks by complexity could cut your AI costs by 40–60% with no drop in quality.",
  },
  prompt_structure: {
    title: "Prompt Architecture",
    detail: "Unstructured prompts produce inconsistent output and require more correction rounds — burning more tokens than a well-constructed prompt upfront. A six-component prompt framework pays back immediately.",
  },
  context_files: {
    title: "Context & Memory",
    detail: "Re-explaining your role and background in every session is significant wasted effort. Project files and structured context documents eliminate this entirely and improve output quality throughout.",
  },
  context_drift: {
    title: "Context Drift",
    detail: "Output quality degrades silently in long sessions as earlier instructions lose influence. Not recognising this leads to poor outputs and rework. A simple checkpoint prompt technique prevents it.",
  },
  task_architecture: {
    title: "Task Architecture",
    detail: "Asking AI to research, analyse, and write all in one prompt produces worse output than a structured sequence. Breaking complex tasks into deliberate steps produces significantly higher quality results.",
  },
  reverse_prompting: {
    title: "Prompt Optimisation",
    detail: "There is a specific preparation technique used by advanced AI users that consistently produces higher quality output on complex tasks — without writing a longer prompt. Most people have never been shown it. It is one of the highest-leverage skills covered in the training session.",
  },
  multi_tool: {
    title: "Tool Strategy",
    detail: "Relying on a single AI tool means you are getting one perspective with no way to catch errors or hallucinations. Different models have genuine strengths in different areas. Using multiple tools deliberately — and knowing when to cross-reference outputs — materially improves output quality and reliability.",
  },
  document_handling: {
    title: "Document Handling",
    detail: "Pasting raw text repeatedly inflates token usage unnecessarily. Understanding when to use structured MD files, PDFs, or uploaded documents — and how to chunk large documents — materially improves efficiency.",
  },
  verification: {
    title: "Output Verification",
    detail: "AI hallucination on facts, figures and analysis is a real risk. Without a systematic verification habit, errors enter workflows undetected. This is especially high-stakes for financial or legal content.",
  },
  agents_automation: {
    title: "Agents & Automation",
    detail: "If you are manually triggering the same AI task repeatedly, you are leaving significant productivity on the table. Understanding when to deploy agents versus chat tools is a step-change in how AI fits into your workflow.",
  },
  data_security: {
    title: "Data Security",
    detail: "Uncertainty about what data is safe to use with AI tools is a genuine compliance risk. Clear understanding of your organisation's policy — and the difference between consumer and enterprise AI tools — is non-negotiable.",
  },
};

const categoryIcons = {
  "AI Mindset": "💡",
  "Model Selection": "⚡",
  "Prompt Quality": "✏️",
  "Context & Memory": "🧠",
  "Context Drift": "🌊",
  "Task Architecture": "🏗️",
  "Prompt Optimisation": "🎯",
  "Tool Strategy": "🔀",
  "Document Handling": "📄",
  "Output Verification": "🔍",
  "Agents & Automation": "🤖",
  "Data Security": "🔒",
};

export default function App() {
  const [phase, setPhase]       = useState("intro");
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState({});
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [name, setName]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const progress = (current / totalQuestions) * 100;

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [questions[current].id]: selected };
    setAnswers(newAnswers);
    setAnimating(true);
    setTimeout(() => {
      if (current + 1 < totalQuestions) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        submitResults(newAnswers);
        setPhase("results");
      }
      setAnimating(false);
    }, 300);
  };

  const submitResults = async (finalAnswers) => {
    if (submitted) return;
    const totalScore = Object.values(finalAnswers).reduce((a, b) => a + b, 0);
    const maxScore   = totalQuestions * 4;
    const level      = getLevel(totalScore, maxScore).label;

    const weakAreas = questions
      .filter(q => (finalAnswers[q.id] || 0) <= 2)
      .map(q => `${q.category} (score: ${finalAnswers[q.id]})`)
      .join(", ");

    const allScores = questions
      .map(q => `${q.category}: ${finalAnswers[q.id]}/4`)
      .join(" | ");

    const body = {
      access_key: WEB3FORMS_KEY,
      subject: `AI Diagnostic — ${name || "Anonymous"} · ${level} (${totalScore}/${maxScore})`,
      from_name: "AI Efficiency Survey",
      to: YOUR_EMAIL,
      name: name || "Anonymous",
      overall_score: `${totalScore} / ${maxScore}`,
      level,
      priority_gaps: weakAreas || "None — strong across the board",
      all_scores: allScores,
    };

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setSubmitted(true);
    } catch (e) {
      // silent fail — results page still shows
    }
  };

  const totalScore  = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore    = totalQuestions * 4;
  const overallLevel = getLevel(totalScore, maxScore);

  const weakAreas = questions
    .filter(q => (answers[q.id] || 0) <= 2)
    .sort((a, b) => (answers[a.id] || 0) - (answers[b.id] || 0));

  const strongAreas = questions
    .filter(q => (answers[q.id] || 0) >= 4)
    .map(q => q.category);

  const reset = () => {
    setPhase("intro"); setCurrent(0); setAnswers({});
    setSelected(null); setName(""); setSubmitted(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }

        .option-btn {
          background: #13131a; border: 1px solid #1e1e2e; color: #94a3b8;
          padding: 16px 20px; border-radius: 6px; text-align: left;
          cursor: pointer; transition: all 0.15s ease;
          font-family: 'DM Mono', monospace; font-size: 13px;
          line-height: 1.6; width: 100%; margin-bottom: 10px; display: block;
        }
        .option-btn:hover { border-color: #3b82f6; color: #e2e8f0; background: #16162a; }
        .option-btn.selected { border-color: #3b82f6; background: #0f1729; color: #93c5fd; }

        .next-btn {
          background: #3b82f6; color: white; border: none;
          padding: 14px 32px; border-radius: 6px;
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 600; letter-spacing: 0.05em; cursor: pointer;
          transition: all 0.15s ease; text-transform: uppercase;
        }
        .next-btn:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
        .next-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .ghost-btn {
          background: transparent; color: #3b82f6; border: 1px solid #3b82f6;
          padding: 14px 40px; border-radius: 6px;
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 700; letter-spacing: 0.1em; cursor: pointer;
          transition: all 0.2s ease; text-transform: uppercase;
        }
        .ghost-btn:hover { background: #3b82f6; color: white; }

        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .input-field {
          background: #13131a; border: 1px solid #1e1e2e; color: #e2e8f0;
          padding: 12px 16px; border-radius: 6px;
          font-family: 'DM Mono', monospace; font-size: 13px;
          width: 100%; outline: none; transition: border-color 0.15s;
        }
        .input-field:focus { border-color: #3b82f6; }

        .rec-card {
          background: #13131a; border: 1px solid #1e1e2e;
          border-left: 3px solid #ef4444; padding: 18px 20px;
          border-radius: 0 6px 6px 0; margin-bottom: 12px;
        }
        .strong-tag {
          display: inline-block; background: #052e16; color: #22c55e;
          border: 1px solid #166534; padding: 4px 12px; border-radius: 4px;
          font-size: 11px; font-family: 'DM Mono', monospace;
          margin: 4px 4px 4px 0; letter-spacing: 0.05em;
        }
        .score-ring {
          display: flex; align-items: center; justify-content: center;
          width: 110px; height: 110px; border-radius: 50%; border: 3px solid;
          flex-direction: column; flex-shrink: 0;
        }
      `}</style>

      <div style={{ maxWidth: 660, margin: "0 auto", padding: "40px 24px" }}>

        {/* Brand header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.2em", color: "#3b82f6", textTransform: "uppercase", marginBottom: 12,
          }}>
            Guy Weaver · AI Training
          </div>
          <div style={{ height: 1, background: "linear-gradient(to right, #1e3a5f, transparent)" }} />
        </div>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <div className="fade-in">
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800,
              lineHeight: 1.1, color: "#f1f5f9", margin: "0 0 20px 0",
              letterSpacing: "-0.02em",
            }}>
              AI Efficiency<br /><span style={{ color: "#3b82f6" }}>Diagnostic</span>
            </h1>

            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.8, marginBottom: 20, maxWidth: 520 }}>
              Most organisations are using 10–25% of their AI capability. The gap is not about access to tools — it is about how people use them.
            </p>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.8, marginBottom: 36, maxWidth: 520 }}>
              12 questions. Under 5 minutes. Instant personalised results showing exactly where your team is losing efficiency and what to fix first.
            </p>

            <div style={{ marginBottom: 32 }}>
              <label style={{
                display: "block", fontSize: 11, color: "#475569",
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8,
              }}>
                Your first name (optional)
              </label>
              <input
                className="input-field"
                style={{ maxWidth: 320 }}
                placeholder="e.g. Sarah"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && setPhase("survey")}
              />
            </div>

            <button className="ghost-btn" onClick={() => setPhase("survey")}>
              Start Diagnostic →
            </button>

            <p style={{ fontSize: 11, color: "#334155", marginTop: 20, letterSpacing: "0.05em" }}>
              12 questions · No login required · Results shown instantly
            </p>
          </div>
        )}

        {/* ── SURVEY ── */}
        {phase === "survey" && (
          <div
            className={animating ? "" : "fade-in"}
            style={{ opacity: animating ? 0 : 1, transition: "opacity 0.25s" }}
          >
            {/* Progress bar */}
            <div style={{ marginBottom: 40 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 11, color: "#475569",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  {questions[current].category}
                </span>
                <span style={{ fontSize: 11, color: "#334155", fontFamily: "'DM Mono', monospace" }}>
                  {current + 1} / {totalQuestions}
                </span>
              </div>
              <div style={{ height: 2, background: "#1e1e2e", borderRadius: 2 }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "linear-gradient(to right, #1d4ed8, #3b82f6)",
                  borderRadius: 2, transition: "width 0.3s ease",
                }} />
              </div>
            </div>

            {/* Question */}
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 700,
              color: "#f1f5f9", margin: "0 0 32px 0",
              lineHeight: 1.4, letterSpacing: "-0.01em",
            }}>
              {categoryIcons[questions[current].category]}{" "}
              {questions[current].question}
            </h2>

            {/* Options */}
            <div style={{ marginBottom: 32 }}>
              {questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-btn${selected === opt.score ? " selected" : ""}`}
                  onClick={() => setSelected(opt.score)}
                >
                  <span style={{
                    display: "inline-block", width: 18, height: 18,
                    borderRadius: "50%",
                    border: `1px solid ${selected === opt.score ? "#3b82f6" : "#2d2d40"}`,
                    background: selected === opt.score ? "#3b82f6" : "transparent",
                    marginRight: 12, verticalAlign: "middle", flexShrink: 0,
                  }} />
                  {opt.text}
                </button>
              ))}
            </div>

            <button className="next-btn" onClick={handleNext} disabled={selected === null}>
              {current + 1 < totalQuestions ? "Next →" : "View Results →"}
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === "results" && (
          <div className="fade-in">
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800,
              color: "#f1f5f9", margin: "0 0 6px 0", letterSpacing: "-0.02em",
            }}>
              Your AI Efficiency Report
            </h1>
            {name && (
              <p style={{ color: "#475569", fontSize: 13, marginBottom: 28, fontFamily: "'DM Mono', monospace" }}>
                {name}
              </p>
            )}

            {/* Score ring */}
            <div style={{
              background: "#13131a", border: "1px solid #1e1e2e", borderRadius: 8,
              padding: "28px 24px", marginBottom: 40,
              display: "flex", alignItems: "center", gap: 28,
            }}>
              <div className="score-ring" style={{ borderColor: overallLevel.color }}>
                <span style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800,
                  color: overallLevel.color, lineHeight: 1,
                }}>
                  {totalScore}
                </span>
                <span style={{ fontSize: 10, color: "#475569", letterSpacing: "0.05em" }}>
                  / {maxScore}
                </span>
              </div>
              <div>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700,
                  color: overallLevel.color, marginBottom: 6,
                }}>
                  {overallLevel.label}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 380 }}>
                  {overallLevel.label === "Advanced"    && "Strong across the board. The specific gaps below are worth addressing to reach full capability."}
                  {overallLevel.label === "Proficient"  && "Good foundations. Targeted development in your weaker areas will deliver meaningful efficiency gains."}
                  {overallLevel.label === "Developing"  && "You are using AI but not yet getting the most from it. The priorities below will significantly improve output quality and reduce wasted effort."}
                  {overallLevel.label === "Foundational"&& "Significant efficiency gains are available. The recommendations below represent the fastest path to working more effectively with AI."}
                </div>
              </div>
            </div>

            {/* Priority training areas */}
            {weakAreas.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", color: "#ef4444",
                  textTransform: "uppercase", marginBottom: 16,
                }}>
                  Priority Training Areas
                </div>
                {weakAreas.map(q => {
                  const rec   = recommendations[q.id];
                  const score = answers[q.id] || 0;
                  return (
                    <div key={q.id} className="rec-card">
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 8,
                      }}>
                        <span style={{
                          fontFamily: "'Syne', sans-serif", fontWeight: 700,
                          fontSize: 14, color: "#f1f5f9",
                        }}>
                          {categoryIcons[q.category]} {rec.title}
                        </span>
                        <span style={{
                          fontSize: 11,
                          color: score === 1 ? "#ef4444" : "#f59e0b",
                          fontFamily: "'DM Mono', monospace",
                          background: score === 1 ? "#1c0505" : "#1c1008",
                          padding: "3px 8px", borderRadius: 4,
                        }}>
                          {score === 1 ? "High Priority" : "Priority"}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
                        {rec.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Strengths */}
            {strongAreas.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.15em", color: "#22c55e",
                  textTransform: "uppercase", marginBottom: 12,
                }}>
                  Strengths
                </div>
                <div>
                  {strongAreas.map(area => (
                    <span key={area} className="strong-tag">
                      {categoryIcons[area]} {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{
              background: "#0d1117", border: "1px solid #1e3a5f",
              borderRadius: 8, padding: "28px 24px", marginBottom: 32,
            }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 16,
                fontWeight: 700, color: "#f1f5f9", marginBottom: 10,
              }}>
                Want to close these gaps?
              </div>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>
                I deliver AI training to corporate teams in formats that work for you — from focused bespoke sessions through to half-day team programmes. Every session is practical, hands-on, and built around your actual tools and workflows. Get in touch to discuss what would work best for your team.
              </p>
              <a
                href="mailto:guy@guyweaver.com?subject=AI Training Enquiry"
                style={{
                  display: "inline-block", color: "#3b82f6",
                  fontSize: 13, fontFamily: "'DM Mono', monospace",
                  textDecoration: "none", borderBottom: "1px solid #1e3a5f",
                  paddingBottom: 2,
                }}
              >
                guy@guyweaver.com →
              </a>
            </div>

            <button className="ghost-btn" onClick={reset}>
              ↺ Retake Survey
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
