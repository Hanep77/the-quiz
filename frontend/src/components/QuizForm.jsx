import { useState, useEffect } from "react";

export default function QuizForm({ initialData = null, onSubmit, loading = false }) {
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

  useEffect(() => {
    if (initialData) {
        // Ensure data structure matches form expectation
        // API returns questions with options, so it should be close.
        // We might need to map is_correct if it comes as 1/0 instead of boolean, but Laravel casts usually handle this.
        setQuiz({
            ...initialData,
            questions: initialData.questions || [],
        });
    }
  }, [initialData]);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    onSubmit(quiz);
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

  const removeQuestion = (index) => {
      const newQuestions = [...quiz.questions];
      newQuestions.splice(index, 1);
      setQuiz({ ...quiz, questions: newQuestions });
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const updateOption = (qIndex, oIndex, field, value) => {
    const newQuestions = [...quiz.questions];
    // Deep copy options to avoid mutation
    const newOptions = [...newQuestions[qIndex].options];
    newOptions[oIndex] = { ...newOptions[oIndex], [field]: value };
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const addOption = (qIndex) => {
      const newQuestions = [...quiz.questions];
      const newOptions = [...newQuestions[qIndex].options, { text: "", is_correct: false }];
      newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
      setQuiz({ ...quiz, questions: newQuestions });
  }

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...quiz.questions];
    const newOptions = [...newQuestions[qIndex].options];
    newOptions.splice(oIndex, 1);
    newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
    setQuiz({ ...quiz, questions: newQuestions });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
              value={quiz.description || ''}
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
              <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow mr-4">
                    <label className="brutalist-label">Question {qIndex + 1}</label>
                    <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, "text", e.target.value)}
                    className="brutalist-input"
                    required
                    />
                  </div>
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 font-bold hover:text-red-700">DELETE</button>
              </div>

              <div className="space-y-3">
                <label className="brutalist-label text-sm">Options (Check the correct one)</label>
                {q.options && q.options.map((o, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-4">
                    <input 
                        type="checkbox" 
                        checked={!!o.is_correct} 
                        onChange={(e) => updateOption(qIndex, oIndex, "is_correct", e.target.checked)}
                        className="w-8 h-8 border-4 border-black cursor-pointer accent-black shrink-0"
                    />
                    <input
                      type="text"
                      value={o.text}
                      onChange={(e) => updateOption(qIndex, oIndex, "text", e.target.value)}
                      className="brutalist-input py-2"
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                    <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-red-500 font-bold px-2">X</button>
                  </div>
                ))}
                 <button type="button" onClick={() => addOption(qIndex)} className="font-black text-sm underline decoration-2 hover:bg-yellow-300 transition-colors">+ ADD OPTION</button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 sticky bottom-4">
            <button disabled={loading} type="submit" className="brutalist-button brutalist-button-green w-full text-2xl py-4 uppercase disabled:opacity-50">
                {loading ? 'SAVING...' : '🚀 PUBLISH QUIZ'}
            </button>
        </div>
      </form>
  );
}
