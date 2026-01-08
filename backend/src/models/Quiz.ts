import { Schema, model, Types } from "mongoose";
import { IQuiz, IQuestion, QUIZ_STATUSES } from "@/interfaces/quiz";

const questionSchema = new Schema<IQuestion>(
  {
    content: { type: String, required: true, trim: true },
    options: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    correctOptionIndex: { type: Number, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true, trim: true },
    class_id: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },
    thumbnail_id: {
      type: Types.ObjectId,
      ref: "Media",
      default: null,
    },
    description: { type: String, trim: true, maxlength: 500 },
    questions: { type: [questionSchema], default: [] },
    totalScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: QUIZ_STATUSES,
      default: "draft",
      index: true,
    },
    duration: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

/* ================= Hooks ================= */
quizSchema.pre("save", function (next) {
  this.totalScore = this.questions.length;
  next();
});

/* ================= Model ================= */
export const QuizModel = model<IQuiz>("Quiz", quizSchema, "quizzes");
