import create from "zustand";

// Function to save state to localStorage
const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Function to load state from localStorage
const loadFromLocalStorage = (key) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
};

export const useExamStore = create((set, get) => ({
  examAnswers: loadFromLocalStorage("examAnswers") || {},
  userInteraction: loadFromLocalStorage("userInteraction") || [],

  // Function to set multiple answers for an exam
  setExamAnswers: (examId, answers) => {
    set((state) => {
      const updatedAnswers = {
        ...state.examAnswers,
        [examId]: {
          ...state.examAnswers[examId],
          ...answers,
        },
      };
      saveToLocalStorage("examAnswers", updatedAnswers); // Save to localStorage
      return {
        examAnswers: updatedAnswers,
      };
    });
  },

  // Function to set or update an answer for a question
  setExamAnswersByQuestion: (examId, questionId, answer) => {
    set((state) => {
      const updatedAnswers = {
        ...state.examAnswers,
        [examId]: {
          ...state.examAnswers[examId],
          [questionId]: { ...answer },
        },
      };

      // Add interaction log with questionId
      const updatedUserInteraction = [
        ...state.userInteraction,
        {
          type: "changeValue",
          questionId, // Store questionId
          old: state.examAnswers[examId]?.[questionId]?.value || null,
          new: answer.value,
        },
      ];

      // Save both examAnswers and userInteraction to localStorage
      saveToLocalStorage("examAnswers", updatedAnswers);
      saveToLocalStorage("userInteraction", updatedUserInteraction);

      return {
        examAnswers: updatedAnswers,
        userInteraction: updatedUserInteraction,
      };
    });
  },

  // Function to set the answer type (marked, answered, missed)
  setExamAnswerType: (examId, questionId, answerType) => {
    set((state) => {
      const updatedAnswers = {
        ...state.examAnswers,
        [examId]: {
          ...state.examAnswers[examId],
          [questionId]: {
            ...state.examAnswers[examId][questionId],
            type: answerType,
          },
        },
      };

      // Add interaction log with questionId
      const updatedUserInteraction = [
        ...state.userInteraction,
        {
          type: "changeAnswerType",
          questionId, // Store questionId
          old: state.examAnswers[examId]?.[questionId]?.type || "missed",
          new: answerType,
        },
      ];

      // Save both examAnswers and userInteraction to localStorage
      saveToLocalStorage("examAnswers", updatedAnswers);
      saveToLocalStorage("userInteraction", updatedUserInteraction);

      return {
        examAnswers: updatedAnswers,
        userInteraction: updatedUserInteraction,
      };
    });
  },

  // Function to track question changes
  changeQuestion: (oldQuestionId, newQuestionId) => {
    set((state) => {
      const updatedInteractions = [
        ...state.userInteraction,
        {
          type: "changeQuestion",
          old: oldQuestionId,
          new: newQuestionId,
        },
      ];

      // Save userInteraction to localStorage
      saveToLocalStorage("userInteraction", updatedInteractions);

      return {
        userInteraction: updatedInteractions,
      };
    });
  },
}));
