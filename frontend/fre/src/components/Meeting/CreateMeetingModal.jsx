import { X, Calendar, Clock, Users } from "lucide-react";
import { useState } from "react";


import { useEffect } from "react";

const CreateMeetingModal = ({ open, onClose, onCreate, prefill }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "30",
    type: "private",
  });

  useEffect(() => {
    if (prefill) {
      setFormData({
        title: prefill.title || "",
        description: prefill.description || "",
        date: "",
        time: "",
        duration: "30",
        type: "private",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        duration: "30",
        type: "private",
      });
    }
  }, [prefill, open]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    onCreate(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between p-6 border-b">

          <div>
            <h2 className="text-2xl font-bold">
              Create Meeting
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Schedule a new meeting
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Title */}

          <div>

            <label className="block mb-2 font-medium">
              Meeting Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Weekly Team Meeting"
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 outline-none"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Meeting Agenda..."
              className="w-full border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-violet-500 outline-none"
            />

          </div>

          {/* Date + Time */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="flex items-center gap-2 mb-2 font-medium">
                <Calendar size={18} />
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

            <div>

              <label className="flex items-center gap-2 mb-2 font-medium">
                <Clock size={18} />
                Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

            </div>

          </div>

          {/* Duration + Type */}

          <div className="grid md:grid-cols-2 gap-4">

            <div>

              <label className="block mb-2 font-medium">
                Duration
              </label>

              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="30">30 Minutes</option>
                <option value="60">1 Hour</option>
                <option value="90">1.5 Hours</option>
                <option value="120">2 Hours</option>
              </select>

            </div>

            <div>

              <label className="flex items-center gap-2 mb-2 font-medium">
                <Users size={18} />
                Meeting Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                <option value="private">
                  Private
                </option>

                <option value="public">
                  Public
                </option>

              </select>

            </div>

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white"
            >
              Create Meeting
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateMeetingModal;