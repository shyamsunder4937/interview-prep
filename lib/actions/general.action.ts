import { db } from "@/constants/firebase/admin";

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: Array<{
    role: "user" | "system" | "assistant";
    content: string;
  }>;
  feedbackId?: string;
}

export const createFeedback = async ({
  interviewId,
  userId,
  transcript,
  feedbackId,
}: CreateFeedbackParams) => {
  try {
    // If no feedbackId is provided, create a new document
    const feedbackRef = feedbackId
      ? db.collection("feedbacks").doc(feedbackId)
      : db.collection("feedbacks").doc();

    await feedbackRef.set({
      interviewId,
      userId,
      transcript,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    return { 
      success: true, 
      feedbackId: feedbackRef.id 
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { 
      success: false, 
      feedbackId: null 
    };
  }
};
