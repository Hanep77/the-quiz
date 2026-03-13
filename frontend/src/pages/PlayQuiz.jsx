import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client";

export default function PlayQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    axiosClient.get(`/quizzes/${id}`)
      .then(({ data }) => {
        setQuiz(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const onOptionChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId,
    });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    axiosClient.post(`/quizzes/${id}/submit`, { answers })
      .then(({ data }) => {
        setResult(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit quiz.");
      });
  };

  if (loading) return (
    <div className="text-center mt-20">
      <span className="brutalist-card bg-cyan-400 text-3xl font-black animate-bounce inline-block">PREPARING YOUR CHALLENGE...</span>
    </div>
  );
  if (!quiz) return (
    <div className="text-center mt-20">
      <span className="brutalist-card bg-red-400 text-3xl font-black inline-block">QUIZ NOT FOUND!</span>
      <div className="mt-8">
        <Link to="/" className="brutalist-button text-xl">GO BACK HOME</Link>
      </div>
    </div>
  );

  if (result) {
    return (
      <div className="max-w-2xl mx-auto brutalist-card bg-green-300 text-center py-12 px-8 rotate-1">
        <h2 className="text-6xl font-black mb-8 uppercase tracking-tighter">FINISH!</h2>
        <div className="brutalist-card bg-white mb-10 -rotate-2">
          <p className="text-4xl font-black uppercase mb-2">YOUR SCORE</p>
          <p className="text-7xl font-black text-blue-600">{result.score} <span className="text-black text-4xl">/ {result.total}</span></p>
        </div>
        <div className="space-y-4">
          <Link to="/" className="brutalist-button brutalist-button-blue w-full text-2xl py-4">BACK TO DASHBOARD</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="brutalist-card bg-white mb-10">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">{quiz.title}</h1>
        <p className="text-2xl font-bold text-black/70 italic">{quiz.description}</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-10">
        {quiz.questions.map((q, index) => (
          <div key={q.id} className="brutalist-card bg-white hover:bg-yellow-50 transition-colors">
            <h3 className="font-black text-3xl mb-8 leading-tight">
              <span className="bg-black text-white px-3 py-1 mr-4 inline-block -rotate-3">{index + 1}</span>
              {q.text}
            </h3>
            <div className="space-y-4">
              {q.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-6 cursor-pointer p-4 border-4 border-black font-black text-xl transition-all ${answers[q.id] === option.id ? 'bg-cyan-300 translate-x-1 translate-y-1 shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-100'
                    }`}
                >
                  <input
                    type="radio"
                    name={`question_${q.id}`}
                    value={option.id}
                    onChange={() => onOptionChange(q.id, option.id)}
                    className="w-8 h-8 border-4 border-black cursor-pointer accent-black"
                    required
                  />
                  <span className="uppercase">{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="sticky bottom-4 pt-10">
          <button type="submit" className="brutalist-button brutalist-button-green w-full text-3xl py-6 uppercase tracking-widest">
            SUBMIT MY ANSWERS
          </button>
        </div>
      </form>
    </div>
  );
}
