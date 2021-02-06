import React, { useState } from 'react';
import QuestionCard from "./components/questionCard"
import { fetchQuizQuestions, Difficulty, QuestionState }  from "./api"
import "./style.css"

const TOTAL_QUESTIONS = 10

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string
}

function App() {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<QuestionState[]>([])
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  const startQuiz = async() => {
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
    console.log(newQuestions)
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      // user answer 
      const answer  = e.currentTarget.value;
      // check answer against correct answer 
      const correct = questions[number].correct_answer === answer;
      // add score if answer is correct
      if (correct) setScore(prev => prev + 1 );
      // save answer in the array for user answers 
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers((prev) => [...prev, answerObject])
    }

  }

  const nextQuestion = () => {
    // move on to the next question
    const nextQuestion = number + 1 

    if( nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true)
    } else {
      setNumber(nextQuestion)
    }
  }

  return (
    <div className="App">
      <h1>
        Quiz
      </h1>
      { gameOver || userAnswers.length === TOTAL_QUESTIONS ? 
      <>
        <button type="button" onClick={startQuiz}> Start Quiz </button>
      </> : null 
      }
      { !gameOver &&  <p className="score"> Score: {score} </p> }
      { loading && <p> Loading...</p> }
      { !loading && !gameOver && 
        <QuestionCard 
          questionNr={number + 1}
          totalQuestions={ TOTAL_QUESTIONS }
          question={questions[number].question}
          answer={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      }
      {!gameOver && !loading && userAnswers.length === number + 1  && number !== TOTAL_QUESTIONS &&
        <button className="next" onClick={nextQuestion}> Next </button>
      }
      </div>
  );
}

export default App;
