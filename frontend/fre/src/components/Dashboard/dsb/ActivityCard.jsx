

const ActivityCard = ({ avatar, name, action, time, icon: Icon }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition">
      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
        {avatar || name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{name}</p>
        <p className="text-xs text-slate-500">{action}</p>
      </div>
      <div className="text-right">
        {Icon && <Icon size={16} className="text-slate-400 mb-1" />}
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
};

export default ActivityCard;
