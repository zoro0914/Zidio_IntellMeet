
import { MessageSquare, Video, Brain } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* Left Side */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-12 relative">

          <div className="mb-10">
            <h1 className="text-3xl font-bold">
              IntellMeet
            </h1>

            <p className="text-slate-300 mt-2">
              AI Powered Collaboration Platform
            </p>
          </div>

          <div className="mt-16">
            <h2 className="text-5xl font-bold leading-tight">
              Smarter Meetings,
              <br />
              Stronger Teams.
            </h2>

            <p className="text-slate-300 mt-6 text-lg">
              Collaborate, communicate and automate
              meeting workflows with AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <Video size={24} />
              <h3 className="font-semibold mt-2">
                HD Video Meetings
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <MessageSquare size={24} />
              <h3 className="font-semibold mt-2">
                Real-Time Chat
              </h3>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
              <Brain size={24} />
              <h3 className="font-semibold mt-2">
                AI Meeting Summary
              </h3>
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-10">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;