import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import QuizForm from "../components/QuizForm";

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/quizzes/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setQuiz(data.data);
      })
      .catch(() => {
        setLoading(false);
        navigate('/dashboard'); // Redirect if not found or unauthorized
      });
  }, [id, navigate]);

  const onSubmit = (quizData) => {
    setLoading(true);
    axiosClient.put(`/quizzes/${id}`, quizData)
      .then(() => {
        setNotification("Quiz updated successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
            console.log(response.data.errors);
            alert("Validation failed. Please check your inputs.");
        }
        setLoading(false);
      });
  };

  if (!quiz) return (
      <div className="text-center py-20">
          <span className="brutalist-card bg-yellow-300 text-3xl font-black animate-pulse">LOADING...</span>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">Edit Quiz</h1>
      <QuizForm initialData={quiz} onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
