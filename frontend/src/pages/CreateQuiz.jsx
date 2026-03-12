import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [
      {
        text: "",
        options: [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ],
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    axiosClient.post("/quizzes", quiz)
      .then(() => {
        setNotification("Quiz created successfully");
        navigate("/");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
            // handle validation errors (simplified)
            console.log(response.data.errors);
            alert("Validation failed. Please check your inputs.");
        }
      });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          text: "",
          options: [{ text: "", is_correct: false }, { text: "", is_correct: false }],
        },
      ],
    });
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addOption = (qIndex) => {
      const newQuestions = [...quiz.questions];
      newQuestions[qIndex].options.push({ text: "", is_correct: false });
      setQuiz({ ...quiz, questions: newQuestions });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">Create Quiz</h1>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="brutalist-card bg-white">
          <div className="mb-6">
            <label className="brutalist-label">Quiz Title</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              className="brutalist-input"
              placeholder="E.g. 90s Pop Culture"
              required
            />
          </div>
          <div>
            <label className="brutalist-label">Description</label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              className="brutalist-input min-h-[100px]"
              placeholder="What is this quiz about?"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black uppercase tracking-tight">Questions</h2>
            <button type="button" onClick={addQuestion} className="brutalist-button brutalist-button-blue text-sm">
                + ADD NEW QUESTION
            </button>
          </div>
          
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="brutalist-card bg-amber-100 rotate-[-0.5deg]">
              <div className="mb-6">
                <label className="brutalist-label">Question {qIndex + 1}</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                  className="brutalist-input"
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="brutalist-label text-sm">Options (Check the correct one)</label>
                {q.options.map((o, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-4">
                    <input 
                        type="checkbox" 
                        checked={o.is_correct} 
                        onChange={(e) => updateOption(qIndex, oIndex, "is_correct", e.target.checked)}
                        className="w-8 h-8 border-4 border-black cursor-pointer accent-black"
                    />
                    <input
                      type="text"
                      value={o.text}
                      onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                      className="brutalist-input py-2"
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                  </div>
                ))}
                 <button type="button" onClick={() => addOption(qIndex)} className="font-black text-sm underline decoration-2 hover:bg-yellow-300 transition-colors">+ ADD OPTION</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 sticky bottom-4">
            <button type="submit" className="brutalist-button brutalist-button-green w-full text-2xl py-4 uppercase">
                🚀 PUBLISH QUIZ
            </button>
        </div>
      </form>
    </div>
  );
}
