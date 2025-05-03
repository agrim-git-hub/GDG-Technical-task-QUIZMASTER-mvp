import React, { useState, useEffect } from 'react';
import './App.css';

const questions = [
  {question: "What is the capital of India?",
  options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
  answer: "Delhi"},
  {
    question: "What is 5 x 2?",
    options: ["12", "10", "15", "8"],answer: "10"
  },
  { question: "Which of these is a JavaScript framework?",
    options: ["Laravel", "React", "Django", "Flask"],
  answer: "React"},
  {
    question: "Which tag is used for the largest heading in HTML?",
    options: ["<h1>", "<h6>", "<header>", "<head>"],
    answer: "<h1>"},
  {
    question: "Which color code is for white in HEX?",
    options: ["#000000", "#FFFFFF", "#FF0000", "#00FF00"],answer: "#FFFFFF"
  },{
    question: "Which company developed React?",
    options: ["Google", "Microsoft", "Facebook", "Amazon"],answer: "Facebook"
  },
  {question: "What does CSS stand for?",
   options: ["Creative Style Sheet", "Cascading Style Sheet", "Computer Style Sheet", "Colorful Style Sheet"],
   answer: "Cascading Style Sheet"},
  {question: "Which method is used to output data in JavaScript?",
  options: ["print()", "log()", "console.log()", "echo()"], answer: "console.log()"},
  { question: "How do you write a comment in CSS?",
  options: ["// comment", "# comment", "/* comment */", "-- comment --"], 
  answer: "/* comment */"},
  {question: "Which symbol is used for IDs in CSS?",
   options: [".", "*", "#", "&"],answer: "#"}
];

function App() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(""));
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); 
  const [answeredCount, setAnsweredCount] = useState(0); 

  useEffect(() => {
    if (!showStart && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft -1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft ===0) {
      setShowResult(true);
    }
  }, [timeLeft, showStart, showResult]);

  function handleSubmit() {
    if (selected === "") return;

    setUserAnswers(prev => {
      const updated = [...prev];
      updated[current] = selected;
      return updated;
    });

    const isCorrect = selected === questions[current].answer;

    setShowFeedback(true);
    setFeedbackText(isCorrect ? 'Correct!' : 'Incorrect!');
    setFeedbackType(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      if (isCorrect) {
       setScore(prev => prev +1);
      }

      setAnsweredCount(prev => prev +1);
      setShowFeedback(false);

      if (current +1 < questions.length) {
         setCurrent(prev => prev +1);
        setSelected("");
      } else {
        setShowResult(true);
      }
    }, 1500);
  }

  function restartQuiz() {
    setCurrent(0);
     setScore(0);
    setSelected("");
    setShowResult(false);
    setShowStart(true);
    setTimeLeft(300); 
    setAnsweredCount(0);
    setUserAnswers(Array(questions.length).fill("")); 
  }

  function startQuiz() {
    setShowStart(false);
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds /60);
    const sec = seconds %60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <div className="app-container">
      <h1 className="page-header">General Knowledge Quiz</h1>

      <div className="quiz-container">
        {showStart ? (
          <div className="start-page">
              <h2>Welcome to the Quiz!</h2>
            <p className="description">
              Test your knowledge with 10 questions across various topics.
              You have 5 minutes to finish all questions. Good luck!
              The Progress bar only increases when u answer the question!
            
            </p>
            
            <button className="start-button" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        ) : !showResult ? (
             <div>
            <p className="timer">Time Left: {formatTime(timeLeft)}</p>

            <div className="progress-container">
                <div
                 className="progress-bar"
                style={{
                  width: `${(answeredCount /questions.length)*100}%`,
                }}
              ></div>
            </div>
   
              <h2>{questions[current].question}</h2>
            <form>
              {questions[current].options.map((option, index) => (
                 <label key={index} className="option">
                     <input
                    type="radio"
                    name="answer"
                     value={option}
                       checked={selected ===option}
                     onChange={(e) => setSelected(e.target.value)}
                  />
                  {option}
                </label>
              ))}
            </form>

               <button onClick={handleSubmit}>Submit</button>
            <p>Question {current +1} of {questions.length}</p>
              {showFeedback && (
              <p className={feedbackType}>{feedbackText}</p>
             )}

            <button 
              className="back-btn"
              onClick={() => {
                      if (current >0) {
                  const newIndex = current -1;
                  setCurrent(newIndex);
                    setSelected(userAnswers[newIndex] ||""); 
                  setShowFeedback(false);
                }
              }}
            >
              Back
            </button>

            <button className="skip-btn" onClick={() => {
              setUserAnswers(prev => {
                const updated = [...prev];
                  updated[current] = selected;
                   return updated;
              });
                if (current +1 < questions.length) {
                setCurrent(prev => prev +1);
                setSelected(userAnswers[current +1] || "");
              } else {
                setShowResult(true);
              }
            }}>Skip</button>
          </div>
        ) : (
          <div className="result">
               <h2>Quiz Completed!</h2>
              <p>Your score: {score} / {questions.length}</p>
   
                <div className="review-section">
                {questions.map((q, idx) => {
                     const isCorrect = q.answer === userAnswers[idx];
                  return (
                    <div
                      key={idx}
                      className={`review-question ${isCorrect ? "correct" : "incorrect"}`}
                    >
                         <h4>{idx +1}. {q.question}</h4>
                      <p>
                                   Your Answer: <span>{userAnswers[idx] || "Not answered"}</span>
                      </p>
                      {!isCorrect && (
                      <p>Correct Answer: <span>{q.answer}</span></p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button onClick={restartQuiz}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;