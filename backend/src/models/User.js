const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["Active", "Banned"],
      default: "Active",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "Engineering",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    linkedin: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
