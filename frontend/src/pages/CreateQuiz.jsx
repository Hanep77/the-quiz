import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import QuizForm from "../components/QuizForm";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = (quizData) => {
    setLoading(true);
    axiosClient.post("/quizzes", quizData)
      .then(() => {
        setNotification("Quiz created successfully");
        navigate("/dashboard"); // Fixed redirect to dashboard
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">Create Quiz</h1>
      <QuizForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
}
