import React, { useRef, useState, useEffect } from "react";
import "./Quiz.css";

// State Variables
const Quiz = () => {
  let [questions, setQuestions] = useState([]);
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(null);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [result, setResult] = useState(false);

//   Reference for each option to manipulate their classes
  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let option_array = [Option1, Option2, Option3, Option4];

  useEffect(() => {
    fetch("https://my-json-server.typicode.com/tracychemtai/phase-2-project-quiz-app/results")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setQuestion(data[index]);
      })
      .catch((error) => console.error(error));
  }, []);

  const checkAns = (e, ans) => {
    if (lock === false) {
      const selectedAnswer = e.target.textContent;
      if (selectedAnswer === question.correct_answer) {
        e.target.classList.add("correct");
        setLock(true);
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        setLock(true);
        option_array.forEach((optionRef) => {
          if (optionRef.current.textContent === question.correct_answer) {
            optionRef.current.classList.add("correct");
          }
        });
      }
    }
  };

  const next = () => {
    if (lock === true) {
      if (index === questions.length - 1) {
        setResult(true);
        return;
      }
      setIndex((prev) => prev + 1);
      setQuestion(questions[index + 1]);
      setLock(false);
      option_array.forEach((option) => {
        option.current.classList.remove("wrong");
        option.current.classList.remove("correct");
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(questions[0]);
    setScore(0);
    setLock(false);
    setResult(false);
  };

  return (
    <div className="container">
      <h1>Quiz App</h1>
      <hr />
      {result ? (
        <>
          <h3>
            You Scored {score} out of {questions.length}
          </h3>
          <button onClick={reset}>Reset</button>
        </>
      ) : (
        <>
          <h3>
            {index + 1}. {question?.question}
          </h3>
          <ul>
            {question?.incorrect_answers
              .concat(question?.correct_answer)
              .map((answer, idx) => (
                <li
                  key={idx}
                  ref={option_array[idx]}
                  onClick={(e) => {
                    checkAns(e, idx + 1);
                  }}
                >
                  {answer}
                </li>
              ))}
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">
            {index + 1} of {questions.length} questions
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;