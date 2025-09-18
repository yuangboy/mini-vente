import { Schema, Document, model, Types, models } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  siren?: string;
  tvaNumber?: string;
  annualRevenue?: number;
  email: string;
  password: string;
  profilePicture?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  role: "particular" | "professional" | "admin";
  verificationCode?: string | null;
  verificationToken?: string | null;
  tokenExpiresAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  verificationAttempts: number;
  comparePassword: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    companyName: { type: String },
    siren: { type: String },
    tvaNumber: { type: String },
    annualRevenue: { type: Number },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    profilePicture: { type: String },
    phoneNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["particular", "professional", "admin"],
      default: "particular",
    },
    verificationCode: { type: String, default: null },
    verificationToken: { type: String, default: null },
    tokenExpiresAt: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    verificationAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.signAccessToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.NEXT_PUBLIC_ACCESS_TOKEN as string,
    {
      expiresIn: "30m",
    }
  );
};

UserSchema.methods.signRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id },
    process.env.NEXT_PUBLIC_REFRESH_TOKEN as string,
    {
      expiresIn: "7d",
    }
  );
};

UserSchema.methods.getClientType = function (): "particular" | "professional" {
  return this.role === "professional" ? "professional" : "particular";
};


export default models.User || model<IUser>("User", UserSchema);
