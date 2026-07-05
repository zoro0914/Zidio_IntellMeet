import {
  CheckCircle2,
  Home,
  RotateCcw,
  Clock,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EndMeeting = ({
  duration = "00:42:18",
  participants = 5,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10">

        {/* Success Icon */}

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2
              size={60}
              className="text-green-600"
            />
          </div>
        </div>

        {/* Heading */}

        <h1 className="text-3xl font-bold text-center mt-6">
          Meeting Ended
        </h1>

        <p className="text-center text-slate-500 mt-2">
          Thanks for using IntellMeet.
        </p>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-5 mt-10">

          <div className="border rounded-2xl p-5 text-center">

            <Clock
              className="mx-auto text-violet-600 mb-3"
              size={28}
            />

            <p className="text-sm text-slate-500">
              Duration
            </p>

            <h3 className="text-xl font-bold mt-1">
              {duration}
            </h3>

          </div>

          <div className="border rounded-2xl p-5 text-center">

            <Users
              className="mx-auto text-violet-600 mb-3"
              size={28}
            />

            <p className="text-sm text-slate-500">
              Participants
            </p>

            <h3 className="text-xl font-bold mt-1">
              {participants}
            </h3>

          </div>

        </div>

        {/* Buttons */}

        <div className="flex flex-col md:flex-row gap-4 mt-10">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl transition"
          >
            <Home size={20} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/meetings")}
            className="flex-1 flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-100 py-4 rounded-2xl transition"
          >
            <RotateCcw size={20} />
            Join Again
          </button>

        </div>

      </div>

    </div>
  );
};

export default EndMeeting;