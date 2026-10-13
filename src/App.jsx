import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Code2, CalendarDays, Brain, BarChart3, Bell, Search,
  Flame, Target, CheckCircle2, Clock3, ChevronRight, Menu, X, Plus,
  Trash2, ExternalLink, Circle, Trophy, ListTodo, BookOpen, Sparkles,
  ArrowUpRight, Filter, Check, RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { initialQuestions, initialTasks, quizQuestions } from "./data.js";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "DSA Tracker", icon: Code2 },
  { label: "Study Planner", icon: CalendarDays },
  { label: "Mock Tests", icon: Brain },
  { label: "Analytics", icon: BarChart3 },
];

const WEEK = [
  { day: "Mon", hours: 2 }, { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1 }, { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2 }, { day: "Sat", hours: 5 },
  { day: "Sun", hours: 3 },
];

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useStoredState("preptrack-questions", initialQuestions);
  const [tasks, setTasks] = useStoredState("preptrack-tasks", initialTasks);
  const [scores, setScores] = useStoredState("preptrack-scores", []);
  const [toast, setToast] = useState("");

  const solved = questions.filter((q) => q.status === "Solved").length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const topicProgress = useMemo(() => {
    const topics = [...new Set(questions.map((q) => q.topic))];
    return topics.map((topic) => {
      const list = questions.filter((q) => q.topic === topic);
      return {
        name: topic,
        solved: list.filter((q) => q.status === "Solved").length,
        total: list.length,
      };
    });
  }, [questions]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function navigate(page) {
    setActivePage(page);
    setMenuOpen(false);
  }

  const filteredQuestions = questions.filter((q) =>
    `${q.title} ${q.topic} ${q.difficulty} ${q.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Code2 size={22} /></div>
          <span>PrepTrack</span>
          <button className="icon-button close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>
        <p className="nav-heading">WORKSPACE</p>
        <nav className="navigation">
          {NAV.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activePage === label ? "active" : ""}`} onClick={() => navigate(label)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="goal-box">
            <Sparkles size={21} />
            <strong>Progress over perfection</strong>
            <p>Small steps every day lead to big results. Keep showing up.</p>
          </div>
          <div className="profile">
            <div className="avatar">P</div>
            <div><strong>PrepTrack Student</strong><p>Placement journey</p></div>
          </div>
        </div>
      </aside>

      {menuOpen && <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="search-box">
            <Search size={17} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." aria-label="Search questions" />
            {search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={14} /></button>}
          </div>
          <button className="icon-button notification" onClick={() => notify("You're all caught up!")} aria-label="Notifications"><Bell size={19} /><span className="notification-dot" /></button>
        </header>

        <section className="page-content">
          {activePage === "Dashboard" && <Dashboard questions={questions} tasks={tasks} solved={solved} completedTasks={completedTasks} topicProgress={topicProgress} onNavigate={navigate} />}
          {activePage === "DSA Tracker" && <DSATracker questions={filteredQuestions} allQuestions={questions} setQuestions={setQuestions} search={search} notify={notify} />}
          {activePage === "Study Planner" && <StudyPlanner tasks={tasks} setTasks={setTasks} notify={notify} />}
          {activePage === "Mock Tests" && <MockTests scores={scores} setScores={setScores} notify={notify} />}
          {activePage === "Analytics" && <Analytics questions={questions} tasks={tasks} scores={scores} topicProgress={topicProgress} />}
          <footer className="footer">PrepTrack · Plan your preparation. Track your progress.</footer>
        </section>
      </main>
      {toast && <div className="toast" role="status"><Check size={17} />{toast}</div>}
    </div>
  );
}

function PageHeading({ eyebrow = "YOUR PLACEMENT WORKSPACE", title, subtitle, action }) {
  return (
    <div className="welcome-row">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ label, value, note, icon: Icon, color }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><div className={`stat-icon ${color}`}><Icon size={19} /></div></div>
      <h2>{value}</h2><p>{note}</p>
    </article>
  );
}

function PanelHeading({ title, subtitle, action }) {
  return <div className="panel-heading"><div><h3>{title}</h3><p>{subtitle}</p></div>{action}</div>;
}

function Dashboard({ questions, tasks, solved, completedTasks, topicProgress, onNavigate }) {
  const todayTasks = tasks.filter((task) => task.due === new Date().toISOString().slice(0, 10));
  const totalHours = WEEK.reduce((sum, item) => sum + item.hours, 0);
  return (
    <>
      <PageHeading title="Welcome back! 👋" subtitle="Let's make today count. One problem at a time." action={<div className="date-label"><CalendarDays size={16} /> Your weekly overview</div>} />
      <div className="stats-grid">
        <StatCard label="Problems solved" value={solved} note={`${questions.length} questions in your tracker`} icon={Code2} color="blue" />
        <StatCard label="Study streak" value="7 days" note="Demo value — customize it later" icon={Flame} color="orange" />
        <StatCard label="Study hours" value={`${totalHours}h`} note="Sample weekly activity" icon={Clock3} color="purple" />
        <StatCard label="Today's goals" value={`${todayTasks.filter(t => t.done).length}/${todayTasks.length}`} note="Tasks completed today" icon={Target} color="green" />
      </div>
      <div className="content-grid">
        <article className="panel">
          <PanelHeading title="Weekly study activity" subtitle="Sample study hours by day" action={<span className="pill">This week</span>} />
          <div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={WEEK} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f6" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8994a8", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8994a8", fontSize: 10 }} /><Tooltip cursor={{ fill: "#f5f7fc" }} /><Bar dataKey="hours" name="Study hours" fill="#4169ed" radius={[5, 5, 0, 0]} maxBarSize={34} /></BarChart></ResponsiveContainer></div>
          <div className="chart-footer"><span><span className="legend-dot" /> Study hours</span><strong>{totalHours} hours total</strong></div>
        </article>
        <article className="panel">
          <PanelHeading title="Today's goals" subtitle="Build your daily consistency" action={<Target size={20} className="muted-icon" />} />
          <div className="goal-progress"><div><strong>{completedTasks} of {tasks.length} tasks complete</strong><span>{tasks.length ? Math.round(completedTasks / tasks.length * 100) : 0}%</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? completedTasks / tasks.length * 100 : 0}%` }} /></div></div>
          <div className="goal-list">
            {tasks.slice(0, 3).map((task) => <div className={`goal-item ${task.done ? "completed" : ""}`} key={task.id}>{task.done ? <CheckCircle2 size={19} /> : <Circle size={19} />}<span>{task.title}</span></div>)}
            {tasks.length === 0 && <p className="empty-state">Add your first goal in Study Planner.</p>}
          </div>
          <button className="text-link" onClick={() => onNavigate("Study Planner")}>Open study planner <ChevronRight size={16} /></button>
        </article>
      </div>
      <article className="panel topics-panel">
        <PanelHeading title="DSA preparation" subtitle="Your solved questions by topic" action={<button className="text-link" onClick={() => onNavigate("DSA Tracker")}>Manage questions <ChevronRight size={16} /></button>} />
        <TopicRows topics={topicProgress} />
      </article>
    </>
  );
}

function TopicRows({ topics }) {
  return <div className="topics-list">{topics.map((topic) => {
    const percent = topic.total ? Math.round(topic.solved / topic.total * 100) : 0;
    return <div className="topic-row" key={topic.name}><div className="topic-info"><strong>{topic.name}</strong><span>{topic.solved} of {topic.total} solved</span></div><div className="topic-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div></div><strong className="topic-percent">{percent}%</strong></div>;
  })}</div>;
}

function DSATracker({ questions, allQuestions, setQuestions, search, notify }) {
  const [topicFilter, setTopicFilter] = useState("All topics");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", topic: "Arrays", difficulty: "Easy", link: "" });
  const visible = questions.filter(q => (topicFilter === "All topics" || q.topic === topicFilter) && (statusFilter === "All statuses" || q.status === statusFilter));
  const topics = ["All topics", ...new Set(allQuestions.map(q => q.topic))];
  function updateStatus(id, status) {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    notify("Question status updated");
  }
  function addQuestion(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setQuestions(prev => [{ ...form, title: form.title.trim(), id: Date.now(), status: "Not Started", link: form.link.trim() }, ...prev]);
    setForm({ title: "", topic: "Arrays", difficulty: "Easy", link: "" });
    setShowForm(false);
    notify("Question added");
  }
  return <>
    <PageHeading title="DSA Tracker" subtitle="Organize coding practice and keep track of your progress." action={<button className="primary-button" onClick={() => setShowForm(v => !v)}><Plus size={17} /> Add question</button>} />
    {showForm && <form className="panel add-form" onSubmit={addQuestion}><h3>Add a DSA question</h3><div className="form-grid"><label>Question title<input required value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="e.g. Best Time to Buy and Sell Stock" /></label><label>Topic<select value={form.topic} onChange={e => setForm({...form, topic:e.target.value})}>{["Arrays","Strings","Linked Lists","Trees","Graphs","Greedy","Dynamic Programming","SQL","Other"].map(t=><option key={t}>{t}</option>)}</select></label><label>Difficulty<select value={form.difficulty} onChange={e => setForm({...form, difficulty:e.target.value})}>{["Easy","Medium","Hard"].map(t=><option key={t}>{t}</option>)}</select></label><label>Problem URL (optional)<input type="url" value={form.link} onChange={e => setForm({...form, link:e.target.value})} placeholder="https://..." /></label></div><button className="primary-button" type="submit">Save question</button></form>}
    <div className="stats-grid compact-stats"><StatCard label="Total questions" value={allQuestions.length} note="In your tracker" icon={BookOpen} color="blue" /><StatCard label="Solved" value={allQuestions.filter(q=>q.status==="Solved").length} note="Completed problems" icon={CheckCircle2} color="green" /><StatCard label="In progress" value={allQuestions.filter(q=>q.status==="In Progress").length} note="Currently practicing" icon={Clock3} color="purple" /><StatCard label="Remaining" value={allQuestions.filter(q=>q.status==="Not Started").length} note="Ready for your next session" icon={Target} color="orange" /></div>
    <article className="panel table-panel"><PanelHeading title="Your questions" subtitle="Search, filter and update problem status" action={<Filter size={18} className="muted-icon" />} /><div className="filter-row"><select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)} aria-label="Filter topic">{topics.map(t=><option key={t}>{t}</option>)}</select><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} aria-label="Filter status">{["All statuses","Solved","In Progress","Not Started"].map(s=><option key={s}>{s}</option>)}</select><span className="result-count">{visible.length} questions</span></div><div className="table-wrap"><table><thead><tr><th>Problem</th><th>Topic</th><th>Difficulty</th><th>Status</th><th>Link</th><th>Remove</th></tr></thead><tbody>{visible.map(q=><tr key={q.id}><td className="problem-title">{q.title}</td><td>{q.topic}</td><td><span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span></td><td><select className="status-select" value={q.status} onChange={e=>updateStatus(q.id,e.target.value)} aria-label={`Status for ${q.title}`}><option>Solved</option><option>In Progress</option><option>Not Started</option></select></td><td>{q.link ? <a className="external-link" href={q.link} target="_blank" rel="noreferrer" aria-label={`Open ${q.title}`}><ExternalLink size={15}/></a> : <span className="muted">—</span>}</td><td><button className="icon-button small-danger" onClick={()=>{setQuestions(prev=>prev.filter(item=>item.id!==q.id));notify("Question removed")}} aria-label={`Delete ${q.title}`}><Trash2 size={15}/></button></td></tr>)}</tbody></table>{visible.length===0&&<p className="empty-state">No questions match your filters.</p>}</div></article>
    <p className="small-note">Your tracker is saved in this browser on this device. It is not synced across devices or accounts yet.</p>
  </>;
}

function StudyPlanner({ tasks, setTasks, notify }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DSA");
  const [due, setDue] = useState(new Date().toISOString().slice(0,10));
  function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks(prev => [{ id: Date.now(), title: title.trim(), category, due, done: false }, ...prev]);
    setTitle("");
    notify("Study goal added");
  }
  const sortedTasks = [...tasks].sort((a,b)=>a.due.localeCompare(b.due));
  return <>
    <PageHeading title="Study Planner" subtitle="Turn your preparation plan into small, achievable tasks." />
    <div className="planner-grid">
      <form className="panel planner-form" onSubmit={addTask}><PanelHeading title="Create a study goal" subtitle="Choose what you want to accomplish." /><label>Goal name<input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="e.g. Revise binary trees" /></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{["DSA","Frontend","Backend","Database","Aptitude","Interview"].map(c=><option key={c}>{c}</option>)}</select></label><label>Due date<input type="date" value={due} onChange={e=>setDue(e.target.value)} required /></label><button className="primary-button" type="submit"><Plus size={17}/> Add goal</button></form>
      <article className="panel planner-list"><PanelHeading title="Your study goals" subtitle={`${tasks.filter(t=>t.done).length} of ${tasks.length} completed`} action={<ListTodo size={20} className="muted-icon"/>}/>{sortedTasks.length===0&&<p className="empty-state">No goals yet. Add one to get started.</p>}<div className="task-list">{sortedTasks.map(task=><div className={`task-card ${task.done?"task-done":""}`} key={task.id}><button className={`task-check ${task.done?"checked":""}`} onClick={()=>setTasks(prev=>prev.map(t=>t.id===task.id?{...t,done:!t.done}:t))} aria-label={task.done?"Mark incomplete":"Mark complete"}>{task.done&&<Check size={15}/>}</button><div className="task-details"><strong>{task.title}</strong><span>{task.category} · Due {task.due}</span></div><button className="icon-button small-danger" onClick={()=>{setTasks(prev=>prev.filter(t=>t.id!==task.id));notify("Goal removed")}} aria-label="Delete goal"><Trash2 size={15}/></button></div>)}</div></article>
    </div>
  </>;
}

function MockTests({ scores, setScores, notify }) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = quizQuestions.reduce((sum,q,i)=>sum+(answers[i]===q.answer?1:0),0);
  function submitQuiz() {
    const record = { id: Date.now(), date: new Date().toLocaleDateString(), score, total: quizQuestions.length };
    setScores(prev=>[record,...prev]);
    setSubmitted(true);
    notify("Quiz submitted");
  }
  function reset() { setStarted(false);setAnswers({});setSubmitted(false); }
  if (started && !submitted) return <><PageHeading title="Technical mini quiz" subtitle="Answer each question and submit to review your result." /><div className="quiz-wrap">{quizQuestions.map((q,i)=><article className="panel quiz-question" key={q.question}><p className="question-count">QUESTION {i+1} OF {quizQuestions.length}</p><h3>{q.question}</h3><div className="answer-options">{q.options.map((option,j)=><label className={`answer-option ${answers[i]===j?"selected":""}`} key={option}><input type="radio" name={`q-${i}`} checked={answers[i]===j} onChange={()=>setAnswers(prev=>({...prev,[i]:j}))}/><span>{String.fromCharCode(65+j)}.</span>{option}</label>)}</div></article>)}<button className="primary-button" onClick={submitQuiz}>Submit answers</button></div></>;
  if (submitted) return <><PageHeading title="Quiz results" subtitle="Review your score and the correct answers." /><article className="panel result-panel"><div className="result-icon"><Trophy size={30}/></div><p className="eyebrow">YOUR SCORE</p><h2>{score} / {quizQuestions.length}</h2><p className="subtitle">{Math.round(score/quizQuestions.length*100)}% correct</p><div className="review-list">{quizQuestions.map((q,i)=><div className="review-item" key={q.question}><strong>{i+1}. {q.question}</strong><p className={answers[i]===q.answer?"correct-text":"incorrect-text"}>{answers[i]===q.answer?"Correct":"Correct answer"}: {q.options[q.answer]}</p><span>{q.explanation}</span></div>)}</div><button className="primary-button" onClick={reset}><RotateCcw size={16}/> Try again</button></article></>;
  return <><PageHeading title="Mock Tests" subtitle="Check your technical fundamentals with a quick practice quiz." /><div className="quiz-intro-grid"><article className="panel quiz-hero"><div className="quiz-hero-icon"><Brain size={28}/></div><span className="pill">TECHNICAL BASICS</span><h2>React, DSA & SQL</h2><p>Practice a short set of multiple-choice questions and get instant feedback with explanations.</p><div className="quiz-meta"><span><Clock3 size={16}/> About 5 minutes</span><span><CheckCircle2 size={16}/> {quizQuestions.length} questions</span></div><button className="primary-button" onClick={()=>{setAnswers({});setSubmitted(false);setStarted(true)}}>Start mock test <ChevronRight size={17}/></button></article><article className="panel"><PanelHeading title="Previous attempts" subtitle="Your recent quiz scores"/>{scores.length===0?<p className="empty-state">Your results will appear here after your first attempt.</p>:<div className="score-list">{scores.map(s=><div className="score-row" key={s.id}><div><strong>{s.score}/{s.total} correct</strong><span>{s.date}</span></div><span className="score-percent">{Math.round(s.score/s.total*100)}%</span></div>)}</div>}</article></div></>;
}

function Analytics({ questions, tasks, scores, topicProgress }) {
  const solved = questions.filter(q=>q.status==="Solved").length;
  const done = tasks.filter(t=>t.done).length;
  const average = scores.length ? Math.round(scores.reduce((sum,s)=>sum+s.score/s.total*100,0)/scores.length) : 0;
  const data = topicProgress.map(t=>({topic:t.name.length>12?t.name.slice(0,11)+"…":t.name,solved:t.solved}));
  return <><PageHeading title="Analytics" subtitle="A snapshot of your preparation progress across the app." /><div className="stats-grid"><StatCard label="DSA problems solved" value={solved} note={`Out of ${questions.length} tracked`} icon={Code2} color="blue"/><StatCard label="Study goals done" value={done} note={`Out of ${tasks.length} tasks`} icon={CheckCircle2} color="green"/><StatCard label="Mock tests taken" value={scores.length} note="Practice attempts" icon={Brain} color="purple"/><StatCard label="Average quiz score" value={`${average}%`} note="Based on completed quizzes" icon={Trophy} color="orange"/></div><div className="content-grid"><article className="panel"><PanelHeading title="Solved questions by topic" subtitle="Compare progress across topics"/><div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{top:10,right:8,left:-22,bottom:0}}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f6"/><XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{fill:"#8994a8",fontSize:10}}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"#8994a8",fontSize:10}}/><Tooltip/><Bar dataKey="solved" name="Solved" fill="#4169ed" radius={[5,5,0,0]} maxBarSize={38}/></BarChart></ResponsiveContainer></div></article><article className="panel"><PanelHeading title="Preparation summary" subtitle="Keep your momentum going"/><div className="summary-list"><div><span>Questions not started</span><strong>{questions.filter(q=>q.status==="Not Started").length}</strong></div><div><span>Questions in progress</span><strong>{questions.filter(q=>q.status==="In Progress").length}</strong></div><div><span>Pending study goals</span><strong>{tasks.filter(t=>!t.done).length}</strong></div><div><span>Quiz attempts</span><strong>{scores.length}</strong></div></div><p className="small-note">Analytics are calculated from the data saved in this browser. Weekly study hours are sample data, not automatically measured time.</p></article></div></>;
}

export default App;
