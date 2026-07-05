const MeetingHeader = ({ meetingName, roomId, participants }) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">

      <div className="flex items-center gap-3">

        <h1 className="text-2xl font-bold text-violet-500">
          {meetingName || "IntellMeet"}
        </h1>

        <span className="text-slate-400">
          Room #{roomId} {participants !== undefined ? `(${participants} user${participants === 1 ? "" : "s"})` : ""}
        </span>

      </div>

      <div className="text-green-400">
        Excellent Connection
      </div>

    </header>
  );
};

export default MeetingHeader;