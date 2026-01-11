import mongoose, { Document, Types } from "mongoose";

export interface IGig extends Document {
  title: string;
  description: string;
  budget: number;
  ownerId: Types.ObjectId; // The user who posted this gig (Client)
  status: "open" | "assigned";
  hiredFreelancerId?: Types.ObjectId;
  hiredBidId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const gigSchema = new mongoose.Schema<IGig>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be at least 1"],
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "assigned"],
      default: "open",
    },

    // Set when a freelancer is hired
    hiredFreelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    hiredBidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
      default: null,
    },
  },
  { timestamps: true }
);

gigSchema.index({ status: 1 });
gigSchema.index({ ownerId: 1 });
gigSchema.index({ title: "text" });

export const Gig = mongoose.model<IGig>("Gig", gigSchema);
