import { useEffect, useState, useCallback } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  const getQuizzes = useCallback(() => {
    setLoading(true);
    axiosClient.get('/quizzes')
      .then(({ data }) => {
        setLoading(false);
        setQuizzes(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getQuizzes();
  }, [getQuizzes]);

  const onDelete = (quiz) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }
    axiosClient.delete(`/quizzes/${quiz.id}`)
      .then(() => {
        setNotification("Quiz was successfully deleted");
        getQuizzes();
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-black uppercase tracking-tighter">Quizzes</h1>
        <Link to="/quizzes/new" className="brutalist-button brutalist-button-green text-xl">
          + CREATE NEW QUIZ
        </Link>
      </div>

      {loading && (
        <div className="text-center py-20">
          <span className="brutalist-card bg-yellow-300 text-3xl font-black animate-pulse">LOADING QUIZZES...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className={`brutalist-card brutalist-card-hover ${
                index % 3 === 0 ? 'bg-cyan-300' : index % 3 === 1 ? 'bg-pink-300' : 'bg-lime-300'
              } flex flex-col h-full`}
            >
              <h3 className="font-black text-2xl mb-2 uppercase tracking-tight">{quiz.title}</h3>
              <p className="font-bold text-black/70 mb-6 flex-grow">{quiz.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t-4 border-black">
                <Link to={`/quizzes/${quiz.id}`} className="brutalist-button brutalist-button-blue py-1 text-sm">
                  PLAY NOW
                </Link>
                <button onClick={() => onDelete(quiz)} className="brutalist-button brutalist-button-red py-1 text-sm">
                  DELETE
                </button>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <div className="col-span-full brutalist-card bg-white text-center py-10">
              <p className="text-2xl font-black italic">NO QUIZZES FOUND. BE THE FIRST TO CREATE ONE!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
