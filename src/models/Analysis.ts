import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  userId: string;
  input: string;
  result: {
    emotions: {
      fear: number;
      anger: number;
      hope: number;
      sadness: number;
    };
    bias: {
      direction: 'left' | 'right' | 'neutral';
      confidence: number;
      explanation: string;
    };
    missing_context: string[];
    rewrite: string;
    manipulation_score: number;
  };
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>({
  userId: { type: String, required: false },
  input: { type: String, required: true },
  result: {
    emotions: {
      fear: { type: Number, default: 0 },
      anger: { type: Number, default: 0 },
      hope: { type: Number, default: 0 },
      sadness: { type: Number, default: 0 },
    },
    bias: {
      direction: { type: String, enum: ['left', 'right', 'neutral'], default: 'neutral' },
      confidence: { type: Number, default: 0 },
      explanation: { type: String, default: '' },
    },
    missing_context: [{ type: String }],
    rewrite: { type: String, default: '' },
    manipulation_score: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
