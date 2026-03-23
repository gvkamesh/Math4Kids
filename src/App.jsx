import { useState, useEffect } from 'react'
import { MathKnowledgeBase } from './utils/mathEngine'
import confetti from 'canvas-confetti'

function App() {
  const [grade, setGrade] = useState(null)
  const [level, setLevel] = useState(1)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  
  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // 'correct', 'incorrect', null

  // Generate a new problem when level or grade changes, or after answer
  const generateNewProblem = () => {
    if (!grade) return;
    const newProblem = MathKnowledgeBase.generateQuestion(grade, level);
    setProblem(newProblem);
    setUserAnswer('');
    setFeedback(null);
  }

  // Initialize first problem when grade is selected
  useEffect(() => {
    if (grade) {
      // Reset stats if they change grade
      setLevel(1);
      setCorrectStreak(0);
      setScore({ correct: 0, incorrect: 0 });
      setProblem(MathKnowledgeBase.generateQuestion(grade, 1));
    }
  }, [grade])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  }

  const submitAnswer = () => {
    if (!userAnswer || !problem) return;
    
    const isCorrect = parseInt(userAnswer, 10) === problem.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2ECC71', '#FFE66D', '#4ECDC4']
      });

      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);

      // Level up every 3 correct answers!
      if (newStreak >= 3) {
        setTimeout(() => {
          setLevel(l => l + 1);
          setCorrectStreak(0);
          confetti({ particleCount: 150, spread: 100, colors: ['#FF6B6B', '#4ECDC4'] });
        }, 1500);
      } else {
        setTimeout(generateNewProblem, 1500);
      }

    } else {
      setFeedback('incorrect');
      setScore(s => ({ ...s, incorrect: s.incorrect + 1 }));
      setCorrectStreak(0); // Reset streak
      
      setTimeout(() => {
        setFeedback(null); // Let them try again
        setUserAnswer('');
      }, 1500);
    }
  }

  const handleNumberClick = (num) => {
    setUserAnswer(prev => prev + num);
  }

  const handleClear = () => {
    setUserAnswer('');
  }

  if (!grade) {
    return (
      <div className="text-center p-8 max-w-2xl bg-white rounded-3xl shadow-xl w-[90%] md:w-[600px] border-4 border-dashed border-[#4ECDC4]">
        <h1 className="text-5xl font-bold mb-8 text-[#FF6B6B] drop-shadow-sm">Math Kids!</h1>
        <p className="text-2xl text-[var(--color-text)] mb-8 font-semibold">Choose your grade to start playing:</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            className="kid-button bg-[#FFE66D] text-[#2C3E50] text-3xl font-bold py-6 px-10 rounded-2xl border-b-8 border-[#F3C13A]"
            onClick={() => setGrade('Kindergarten')}
          >
            🧩 Kindergarten
          </button>
          <button 
             className="kid-button bg-[#4ECDC4] text-white text-3xl font-bold py-6 px-10 rounded-2xl border-b-8 border-[#3BA9A2]"
            onClick={() => setGrade('1st Grade')}
          >
            🚀 1st Grade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4 py-8">
      {/* Header / ScoreBoard */}
      <div className="w-full flex justify-between items-center bg-white p-4 rounded-2xl shadow-lg border-2 border-[var(--color-secondary)] mb-8">
        <div className="text-xl font-bold text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setGrade(null)}>
          ⬅️ Change Grade
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-center">
            <span className="text-3xl">⭐</span>
            <span className="text-2xl font-bold text-[var(--color-success)]">{score.correct}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl">❌</span>
            <span className="text-2xl font-bold text-[var(--color-error)]">{score.incorrect}</span>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#FF6B6B] bg-[#FFE66D] px-6 py-2 rounded-full shadow-sm">
          Level {level}
        </div>
      </div>

      {/* Main Play Area */}
      <div className={`bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl flex flex-col items-center border-t-8 ${feedback === 'correct' ? 'border-[var(--color-success)] animate-pop' : feedback === 'incorrect' ? 'border-[var(--color-error)] animate-shake' : 'border-[var(--color-primary)]'}`}>
        
        {/* Status Message */}
        <h2 className="text-3xl font-bold h-10 mb-6 text-center">
          {feedback === 'correct' && <span className="text-[var(--color-success)]">🎉 Awesome Job! 🎉</span>}
          {feedback === 'incorrect' && <span className="text-[var(--color-error)]">Oops! Try Again! 🤔</span>}
          {!feedback && <span className="text-gray-600">Solve the puzzle!</span>}
        </h2>

        {/* Math Problem */}
        {problem && (
          <div className="text-7xl md:text-8xl font-black text-[#2C3E50] mb-10 flex gap-4 drop-shadow-md tracking-wider">
            <span>{problem.a}</span>
            <span className="text-[#FF6B6B]">{problem.op}</span>
            <span>{problem.b}</span>
            <span className="text-[#4ECDC4]">=</span>
            <span className={`bg-gray-100 px-6 py-2 rounded-2xl min-w-[120px] text-center border-4 ${feedback === 'correct' ? 'border-[var(--color-success)] text-[var(--color-success)]' : feedback === 'incorrect' ? 'border-[var(--color-error)] text-[var(--color-error)]' : 'border-gray-200'} transition-colors`}>
              {userAnswer || '?'}
            </span>
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm mb-6">
          {[1,2,3,4,5,6,7,8,9].map(num => (
            <button 
              key={num} 
              onClick={() => handleNumberClick(num.toString())}
              disabled={!!feedback}
              className="kid-button bg-[#ECF0F1] hover:bg-[#D5D8DC] text-4xl font-bold py-4 rounded-2xl shadow-sm text-[#2C3E50]"
            >
              {num}
            </button>
          ))}
          <button 
            onClick={handleClear}
            disabled={!!feedback}
            className="kid-button bg-[#FF6B6B] hover:bg-[#E74C3C] text-2xl font-bold py-4 rounded-2xl shadow-sm text-white"
          >
            Clear
          </button>
          <button 
            onClick={() => handleNumberClick('0')}
            disabled={!!feedback}
            className="kid-button bg-[#ECF0F1] hover:bg-[#D5D8DC] text-4xl font-bold py-4 rounded-2xl shadow-sm text-[#2C3E50]"
          >
            0
          </button>
          <button 
            onClick={submitAnswer}
            disabled={!!feedback || !userAnswer}
            className="kid-button bg-[#2ECC71] hover:bg-[#27AE60] text-3xl font-bold py-4 rounded-2xl shadow-sm text-white disabled:opacity-50 disabled:transform-none"
          >
            Go!
          </button>
        </div>

      </div>

      {/* Footer message */}
      <div className="mt-8 text-xl font-bold text-gray-500">
        Get 3 stars ⭐ in a row to level up!
      </div>
    </div>
  )
}

export default App
