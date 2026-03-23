import { inngest } from "./client";
import { 
  detectEmotions, 
  analyzeBias, 
  identifyMissingContext, 
  generateNeutralRewrite, 
  calculateManipulationScore 
} from "@/lib/gemini";
import dbConnect from "@/lib/db";
import Analysis from "@/models/Analysis";

export const analyzeTextTask = inngest.createFunction(
  { 
    id: "clearframe-analyze", 
    name: "ClearFrame Analysis Task",
    triggers: [{ event: "app/analyze.text" }] 
  },
  async ({ event, step }) => {
    const { text, userId } = event.data;
    console.log("Inngest function triggered for text:", text.substring(0, 50) + "...");

    // Run AI steps in a single parallel batch step to avoid step conflicts
    const results = await step.run("ai-extraction-batch", async () => {
      console.time("Gemini Parallel Extraction");
      const [emotions, bias, context, rewrite] = await Promise.all([
        detectEmotions(text),
        analyzeBias(text),
        identifyMissingContext(text),
        generateNeutralRewrite(text)
      ]);
      console.timeEnd("Gemini Parallel Extraction");
      return { emotions, bias, context, rewrite };
    });

    const { emotions, bias, context, rewrite } = results;

    // Calculate score based on results
    const score = await step.run("calculate-score", async () => {
      return await calculateManipulationScore(emotions, bias, context.length);
    });

    const result = {
      emotions,
      bias,
      missing_context: context,
      rewrite,
      manipulation_score: score,
    };

    console.log("Final Result Prepared:", result);

    if (userId) {
      await step.run("save-to-db", async () => {
        console.log("Syncing to MongoDB...");
        await dbConnect();
        const saved = await Analysis.create({
          userId,
          input: text,
          result,
        });
        return { success: true, id: saved._id };
      });
    }

    return result;
  }
);