"use server";

import 'firebase-admin';

let db: any;
try {
  const { getFirestore } = require('firebase-admin/firestore');
  db = getFirestore();
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
}

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
    });

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
