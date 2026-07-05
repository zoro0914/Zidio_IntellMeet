const DashboardHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const currentHour = new Date().getHours();

  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">

      {/* Left */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900">
          {greeting},{" "}
          <span className="text-violet-600">
            {user?.name || "User"}
          </span>{" "}
          👋
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Here's what's happening with your team today.
        </p>
      </div>

      {/* Right */}
      <div className="mt-6 lg:mt-0">
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">

          <p className="text-sm text-gray-500">
            Today
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>

        </div>
      </div>

    </div>
  );
};

export default DashboardHeader;