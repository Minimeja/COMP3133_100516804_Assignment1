const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false } // hide password by default
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

// Make JSON output clean (ISO timestamps + no password)
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.created_at instanceof Date) ret.created_at = ret.created_at.toISOString();
    if (ret.updated_at instanceof Date) ret.updated_at = ret.updated_at.toISOString();
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("User", userSchema);