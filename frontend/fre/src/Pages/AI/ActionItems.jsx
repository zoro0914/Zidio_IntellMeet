import React, { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import ActionCard from "../../components/AI/ActionCard";

const ActionItems = ({ actionItems, recordingId }) => {
  const [completed, setCompleted] = useState({});

  const handleToggle = (index) => {
    const key = `${recordingId}-${index}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400">
        <ClipboardCheck className="mx-auto text-slate-300 mb-2" size={32} />
        <p className="text-xs">No tasks extracted for this meeting.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardCheck size={18} className="text-violet-600" />
        <span className="text-sm font-bold text-slate-800">Action items checklist</span>
      </div>

      <div className="space-y-2">
        {actionItems.map((action, idx) => (
          <ActionCard
            key={idx}
            action={action}
            isChecked={!!completed[`${recordingId}-${idx}`]}
            onToggle={() => handleToggle(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default ActionItems;
