import { useState, useMemo } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from "recharts";
import HLP_LookFors from "../../assets/HLP_Lookfors";

const LINE_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#84cc16",
];

const GROUP_COLORS = {
  "Collaboration": "#3b82f6",
  "Data-Driven Planning": "#10b981",
  "Instruction in Behavior and Academics": "#8b5cf6",
  "Intensify and Intervene as Needed": "#f59e0b",
};

const getGroupColor = (hlpNumber) => {
  const hlp = HLP_LookFors[hlpNumber];
  if (!hlp) return "#6b7280";
  return GROUP_COLORS[hlp.group] || "#6b7280";
};

// Build unique student list from entries
const getStudents = (entries) => {
  const seen = new Set();
  const students = [];
  for (const e of entries) {
    const id = e.user_detail?.id ?? e.user_detail?.username;
    if (id && !seen.has(id)) {
      seen.add(id);
      students.push({
        id,
        name: `${e.user_detail.first_name} ${e.user_detail.last_name}`.trim(),
      });
    }
  }
  return students.sort((a, b) => a.name.localeCompare(b.name));
};

// Pie chart: count entries per HLP
const buildPieData = (entries) => {
  const counts = {};
  for (const e of entries) {
    counts[e.hlp] = (counts[e.hlp] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([hlp, value]) => ({
      name: `HLP ${hlp}`,
      hlp,
      value,
    }))
    .sort((a, b) => Number(a.hlp) - Number(b.hlp));
};

// Line chart: one data point per date, keyed by HLP number
// Also stores lookfor_number as `HLP X_lookfor` for tooltip use
const buildLineData = (entries) => {
  const byDate = {};
  for (const e of entries) {
    if (!e.date) continue;
    const score = Number(e.score);
    if (score < 0) continue; // skip "No Choice"
    if (!byDate[e.date]) byDate[e.date] = { date: e.date };
    byDate[e.date][`HLP ${e.hlp}`] = score;
    byDate[e.date][`HLP ${e.hlp}_lookfor`] = e.lookfor_number;
    byDate[e.date][`HLP ${e.hlp}_type`] = e.entry_type;
  }
  return Object.values(byDate).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs text-sm">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((item) => {
        const hlpNum = item.dataKey.replace("HLP ", "");
        const lookforNum = item.payload[`HLP ${hlpNum}_lookfor`];
        const entryType = item.payload[`HLP ${hlpNum}_type`];
        const isObservation = entryType === 'observation';
        const lookforText = !isObservation && lookforNum && HLP_LookFors[hlpNum]?.lookFors?.[lookforNum];
        return (
          <div key={item.dataKey} className="mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-medium" style={{ color: item.color }}>{item.dataKey}</span>
              <span className="text-gray-600">— Score: {item.value}</span>
            </div>
            {isObservation ? (
              <p className="mt-1 text-xs text-teal-600 pl-5 font-medium">Observation</p>
            ) : lookforText ? (
              <p className="mt-1 text-xs text-gray-500 pl-5">
                Look-for #{lookforNum}: {lookforText.length > 80 ? lookforText.substring(0, 80) + "…" : lookforText}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const getUniqueHLPs = (entries) => [...new Set(entries.map((e) => e.hlp))].sort((a, b) => Number(a) - Number(b));

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {value}
    </text>
  );
};

const ClassCharts = ({ entries }) => {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedHlp, setSelectedHlp] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [fullscreenChart, setFullscreenChart] = useState(null); // 'pie' | 'line' | null

  const students = useMemo(() => getStudents(entries), [entries]);
  const allHlps = useMemo(() => getUniqueHLPs(entries), [entries]);

  const selectedStudent = students.find((s) => String(s.id) === String(selectedStudentId));

  const visibleEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchStudent = !selectedStudentId || String(e.user_detail?.id ?? e.user_detail?.username) === String(selectedStudentId);
      const matchHlp = !selectedHlp || e.hlp === selectedHlp;
      return matchStudent && matchHlp;
    });
  }, [entries, selectedStudentId, selectedHlp]);

  const pieData = useMemo(() => buildPieData(visibleEntries), [visibleEntries]);
  const lineData = useMemo(() => buildLineData(visibleEntries), [visibleEntries]);
  const hlps = useMemo(() => getUniqueHLPs(visibleEntries), [visibleEntries]);

  if (entries.length === 0) return null;

  return (
    <div className="mb-6 bg-white rounded-xl shadow border border-gray-200">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h2 className="text-base font-bold text-gray-700">Class Analytics</h2>
        <span className="text-gray-400 text-sm">{collapsed ? "▼ Show" : "▲ Hide"}</span>
      </div>

      {!collapsed && (
        <div className="px-6 pb-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Student</label>
              <select
                className="p-2 rounded border border-gray-300 w-full sm:w-64 text-sm"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">All Students (class overview)</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by HLP</label>
              <select
                className="p-2 rounded border border-gray-300 w-full sm:w-64 text-sm"
                value={selectedHlp}
                onChange={(e) => setSelectedHlp(e.target.value)}
              >
                <option value="">All HLPs</option>
                {allHlps.map((hlp) => (
                  <option key={hlp} value={hlp}>
                    HLP {hlp}{HLP_LookFors[hlp]?.title ? `: ${HLP_LookFors[hlp].title.substring(0, 40)}…` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-600">
                  HLP Distribution{selectedStudent ? ` — ${selectedStudent.name}` : " — All Students"}
                </h3>
                {pieData.length > 0 && (
                  <button onClick={() => setFullscreenChart("pie")} className="text-gray-400 hover:text-gray-700 transition" title="Fullscreen">
                    <FaExpand />
                  </button>
                )}
              </div>
              {pieData.length === 0 ? (
                <p className="text-sm text-gray-400">No data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" labelLine={false} label={<CustomPieLabel />}>
                      {pieData.map((entry) => (
                        <Cell key={entry.hlp} fill={getGroupColor(entry.hlp)} />
                      ))}
                    </Pie>
                    <PieTooltip formatter={(value, name) => [`${value} reflection${value !== 1 ? "s" : ""}`, name]} />
                    <Legend formatter={(value, entry) => { const hlp = HLP_LookFors[entry.payload.hlp]; return `${value}${hlp ? `: ${hlp.title.substring(0, 30)}…` : ""}`; }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Line Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-600">
                  {selectedStudent ? `HLP Scores Over Time — ${selectedStudent.name}` : "HLP Scores Over Time — Select a student to view"}
                </h3>
                <button onClick={() => setFullscreenChart("line")} className="text-gray-400 hover:text-gray-700 transition" title="Fullscreen">
                  <FaExpand />
                </button>
              </div>
              {!selectedStudentId ? (
                <div className="flex items-center justify-center h-[260px] bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-sm text-gray-400 text-center px-4">Select a student from the dropdown to see their score progression over time.</p>
                </div>
              ) : lineData.length === 0 ? (
                <p className="text-sm text-gray-400">No scored entries to display.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={lineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend />
                    {hlps.map((hlp, i) => (
                      <Line key={hlp} type="monotone" dataKey={`HLP ${hlp}`} stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={2} dot={{ r: 4 }} connectNulls />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Fullscreen overlay */}
          {fullscreenChart && (
            <div className="fixed inset-0 bg-white z-50 flex flex-col p-6" onClick={() => setFullscreenChart(null)}>
              <div className="flex flex-col gap-3 mb-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-700">
                    {fullscreenChart === "pie"
                      ? `HLP Distribution${selectedStudent ? ` — ${selectedStudent.name}` : " — All Students"}`
                      : `HLP Scores Over Time${selectedStudent ? ` — ${selectedStudent.name}` : " — All Students"}`}
                  </h3>
                  <button onClick={() => setFullscreenChart(null)} className="text-gray-500 hover:text-gray-800 transition flex items-center gap-2 text-sm font-medium">
                    <FaCompress /> Close
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Student</label>
                    <select
                      className="p-2 rounded border border-gray-300 w-full sm:w-64 text-sm"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                      <option value="">All Students (class overview)</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Filter by HLP</label>
                    <select
                      className="p-2 rounded border border-gray-300 w-full sm:w-64 text-sm"
                      value={selectedHlp}
                      onChange={(e) => setSelectedHlp(e.target.value)}
                    >
                      <option value="">All HLPs</option>
                      {allHlps.map((hlp) => (
                        <option key={hlp} value={hlp}>
                          HLP {hlp}{HLP_LookFors[hlp]?.title ? `: ${HLP_LookFors[hlp].title.substring(0, 40)}…` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                {fullscreenChart === "pie" ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius="40%" dataKey="value" labelLine={false} label={<CustomPieLabel />}>
                        {pieData.map((entry) => (
                          <Cell key={entry.hlp} fill={getGroupColor(entry.hlp)} />
                        ))}
                      </Pie>
                      <PieTooltip formatter={(value, name) => [`${value} reflection${value !== 1 ? "s" : ""}`, name]} />
                      <Legend formatter={(value, entry) => { const hlp = HLP_LookFors[entry.payload.hlp]; return `${value}${hlp ? `: ${hlp.title.substring(0, 50)}…` : ""}`; }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : !selectedStudentId ? (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm text-gray-400 text-center px-4">Select a student from the dropdown above to see their score progression over time.</p>
                  </div>
                ) : lineData.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">No scored entries to display.</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 13 }} />
                      <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 13 }} />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Legend />
                      {hlps.map((hlp, i) => (
                        <Line key={hlp} type="monotone" dataKey={`HLP ${hlp}`} stroke={LINE_COLORS[i % LINE_COLORS.length]} strokeWidth={3} dot={{ r: 5 }} connectNulls />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassCharts;
