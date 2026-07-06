const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
    street:     { type: String, required: true, trim: true },
    city:       { type: String, required: true, trim: true },
    state:      { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country:    { type: String, default: "India", trim: true },
    isDefault:  { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"],
    },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    addresses: [addressSchema],
    passwordResetToken: String,
    passwordResetExpiry: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed password on login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual field — full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Strip sensitive fields from JSON response
userSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpiry;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;