import React from 'react';

export const LineChart = ({ data = [20, 35, 28, 45, 30, 55, 48], labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }) => {
  // Compute SVG viewBox parameters
  const height = 140;
  const width = 500;
  const padding = 25;
  const maxVal = Math.max(...data) * 1.15;
  
  // Create coordinates
  const points = data.map((val, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
      <div>
        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Meetings Activity Load</h4>
        <p className="text-[9px] text-slate-500 mt-0.5">Average active conference logs this week</p>
      </div>

      <div className="my-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Gradients definition */}
          <defs>
            <linearGradient id="violet-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45"/>
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0"/>
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaD} fill="url(#violet-gradient)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data Nodes */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4" fill="#030712" stroke="#a78bfa" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#f8fafc" className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-1 py-0.5 rounded">
                {data[i]}
              </text>
            </g>
          ))}

          {/* Labels */}
          {labels.map((lbl, i) => {
            const x = padding + (i * (width - padding * 2)) / (labels.length - 1);
            return (
              <text key={i} x={x} y={height - 6} textAnchor="middle" fill="#64748b" className="text-[9px] font-bold">
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const BarChart = ({ data = [12, 19, 15, 26, 22, 30, 25], labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }) => {
  const height = 140;
  const width = 500;
  const padding = 25;
  const maxVal = Math.max(...data) * 1.15;

  const barWidth = 24;
  const gap = (width - padding * 2 - (data.length * barWidth)) / (data.length - 1);

  return (
    <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
      <div>
        <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Registrants Analytics</h4>
        <p className="text-[9px] text-slate-500 mt-0.5">Subscriber account rates monthly scale</p>
      </div>

      <div className="my-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

          {/* Bar elements */}
          {data.map((val, i) => {
            const x = padding + i * (barWidth + gap);
            const barHeight = (val * (height - padding * 2)) / maxVal;
            const y = height - padding - barHeight;

            return (
              <g key={i} className="group cursor-pointer">
                {/* Background Hover Bar */}
                <rect x={x - 2} y={padding} width={barWidth + 4} height={height - padding * 2} fill="#334155" fillOpacity="0.0" className="hover:fill-opacity-10 transition-colors rounded" />
                {/* Foreground Bar */}
                <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="#6366f1" className="group-hover:fill-indigo-400 transition-colors" />
                {/* Value Text */}
                <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill="#f8fafc" className="text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Labels */}
          {labels.map((lbl, i) => {
            const x = padding + i * (barWidth + gap) + barWidth / 2;
            return (
              <text key={i} x={x} y={height - 6} textAnchor="middle" fill="#64748b" className="text-[9px] font-bold">
                {lbl}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
