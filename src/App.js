import { useState, useEffect } from "react";

const CATEGORIES = [
  { name: "Prayer & Bible", color: "#F0EEF8", text: "#3C3489", border: "#9B8FD9" },
  { name: "Gym & fitness", color: "#EAF3DE", text: "#27500A", border: "#639922" },
  { name: "Deep work", color: "#E6F1FB", text: "#0C447C", border: "#378ADD" },
  { name: "Office work", color: "#E1F5EE", text: "#085041", border: "#1D9E75" },
  { name: "Study (AI/PMP)", color: "#FAEEDA", text: "#633806", border: "#EF9F27" },
  { name: "Finance action", color: "#FAECE7", text: "#712B13", border: "#D85A30" },
  { name: "Family time", color: "#FBEAF0", text: "#72243E", border: "#D4537E" },
  { name: "Meals", color: "#F1EFE8", text: "#444441", border: "#888780" },
  { name: "Commute", color: "#E8E6E0", text: "#2C2C2A", border: "#B4B2A9" },
  { name: "Distraction", color: "#FCEBEB", text: "#791F1F", border: "#E24B4A" },
  { name: "Rest", color: "#EAF3DE", text: "#27500A", border: "#97C459" },
  { name: "Other", color: "#F1EFE8", text: "#444441", border: "#B4B2A9" },
];

const EXPENSE_CATEGORIES = ["Food & Groceries", "Transport", "Bills & Utilities", "Medicine", "Family", "Tithe", "Emergency", "Other"];
const INVEST_CATEGORIES = ["Skill (course/book)", "Health investment", "Tool/Equipment", "Savings", "Other"];
const MUSCLE_GROUPS = ["Push (Chest/Shoulders/Triceps)", "Pull (Back/Biceps)", "Legs", "Core", "Cardio", "Full body", "Yoga/Mobility", "Rest day"];
const STUDY_SUBJECTS = ["AI/ML", "PMP", "Both"];
const SPIRITUAL_TYPES = ["Bible reading", "Morning prayer", "Evening prayer", "Family prayer", "Reflection", "Fasting", "God spoke to me", "Other"];

const USER_CONTEXT = `You are a personal strategic advisor for this specific person:
IDENTITY: 33-year-old man, disciplined path to financial freedom, deeply Christian faith.
PRIORITY ORDER (absolute, never reorder):
1. Spiritual alignment — non-negotiable, chronologically fixed
2. Health — consistent gym, peak physical performance
3. Skill & income growth (PMP + AI/ML) + cash-flow stability (monthly deficit to eliminate)
RULES: Never use negative financial language. Say "liability elimination" not "debt". Frame as a disciplined, spiritually grounded, financially free person in the making. Be direct, warm, no fluff. Max 250 words per insight.`;

function TagButton({ label, selected, onClick, color, textColor, border }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 20,
        border: selected ? `1.5px solid ${border || "#534AB7"}` : "1px solid #ddd",
        background: selected ? color || "#EEEDFE" : "transparent",
        color: selected ? textColor || "#3C3489" : "#888",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "Georgia, serif",
        transition: "all 0.15s",
        fontWeight: selected ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

function AIInsight({ prompt, label = "Get AI insights" }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function run() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: USER_CONTEXT + "\n\n" + prompt }],
        }),
      });
      const data = await res.json();
      setResult(data.content.map((b) => b.text || "").join(""));
    } catch {
      setResult("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={run}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: loading ? "#888" : "#1a1a2e",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 14,
          fontFamily: "Georgia, serif",
          cursor: loading ? "not-allowed" : "pointer",
          letterSpacing: 0.3,
        }}
      >
        {loading ? "Analysing..." : `✦ ${label}`}
      </button>
      {result && (
        <div
          style={{
            marginTop: 12,
            background: "#1a1a2e",
            borderRadius: 12,
            padding: 16,
            color: "#e8e4f0",
            fontSize: 14,
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
            fontFamily: "Georgia, serif",
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

function DurationPicker({ hours, minutes, onHoursChange, onMinutesChange }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, color: "#999", fontFamily: "Georgia, serif" }}>HOURS</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => onHoursChange(Math.max(0, hours - 1))} style={spinBtn}>−</button>
          <span style={{ fontSize: 20, fontWeight: 700, minWidth: 28, textAlign: "center", fontFamily: "Georgia, serif" }}>{hours}</span>
          <button onClick={() => onHoursChange(Math.min(12, hours + 1))} style={spinBtn}>+</button>
        </div>
      </div>
      <span style={{ fontSize: 22, color: "#ccc", marginTop: 16 }}>:</span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, color: "#999", fontFamily: "Georgia, serif" }}>MINUTES</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => onMinutesChange(Math.max(0, minutes - 5))} style={spinBtn}>−</button>
          <span style={{ fontSize: 20, fontWeight: 700, minWidth: 28, textAlign: "center", fontFamily: "Georgia, serif" }}>{minutes}</span>
          <button onClick={() => onMinutesChange(Math.min(55, minutes + 5))} style={spinBtn}>+</button>
        </div>
      </div>
      <span style={{ fontSize: 13, color: "#999", marginTop: 16, fontFamily: "Georgia, serif" }}>
        = {hours > 0 ? `${hours}h ` : ""}{minutes > 0 ? `${minutes}m` : hours === 0 ? "0m" : ""}
      </span>
    </div>
  );
}

const spinBtn = {
  width: 28, height: 28, borderRadius: 8, border: "1px solid #ddd",
  background: "#f5f5f5", cursor: "pointer", fontSize: 16, fontWeight: 700,
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#333", padding: 0,
};

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #eee",
  padding: "16px",
  marginBottom: 12,
};

const sectionLabel = {
  fontSize: 11,
  color: "#999",
  fontFamily: "Georgia, serif",
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "Georgia, serif",
  color: "#222",
  background: "#fafafa",
  outline: "none",
  resize: "none",
};

const deleteBtn = {
  background: "none", border: "none", color: "#ccc",
  fontSize: 18, cursor: "pointer", padding: "0 4px", lineHeight: 1,
};

// ─── MODULE: Activity Log ───
function ActivityModule() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [startTime, setStartTime] = useState(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`;
  });

  function add() {
    if (!text.trim() || !category) return alert("Add description and category.");
    const totalMins = hours * 60 + minutes;
    setEntries([...entries, { id: Date.now(), text, category, totalMins, startTime }]);
    setText(""); setCategory(null); setHours(0); setMinutes(30);
  }

  const totalTracked = entries.reduce((s, e) => s + e.totalMins, 0);
  const grouped = {};
  entries.forEach((e) => { grouped[e.category] = (grouped[e.category] || 0) + e.totalMins; });

  const logSummary = entries.map(e => `${e.startTime} | ${e.category} | ${Math.floor(e.totalMins/60)}h ${e.totalMins%60}m | ${e.text}`).join("\n");

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 14, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif" }}>{entries.length}</div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Entries</div>
        </div>
        <div style={{ background: "#1a1a2e", borderRadius: 12, padding: 14, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "Georgia, serif" }}>
            {Math.floor(totalTracked / 60)}h {totalTracked % 60}m
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Tracked</div>
        </div>
      </div>

      <div style={card}>
        <span style={sectionLabel}>Start time</span>
        <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ ...inputStyle, width: "auto", marginBottom: 12 }} />
        <span style={sectionLabel}>What did you do?</span>
        <textarea rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="Describe the activity..." style={{ ...inputStyle, marginBottom: 12 }} />
        <span style={sectionLabel}>Category</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {CATEGORIES.map(c => (
            <TagButton key={c.name} label={c.name} selected={category === c.name} onClick={() => setCategory(c.name)} color={c.color} textColor={c.text} border={c.border} />
          ))}
        </div>
        <span style={sectionLabel}>Duration</span>
        <DurationPicker hours={hours} minutes={minutes} onHoursChange={setHours} onMinutesChange={setMinutes} />
        <button onClick={add} style={{ marginTop: 14, width: "100%", padding: 12, background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
          + Log activity
        </button>
      </div>

      {entries.length > 0 && (
        <>
          <div style={card}>
            <span style={sectionLabel}>Time breakdown</span>
            {Object.entries(grouped).sort((a,b)=>b[1]-a[1]).map(([cat, mins]) => {
              const c = CATEGORIES.find(x => x.name === cat);
              const pct = Math.round((mins / totalTracked) * 100);
              return (
                <div key={cat} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, color: "#333", fontFamily: "Georgia, serif" }}>{cat}</span>
                    <span style={{ fontSize: 13, color: "#888" }}>{Math.floor(mins/60)}h {mins%60}m</span>
                  </div>
                  <div style={{ height: 6, background: "#f0f0f0", borderRadius: 4 }}>
                    <div style={{ height: 6, width: `${pct}%`, background: c?.border || "#534AB7", borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginBottom: 12 }}>
            {[...entries].reverse().map(e => {
              const c = CATEGORIES.find(x => x.name === e.category);
              return (
                <div key={e.id} style={card}>
                  <button style={deleteBtn} onClick={() => setEntries(entries.filter(x => x.id !== e.id))}>×</button>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: c?.color || "#eee", color: c?.text || "#333", fontFamily: "Georgia, serif" }}>{e.category}</span>
                  <div style={{ fontSize: 14, color: "#222", marginTop: 6, fontFamily: "Georgia, serif" }}>{e.text}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{e.startTime} · {Math.floor(e.totalMins/60)}h {e.totalMins%60}m</div>
                </div>
              );
            })}
          </div>
          <AIInsight label="Review my day" prompt={`Review this person's day log and give structured insight:\n\nDAY LOG:\n${logSummary}\n\nTotal tracked: ${Math.floor(totalTracked/60)}h ${totalTracked%60}m\n\nProvide:\n1. IDENTITY STATEMENT (1 powerful affirming line)\n2. WHERE TIME WAS LOST (honest, specific)\n3. WHAT WENT WELL\n4. ALIGNMENT CHECK (vs his 3 priorities)\n5. 3 IMPROVEMENTS FOR TOMORROW\n6. CEO MANTRA FOR TOMORROW`} />
        </>
      )}
    </div>
  );
}

// ─── MODULE: Finance ───
function FinanceModule() {
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [expDesc, setExpDesc] = useState(""); const [expAmt, setExpAmt] = useState(""); const [expCat, setExpCat] = useState(null);
  const [invDesc, setInvDesc] = useState(""); const [invAmt, setInvAmt] = useState(""); const [invCat, setInvCat] = useState(null);
  const [tab, setTab] = useState("expense");

  const totalExp = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const totalInv = investments.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

  function addExpense() {
    if (!expDesc.trim() || !expAmt || !expCat) return alert("Fill all fields.");
    setExpenses([...expenses, { id: Date.now(), desc: expDesc, amount: expAmt, category: expCat }]);
    setExpDesc(""); setExpAmt(""); setExpCat(null);
  }
  function addInvestment() {
    if (!invDesc.trim() || !invAmt || !invCat) return alert("Fill all fields.");
    setInvestments([...investments, { id: Date.now(), desc: invDesc, amount: invAmt, category: invCat }]);
    setInvDesc(""); setInvAmt(""); setInvCat(null);
  }

  const finSummary = `EXPENSES (₹${totalExp.toFixed(0)} total):\n${expenses.map(e=>`- ${e.category}: ${e.desc} ₹${e.amount}`).join("\n") || "None"}\n\nINVESTMENTS (₹${totalInv.toFixed(0)} total):\n${investments.map(e=>`- ${e.category}: ${e.desc} ₹${e.amount}`).join("\n") || "None"}`;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        <div style={{ background: "#7F0000", borderRadius: 12, padding: 14, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>₹{totalExp.toFixed(0)}</div>
          <div style={{ fontSize: 12, color: "#ffaaaa", marginTop: 2 }}>Spent today</div>
        </div>
        <div style={{ background: "#0F6E56", borderRadius: 12, padding: 14, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif" }}>₹{totalInv.toFixed(0)}</div>
          <div style={{ fontSize: 12, color: "#aaffd4", marginTop: 2 }}>Invested today</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["expense", "investment"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: tab === t ? "1.5px solid #1a1a2e" : "1px solid #eee", background: tab === t ? "#1a1a2e" : "#fafafa", color: tab === t ? "#fff" : "#888", fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer", fontWeight: tab === t ? 600 : 400 }}>
            {t === "expense" ? "Expense" : "Investment"}
          </button>
        ))}
      </div>

      {tab === "expense" && (
        <div style={card}>
          <span style={sectionLabel}>Category</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {EXPENSE_CATEGORIES.map(c => <TagButton key={c} label={c} selected={expCat === c} onClick={() => setExpCat(c)} />)}
          </div>
          <span style={sectionLabel}>Description</span>
          <input value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="e.g. D'Mart groceries" style={{ ...inputStyle, marginBottom: 10 }} />
          <span style={sectionLabel}>Amount (₹)</span>
          <input type="number" value={expAmt} onChange={e => setExpAmt(e.target.value)} placeholder="0" style={{ ...inputStyle, width: 140, marginBottom: 12 }} />
          <button onClick={addExpense} style={{ width: "100%", padding: 12, background: "#7F0000", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            + Add expense
          </button>
          <div style={{ marginTop: 12 }}>
            {expenses.map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <div>
                  <span style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#222" }}>{e.desc}</span>
                  <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{e.category}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#7F0000", fontFamily: "Georgia, serif" }}>₹{e.amount}</span>
                  <button style={deleteBtn} onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "investment" && (
        <div style={card}>
          <span style={sectionLabel}>Category</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {INVEST_CATEGORIES.map(c => <TagButton key={c} label={c} selected={invCat === c} onClick={() => setInvCat(c)} color="#EAF3DE" textColor="#27500A" border="#639922" />)}
          </div>
          <span style={sectionLabel}>Description</span>
          <input value={invDesc} onChange={e => setInvDesc(e.target.value)} placeholder="e.g. PMP study material" style={{ ...inputStyle, marginBottom: 10 }} />
          <span style={sectionLabel}>Amount (₹)</span>
          <input type="number" value={invAmt} onChange={e => setInvAmt(e.target.value)} placeholder="0" style={{ ...inputStyle, width: 140, marginBottom: 12 }} />
          <button onClick={addInvestment} style={{ width: "100%", padding: 12, background: "#0F6E56", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
            + Add investment
          </button>
          <div style={{ marginTop: 12 }}>
            {investments.map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <div>
                  <span style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#222" }}>{e.desc}</span>
                  <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{e.category}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0F6E56", fontFamily: "Georgia, serif" }}>₹{e.amount}</span>
                  <button style={deleteBtn} onClick={() => setInvestments(investments.filter(x => x.id !== e.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(expenses.length > 0 || investments.length > 0) && (
        <AIInsight label="Get financial insights & tips" prompt={`Analyse this person's financial activity for today and give insights:\n\n${finSummary}\n\nProvide:\n1. SPENDING PATTERN (what does today's spending reveal?)\n2. ALIGNMENT CHECK (does today's spending align with eliminating the deficit?)\n3. ONE THING TO CUT OR OPTIMIZE\n4. FINANCIAL TIP FOR TOMORROW\n5. MOTIVATIONAL FRAMING (cash-flow freedom focus)`} />
      )}
    </div>
  );
}

// ─── MODULE: Gym ───
function GymModule() {
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exName, setExName] = useState(""); const [sets, setSets] = useState(""); const [reps, setReps] = useState(""); const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [hours, setHours] = useState(0); const [minutes, setMinutes] = useState(45);

  function addEx() {
    if (!exName.trim()) return;
    setExercises([...exercises, { id: Date.now(), name: exName, sets, reps, weight }]);
    setExName(""); setSets(""); setReps(""); setWeight("");
  }

  const gymSummary = `Muscle group: ${muscleGroup || "Not set"}\nEnergy: ${energy || "Not set"}\nDuration: ${hours}h ${minutes}m\nExercises:\n${exercises.map(e=>`- ${e.name}: ${e.sets} sets × ${e.reps} reps @ ${e.weight}kg`).join("\n") || "None logged"}\nNotes: ${notes || "None"}`;

  return (
    <div>
      <div style={card}>
        <span style={sectionLabel}>Today's target</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {MUSCLE_GROUPS.map(g => <TagButton key={g} label={g} selected={muscleGroup === g} onClick={() => setMuscleGroup(g)} color="#EAF3DE" textColor="#27500A" border="#639922" />)}
        </div>
        <span style={sectionLabel}>Energy level</span>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["High", "Medium", "Low"].map(e => (
            <button key={e} onClick={() => setEnergy(e)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: energy === e ? "1.5px solid #639922" : "1px solid #eee", background: energy === e ? "#EAF3DE" : "#fafafa", color: energy === e ? "#27500A" : "#888", fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer", fontWeight: energy === e ? 600 : 400 }}>
              {e}
            </button>
          ))}
        </div>
        <span style={sectionLabel}>Session duration</span>
        <DurationPicker hours={hours} minutes={minutes} onHoursChange={setHours} onMinutesChange={setMinutes} />
      </div>

      <div style={card}>
        <span style={sectionLabel}>Log an exercise</span>
        <input value={exName} onChange={e => setExName(e.target.value)} placeholder="Exercise name (e.g. Bench press)" style={{ ...inputStyle, marginBottom: 8 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={sets} onChange={e => setSets(e.target.value)} placeholder="Sets" style={{ ...inputStyle, flex: 1 }} />
          <input value={reps} onChange={e => setReps(e.target.value)} placeholder="Reps" style={{ ...inputStyle, flex: 1 }} />
          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="kg" style={{ ...inputStyle, flex: 1 }} />
        </div>
        <button onClick={addEx} style={{ width: "100%", padding: 11, background: "#27500A", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontFamily: "Georgia, serif", cursor: "pointer" }}>
          + Add exercise
        </button>
        {exercises.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {exercises.map(e => (
              <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid #f0f0f0" }}>
                <span style={{ fontSize: 13, fontFamily: "Georgia, serif", color: "#222" }}>{e.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#639922", fontFamily: "Georgia, serif" }}>{e.sets}×{e.reps} @ {e.weight}kg</span>
                  <button style={deleteBtn} onClick={() => setExercises(exercises.filter(x => x.id !== e.id))}>×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={card}>
        <span style={sectionLabel}>Session notes / how you felt</span>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Energy, injuries, pump, mood..." style={inputStyle} />
      </div>

      {(muscleGroup || exercises.length > 0) && (
        <AIInsight label="Get gym insights" prompt={`Analyse this person's gym session and give coaching insights:\n\n${gymSummary}\n\nProvide:\n1. SESSION ASSESSMENT (was this aligned with his energy level and goal of peak health?)\n2. FORM / TECHNIQUE TIP for the main muscle group trained\n3. RECOVERY RECOMMENDATION for tonight\n4. PROGRESSION TARGET for next session (specific numbers)\n5. MOTIVATIONAL COACHING LINE`} />
      )}
    </div>
  );
}

// ─── MODULE: Skilling ───
function SkillingModule() {
  const [subject, setSubject] = useState(null);
  const [topic, setTopic] = useState("");
  const [learned, setLearned] = useState("");
  const [struggle, setStruggle] = useState("");
  const [hours, setHours] = useState(0); const [minutes, setMinutes] = useState(50);
  const [progress, setProgress] = useState("");
  const [energy, setEnergy] = useState(null);

  const skillSummary = `Subject: ${subject || "Not set"}\nEnergy: ${energy || "Not set"}\nDuration: ${hours}h ${minutes}m\nTopic studied: ${topic || "Not specified"}\nWhat I learned: ${learned || "Not filled"}\nWhat I struggled with: ${struggle || "None"}\nCourse progress: ${progress || "Not noted"}`;

  return (
    <div>
      <div style={card}>
        <span style={sectionLabel}>Today's subject</span>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {STUDY_SUBJECTS.map(s => <TagButton key={s} label={s} selected={subject === s} onClick={() => setSubject(s)} color="#FAEEDA" textColor="#633806" border="#EF9F27" />)}
        </div>
        <span style={sectionLabel}>Energy level</span>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["High", "Medium", "Low"].map(e => (
            <button key={e} onClick={() => setEnergy(e)} style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: energy === e ? "1.5px solid #EF9F27" : "1px solid #eee", background: energy === e ? "#FAEEDA" : "#fafafa", color: energy === e ? "#633806" : "#888", fontFamily: "Georgia, serif", fontSize: 13, cursor: "pointer", fontWeight: energy === e ? 600 : 400 }}>
              {e}
            </button>
          ))}
        </div>
        <span style={sectionLabel}>Study duration</span>
        <DurationPicker hours={hours} minutes={minutes} onHoursChange={setHours} onMinutesChange={setMinutes} />
      </div>

      <div style={card}>
        <span style={sectionLabel}>Topic / chapter studied</span>
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. PMP: Risk Management / AI: Neural Networks" style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>What I learned today</span>
        <textarea rows={3} value={learned} onChange={e => setLearned(e.target.value)} placeholder="Key concepts, insights, breakthroughs..." style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>What I struggled with</span>
        <textarea rows={2} value={struggle} onChange={e => setStruggle(e.target.value)} placeholder="Any confusion or difficulty..." style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>Overall course progress</span>
        <input value={progress} onChange={e => setProgress(e.target.value)} placeholder="e.g. 40% done, Chapter 6 of 12, 3 mock tests done" style={inputStyle} />
      </div>

      {(subject || learned) && (
        <AIInsight label="Get learning insights" prompt={`Analyse this person's study session and give coaching insights:\n\n${skillSummary}\n\nProvide:\n1. LEARNING ASSESSMENT (quality of today's study aligned with his goals?)\n2. CONCEPT CLARITY TIP (help clarify one thing they struggled with if mentioned)\n3. NEXT SESSION FOCUS (what to prioritise next, based on PMP/AI progress)\n4. ROI FRAMING (connect this skill to his financial freedom goal)\n5. STUDY STRATEGY TIP for his energy pattern`} />
      )}
    </div>
  );
}

// ─── MODULE: Spiritual ───
function SpiritualModule() {
  const [types, setTypes] = useState([]);
  const [verse, setVerse] = useState("");
  const [reflection, setReflection] = useState("");
  const [godSpoke, setGodSpoke] = useState("");
  const [iSpoke, setISpoke] = useState("");
  const [hours, setHours] = useState(0); const [minutes, setMinutes] = useState(30);
  const [mood, setMood] = useState(null);

  function toggleType(t) {
    setTypes(types.includes(t) ? types.filter(x => x !== t) : [...types, t]);
  }

  const spiritSummary = `Prayer/devotion types: ${types.join(", ") || "Not set"}\nDuration: ${hours}h ${minutes}m\nMood/state: ${mood || "Not noted"}\nVerse/passage: ${verse || "None"}\nWhat God spoke to me: ${godSpoke || "None"}\nWhat I spoke to God: ${iSpoke || "None"}\nReflection: ${reflection || "None"}`;

  return (
    <div>
      <div style={card}>
        <span style={sectionLabel}>Spiritual activities today</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {SPIRITUAL_TYPES.map(t => <TagButton key={t} label={t} selected={types.includes(t)} onClick={() => toggleType(t)} color="#F0EEF8" textColor="#3C3489" border="#9B8FD9" />)}
        </div>
        <span style={sectionLabel}>Heart condition / spiritual mood</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {["Peaceful", "Grateful", "Struggling", "Dry", "On fire", "Seeking"].map(m => (
            <TagButton key={m} label={m} selected={mood === m} onClick={() => setMood(m)} color="#F0EEF8" textColor="#3C3489" border="#9B8FD9" />
          ))}
        </div>
        <span style={sectionLabel}>Time spent</span>
        <DurationPicker hours={hours} minutes={minutes} onHoursChange={setHours} onMinutesChange={setMinutes} />
      </div>

      <div style={card}>
        <span style={sectionLabel}>Verse / passage studied</span>
        <input value={verse} onChange={e => setVerse(e.target.value)} placeholder="e.g. Proverbs 13:11 — wealth from work grows..." style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>What God spoke to me today</span>
        <textarea rows={3} value={godSpoke} onChange={e => setGodSpoke(e.target.value)} placeholder="Impressions, convictions, peace, words during prayer..." style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>What I spoke to God (prayer focus)</span>
        <textarea rows={3} value={iSpoke} onChange={e => setISpoke(e.target.value)} placeholder="Petitions, gratitude, intercession, confession..." style={{ ...inputStyle, marginBottom: 10 }} />
        <span style={sectionLabel}>Personal reflection</span>
        <textarea rows={3} value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Any deeper insight, growth, or challenge from today's devotion..." style={inputStyle} />
      </div>

      {(types.length > 0 || godSpoke || reflection) && (
        <AIInsight label="Get spiritual insights" prompt={`Reflect on this person's spiritual life today and give a gentle, Christ-centred insight:\n\n${spiritSummary}\n\nThis person is a committed Christian. Provide:\n1. SPIRITUAL AFFIRMATION (affirm what God is doing in their life)\n2. VERSE REFLECTION (if a verse was noted, briefly illuminate it; if not, offer a fitting verse for their mood)\n3. PRAYER FOCUS FOR TOMORROW (based on what they prayed about or what God spoke)\n4. SPIRITUAL GROWTH NUDGE (one gentle encouragement for deeper walk)\n5. PEACE DECLARATION (one line of faith and confidence for tomorrow)\n\nTone: warm, pastoral, wise. Not preachy. Like a trusted spiritual mentor.`} />
      )}
    </div>
  );
}

// ─── MAIN APP ───
const TABS = [
  { id: "activity", label: "Activity", icon: "◎" },
  { id: "finance", label: "Finance", icon: "₹" },
  { id: "gym", label: "Gym", icon: "◈" },
  { id: "skilling", label: "Skills", icon: "◐" },
  { id: "spiritual", label: "Spirit", icon: "✦" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("activity");
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: 480, margin: "0 auto", paddingBottom: 100 }}>
      <div style={{ background: "#1a1a2e", padding: "20px 16px 16px", borderRadius: "0 0 20px 20px", marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: "#8888aa", letterSpacing: 2, marginBottom: 4 }}>DAILY COMMAND CENTER</p>
        <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}</p>
        <p style={{ fontSize: 13, color: "#8888aa" }}>{today}</p>
      </div>

      <div style={{ padding: "0 12px" }}>
        {activeTab === "activity" && <ActivityModule />}
        {activeTab === "finance" && <FinanceModule />}
        {activeTab === "gym" && <GymModule />}
        {activeTab === "skilling" && <SkillingModule />}
        {activeTab === "spiritual" && <SpiritualModule />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#fff", borderTop: "1px solid #eee", display: "flex", padding: "8px 4px 12px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 2px" }}>
            <span style={{ fontSize: 18, color: activeTab === t.id ? "#1a1a2e" : "#ccc" }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontFamily: "Georgia, serif", color: activeTab === t.id ? "#1a1a2e" : "#bbb", fontWeight: activeTab === t.id ? 600 : 400, letterSpacing: 0.5 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
