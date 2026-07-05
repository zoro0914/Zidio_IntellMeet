import {
  Loader2,
  Video,
  Mic,
  Wifi,
} from "lucide-react";

const LoadingMeeting = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">

        {/* Logo */}

        <div className="flex justify-center">

          <div className="w-24 h-24 rounded-full bg-violet-600 flex items-center justify-center animate-pulse">

            <Video size={45} className="text-white" />

          </div>

        </div>

        {/* Loader */}

        <div className="flex justify-center mt-8">

          <Loader2
            size={45}
            className="text-violet-400 animate-spin"
          />

        </div>

        {/* Title */}

        <h2 className="text-white text-3xl font-bold text-center mt-8">
          Joining Meeting...
        </h2>

        <p className="text-slate-300 text-center mt-2">
          Please wait while we prepare your meeting.
        </p>

        {/* Steps */}

        <div className="mt-10 space-y-5">

          <div className="flex items-center gap-4 text-slate-200">

            <Wifi className="text-green-400" />

            <span>Connecting to Server</span>

          </div>

          <div className="flex items-center gap-4 text-slate-200">

            <Video className="text-violet-400" />

            <span>Initializing Camera</span>

          </div>

          <div className="flex items-center gap-4 text-slate-200">

            <Mic className="text-violet-400" />

            <span>Checking Microphone</span>

          </div>

        </div>

        {/* Progress */}

        <div className="mt-10">

          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">

            <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full animate-[loading_2s_linear_infinite]"></div>

          </div>

        </div>

      </div>

      <style>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

    </div>
  );
};

export default LoadingMeeting;