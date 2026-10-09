import mongoose, { Schema, type Types } from "mongoose";

const { ObjectId } = Schema.Types;

const userRoles = ["patient", "psychologist", "admin"] as const;
const accountStatuses = [
  "active",
  "pending",
  "suspended",
  "deactivated",
] as const;
const verificationStatuses = [
  "pending",
  "under_review",
  "more_information_required",
  "verified",
  "rejected",
  "suspended",
] as const;

const baseOptions = { timestamps: true, versionKey: false } as const;
const ref = { type: ObjectId, ref: "User", required: true } as const;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: userRoles, required: true, index: true },
    accountStatus: {
      type: String,
      enum: accountStatuses,
      required: true,
      default: "pending",
      index: true,
    },
    emailVerified: { type: Boolean, required: true, default: false },
    profileImage: { type: String, trim: true, maxlength: 500 },
    country: { type: String, trim: true, maxlength: 100 },
    timezone: { type: String, trim: true, maxlength: 80 },
    lastLoginAt: { type: Date },
  },
  baseOptions,
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const safeRet: Record<string, unknown> = ret;
    delete safeRet.passwordHash;
    return safeRet;
  },
});

const patientProfileSchema = new Schema(
  {
    userId: { ...ref, unique: true },
    dateOfBirth: { type: Date },
    faithPreference: { type: String, trim: true, maxlength: 500 },
    supportPreferences: [{ type: String, trim: true, maxlength: 100 }],
    consentVersion: { type: String, trim: true, maxlength: 40 },
    privacyConsentAt: { type: Date },
  },
  baseOptions,
);

const psychologistProfileSchema = new Schema(
  {
    userId: { ...ref, unique: true },
    professionalTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    bio: { type: String, trim: true, maxlength: 4000 },
    specializations: [{ type: String, trim: true, maxlength: 100 }],
    yearsOfExperience: { type: Number, min: 0, max: 100 },
    languages: [{ type: String, trim: true, maxlength: 80 }],
    sessionTypes: [{ type: String, trim: true, maxlength: 80 }],
    availability: [{ type: String, trim: true, maxlength: 100 }],
    pricing: {
      currency: { type: String, trim: true, maxlength: 3 },
      amount: { type: Number, min: 0 },
      interval: { type: String, enum: ["session", "hour"] },
    },
    faithCompatibility: { type: String, trim: true, maxlength: 1000 },
    verificationStatus: {
      type: String,
      enum: verificationStatuses,
      required: true,
      default: "pending",
    },
  },
  baseOptions,
);
psychologistProfileSchema.index({ verificationStatus: 1 });
psychologistProfileSchema.index({ specializations: 1 });
psychologistProfileSchema.index({ languages: 1 });
psychologistProfileSchema.index({ country: 1 });

const psychologistApplicationSchema = new Schema(
  {
    psychologistId: { ...ref, index: true },
    professionalTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    licenseInformation: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    qualifications: [
      {
        qualification: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        institution: {
          type: String,
          required: true,
          trim: true,
          maxlength: 200,
        },
        degree: { type: String, required: true, trim: true, maxlength: 200 },
      },
    ],
    specializations: [{ type: String, trim: true, maxlength: 100 }],
    yearsOfExperience: { type: Number, min: 0, max: 100 },
    languages: [{ type: String, trim: true, maxlength: 80 }],
    biography: { type: String, trim: true, maxlength: 4000 },
    licenseNumber: { type: String, trim: true, maxlength: 200 },
    licensingOrganization: { type: String, trim: true, maxlength: 200 },
    country: { type: String, trim: true, maxlength: 2 },
    sessionTypes: [{ type: String, trim: true, maxlength: 80 }],
    pricing: {
      currency: { type: String, trim: true, maxlength: 3 },
      amount: { type: Number, min: 0 },
      interval: { type: String, enum: ["session", "hour"] },
    },
    availabilityPreferences: [{ type: String, trim: true, maxlength: 100 }],
    faithCompatibility: { type: String, trim: true, maxlength: 1000 },
    faithIntegrationApproach: { type: String, trim: true, maxlength: 2000 },
    verificationDocumentIds: [
      { type: String, trim: true, maxlength: 200, select: false },
    ],
    submittedAt: { type: Date },
    status: {
      type: String,
      enum: verificationStatuses,
      default: "pending",
      index: true,
    },
    reviewedBy: { type: ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, trim: true, maxlength: 2000 },
  },
  baseOptions,
);

const credentialSchema = new Schema(
  {
    psychologistId: { ...ref, index: true },
    credentialType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    issuingBody: { type: String, trim: true, maxlength: 200 },
    registrationNumber: { type: String, trim: true, maxlength: 200 },
    country: { type: String, trim: true, maxlength: 100 },
    issuedAt: { type: Date },
    expiresAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "expired"],
      default: "pending",
      index: true,
    },
  },
  baseOptions,
);

const verificationDocumentSchema = new Schema(
  {
    psychologistId: { ...ref, index: true },
    credentialId: { type: ObjectId, ref: "Credential" },
    storageKey: { type: String, required: true, select: false },
    originalFilename: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    mimeType: { type: String, required: true, trim: true, maxlength: 100 },
    sizeBytes: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["uploaded", "under_review", "accepted", "rejected"],
      default: "uploaded",
      index: true,
    },
    reviewedBy: { type: ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  baseOptions,
);

const verificationHistorySchema = new Schema(
  {
    documentId: {
      type: ObjectId,
      ref: "VerificationDocument",
      required: true,
      index: true,
    },
    actorId: { type: ObjectId, ref: "User", required: true, index: true },
    fromStatus: {
      type: String,
      enum: ["uploaded", "under_review", "accepted", "rejected"],
    },
    toStatus: {
      type: String,
      enum: ["uploaded", "under_review", "accepted", "rejected"],
      required: true,
    },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  baseOptions,
);

const mentalHealthIntakeSchema = new Schema(
  {
    patientId: { ...ref, unique: true },
    responses: { type: Schema.Types.Mixed, required: true, select: false },
    completedAt: { type: Date },
    consentVersion: { type: String, required: true, trim: true, maxlength: 40 },
  },
  baseOptions,
);

const appointmentSchema = new Schema(
  {
    patientId: { ...ref, index: true },
    psychologistId: { ...ref, index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["requested", "confirmed", "cancelled", "completed", "no_show"],
      required: true,
      default: "requested",
      index: true,
    },
    sessionType: { type: String, trim: true, maxlength: 80 },
    notes: { type: String, trim: true, maxlength: 2000, select: false },
  },
  baseOptions,
);

const conversationSchema = new Schema(
  {
    patientId: { ...ref, index: true },
    psychologistId: { ...ref, index: true },
    lastMessageAt: { type: Date },
  },
  baseOptions,
);
conversationSchema.index({ updatedAt: -1 });

const messageSchema = new Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: { ...ref, index: true },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10000,
      select: false,
    },
    readAt: { type: Date },
    deletedAt: { type: Date },
  },
  baseOptions,
);
messageSchema.index({ createdAt: 1 });

const notificationSchema = new Schema(
  {
    userId: { ...ref, index: true },
    type: { type: String, required: true, trim: true, maxlength: 100 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    readAt: { type: Date, index: true },
    link: { type: String, trim: true, maxlength: 500 },
  },
  baseOptions,
);
notificationSchema.index({ userId: 1, createdAt: -1 });

const resourceBase = {
  title: { type: String, required: true, trim: true, maxlength: 200 },
  summary: { type: String, required: true, trim: true, maxlength: 1000 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  country: { type: String, trim: true, maxlength: 100 },
  published: { type: Boolean, default: false, index: true },
  publishedAt: { type: Date },
  createdBy: { type: ObjectId, ref: "User" },
};

const christianResourceSchema = new Schema(
  {
    ...resourceBase,
    scriptureReference: { type: String, trim: true, maxlength: 200 },
  },
  baseOptions,
);

const crisisResourceSchema = new Schema(
  {
    ...resourceBase,
    emergencyNumber: { type: String, trim: true, maxlength: 100 },
    serviceType: { type: String, trim: true, maxlength: 120 },
  },
  baseOptions,
);

const reportSchema = new Schema(
  {
    reporterId: { ...ref, index: true },
    reportedUserId: { type: ObjectId, ref: "User", index: true },
    targetType: {
      type: String,
      enum: ["user", "message", "profile"],
      required: true,
    },
    targetId: { type: ObjectId, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 120 },
    details: { type: String, trim: true, maxlength: 4000, select: false },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "dismissed"],
      default: "open",
      index: true,
    },
    resolvedBy: { type: ObjectId, ref: "User" },
    resolvedAt: { type: Date },
  },
  baseOptions,
);

const auditLogSchema = new Schema(
  {
    actorId: { type: ObjectId, ref: "User", index: true },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    entityType: { type: String, required: true, trim: true, maxlength: 100 },
    entityId: { type: ObjectId },
    metadata: { type: Schema.Types.Mixed, select: false },
    ipAddress: { type: String, trim: true, maxlength: 100 },
  },
  baseOptions,
);
auditLogSchema.index({ createdAt: -1 });

const paymentSchema = new Schema(
  {
    patientId: { ...ref, index: true },
    psychologistId: { ...ref, index: true },
    appointmentId: {
      type: ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    providerPaymentId: {
      type: String,
      trim: true,
      maxlength: 200,
      select: false,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, maxlength: 3 },
    status: {
      type: String,
      enum: ["pending", "authorized", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paidAt: { type: Date },
  },
  baseOptions,
);

const payoutSchema = new Schema(
  {
    psychologistId: { ...ref, index: true },
    paymentIds: [{ type: ObjectId, ref: "Payment" }],
    providerPayoutId: {
      type: String,
      trim: true,
      maxlength: 200,
      select: false,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, trim: true, maxlength: 3 },
    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
      index: true,
    },
    paidAt: { type: Date },
  },
  baseOptions,
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const PatientProfile =
  mongoose.models.PatientProfile ||
  mongoose.model("PatientProfile", patientProfileSchema);
export const PsychologistProfile =
  mongoose.models.PsychologistProfile ||
  mongoose.model("PsychologistProfile", psychologistProfileSchema);
export const PsychologistApplication =
  mongoose.models.PsychologistApplication ||
  mongoose.model("PsychologistApplication", psychologistApplicationSchema);
export const Credential =
  mongoose.models.Credential || mongoose.model("Credential", credentialSchema);
export const VerificationDocument =
  mongoose.models.VerificationDocument ||
  mongoose.model("VerificationDocument", verificationDocumentSchema);
export const VerificationHistory =
  mongoose.models.VerificationHistory ||
  mongoose.model("VerificationHistory", verificationHistorySchema);
export const MentalHealthIntake =
  mongoose.models.MentalHealthIntake ||
  mongoose.model("MentalHealthIntake", mentalHealthIntakeSchema);
export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
export const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
export const ChristianResource =
  mongoose.models.ChristianResource ||
  mongoose.model("ChristianResource", christianResourceSchema);
export const CrisisResource =
  mongoose.models.CrisisResource ||
  mongoose.model("CrisisResource", crisisResourceSchema);
export const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);
export const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export const Payout =
  mongoose.models.Payout || mongoose.model("Payout", payoutSchema);

export type DatabaseId = Types.ObjectId;
