import mongoose, { Document, Types } from "mongoose";

export interface IBid extends Document {
  gigId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  message: string;
  price: number;
  status: "pending" | "hired" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new mongoose.Schema<IBid>(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: [true, "Gig ID is required"],
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Freelancer ID is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
    },

    status: {
      type: String,
      enum: ["pending", "hired", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

bidSchema.index({ gigId: 1 });
bidSchema.index({ freelancerId: 1 });
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

export const Bid = mongoose.model<IBid>("Bid", bidSchema);
