import { useState, useEffect } from 'react'
import { MathKnowledgeBase } from './utils/mathEngine'
import confetti from 'canvas-confetti'
import './index.css'

function App() {
  const [view, setView] = useState('intro') // intro, dashboard, quiz, parent, testResult
  const [userName, setUserName] = useState('')
  const [grade, setGrade] = useState('Kindergarten')
  
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  
  // Track long-term stats for Parent Dashboard
  const [highestStreak, setHighestStreak] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  
  // Test Mode
  const [isTestMode, setIsTestMode] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const TEST_LENGTH = 10;
  
  const [selectedModules, setSelectedModules] = useState(['Addition'])
  const modulesAvailable = [
    { id: 'Addition', icon: '✅', color: 'bg-rose-400' },
    { id: 'Subtraction', icon: '➖', color: 'bg-indigo-400' },
    { id: 'Multiplication', icon: '✖️', color: 'bg-violet-400' },
    { id: 'Division', icon: '➗', color: 'bg-cyan-400' }
  ]

  const gradesAvailable = [
    { id: 'Kindergarten', label: 'KG - 1st Grade', icon: '🎈' },
    { id: '1st Grade', label: '1st - 2nd Grade', icon: '⭐' },
  ]

  const [problem, setProblem] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null) // 'correct', 'incorrect', null

  const XP_PER_LEVEL = 100;

  const loadProblem = () => {
    setProblem(MathKnowledgeBase.generateQuestion(grade, level, selectedModules))
    setUserAnswer('')
    setFeedback(null)
  }

  const handleStartLearning = () => {
    if (userName.trim() === '') return;
    setView('dashboard')
  }

  const toggleModule = (mod) => {
    setSelectedModules(prev => {
      if (prev.includes(mod)) {
        if (prev.length === 1) return prev; // prevent zero modules
        return prev.filter(m => m !== mod)
      }
      return [...prev, mod]
    })
  }

  const startQuiz = () => {
    if (selectedModules.length === 0) return;
    setIsTestMode(false);
    setQuestionsAnswered(0);
    loadProblem()
    setView('quiz')
  }

  const startTest = () => {
    if (selectedModules.length === 0) return;
    setIsTestMode(true);
    setQuestionsAnswered(0);
    setTestScore(0);
    loadProblem()
    setView('quiz')
  }

  const submitAnswer = () => {
    if (!userAnswer || !problem) return;
    
    // Evaluate taking into account integers or floating point for division
    const isCorrect = Math.abs(parseFloat(userAnswer) - problem.answer) < 0.01;
    const totalA = questionsAnswered + 1;
    
    if (isCorrect) {
      setFeedback('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      setQuestionsAnswered(totalA);
      
      setTotalCorrect(t => t + 1);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      if (isTestMode) {
        setTestScore(s => s + 1);
      }
      
      confetti({
        particleCount: Math.min(150, 50 + (newStreak * 10)),
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2ECC71', '#FFE66D', '#4ECDC4']
      });

      const earnedXP = 20 + (newStreak * 5); // Base 20 XP + streak bonus
      const nextXp = xp + earnedXP;
      
      if (isTestMode && totalA >= TEST_LENGTH) {
         setTimeout(() => {
           setView('testResult');
           setFeedback(null);
           setUserAnswer('');
         }, 1000);
      } else if (!isTestMode && nextXp >= XP_PER_LEVEL) {
        // Level up
        setTimeout(() => {
           setLevel(l => l + 1);
           setXp(nextXp - XP_PER_LEVEL);
           confetti({ particleCount: 200, spread: 120, colors: ['#6d28d9', '#f59e0b', '#3b82f6'] });
           loadProblem();
        }, 1200);
      } else {
        if (!isTestMode) setXp(nextXp);
        setTimeout(loadProblem, 1000);
      }
    } else {
      setFeedback('incorrect');
      setStreak(0);
      setQuestionsAnswered(totalA);
      
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        if (isTestMode && totalA >= TEST_LENGTH) {
            setView('testResult');
        }
      }, 1500);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  }

  const Header = () => (
    <div className="bg-violet-700 text-white p-4 shadow-md w-full sticky top-0 z-10 h-[72px]">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center h-full gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => userName && setView('dashboard')}>
          <span className="text-3xl filter drop-shadow">🧙‍♂️</span>
          <h1 className="text-2xl font-bold tracking-wide hidden sm:block">Math Wizard</h1>
        </div>
        
        {view !== 'intro' && (
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
             <div className="flex flex-col items-end">
               <span className="font-semibold">{userName} • {grade}</span>
               <div className="flex items-center gap-2 mt-0.5">
                 <span className="text-yellow-400 font-bold text-xs">⚡ Lv.{level}</span>
                 <div className="w-24 sm:w-32 h-2.5 bg-violet-900 rounded-full overflow-hidden shadow-inner flex">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300 ease-out" style={{ width: `${(xp / XP_PER_LEVEL) * 100}%` }}></div>
                 </div>
                 <span className="text-violet-200 text-xs hidden sm:inline">{xp} XP</span>
               </div>
             </div>
             
             <div className="hidden lg:flex items-center gap-5 font-semibold text-violet-200 text-base">
               <button className="bg-white text-violet-700 px-5 py-2 rounded-xl flex items-center gap-2 shadow-sm font-bold kid-button" onClick={() => setView('dashboard')}>
                 <span className="text-black">🎮</span> Play
               </button>
               <button className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">📊 Progress</button>
               <button className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">⚙️ Settings</button>
               <button onClick={() => setView('parent')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-2">👪 Parent</button>
               <button className="bg-orange-600/80 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg transition-colors ml-4" onClick={() => setView('intro')}>Logout</button>
             </div>
          </div>
        )}
      </div>
    </div>
  )

  const IntroView = () => (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-10 w-full max-w-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
        <div className="flex flex-col items-center mb-8">
          <span className="text-5xl mb-4">🧙‍♂️</span>
          <h2 className="text-3xl font-bold text-violet-700 text-center">Math Wizard</h2>
          <p className="text-gray-500 text-sm mt-2">Learn math the fun way with AI!</p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow text-gray-800 font-medium"
              placeholder="e.g. Alex"
              onKeyPress={e => e.key === 'Enter' && handleStartLearning()}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Grade</label>
            <select 
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 font-medium appearance-none cursor-pointer"
            >
              {gradesAvailable.map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleStartLearning}
            disabled={!userName.trim()}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 mt-4 text-lg kid-button flex items-center justify-center gap-2"
          >
            🚀 Start Learning!
          </button>
        </div>
      </div>
    </div>
  )

  const DashboardView = () => (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-8 w-full max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col items-center text-center mb-10 mt-4">
        <h2 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3">
          📚 Choose Your Modules
        </h2>
        <p className="text-gray-600 mt-2 text-lg">Hi {userName}! Select a grade & modules 👋</p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            🎓 Select Your Grade
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {gradesAvailable.map(g => (
              <div 
                key={g.id}
                onClick={() => setGrade(g.id)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${grade === g.id ? 'border-rose-400 bg-rose-400 text-white shadow-md' : 'border-gray-200 bg-white hover:border-violet-300'}`}
              >
                <div className="text-2xl mb-1">{g.icon}</div>
                <div className="font-bold text-sm">{g.id}</div>
                <div className={`text-xs ${grade === g.id ? 'text-rose-100' : 'text-gray-500 mt-1'}`}>{g.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
               📚 Modules for {grade}
             </h3>
             <div className="flex gap-2">
               <button onClick={() => setSelectedModules(modulesAvailable.map(m => m.id))} className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"><span>✅</span> All</button>
               <button onClick={() => setSelectedModules(['Addition'])} className="bg-rose-500 hover:bg-rose-400 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors"><span>❌</span> Clear</button>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {modulesAvailable.map(mod => {
              const isActive = selectedModules.includes(mod.id);
              return (
                <div 
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all kid-button h-32 flex flex-col justify-end ${isActive ? `border-rose-400 ${mod.color} text-white shadow-lg` : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                   {isActive && (
                     <div className="absolute top-3 left-3 bg-white w-6 h-6 rounded flex items-center justify-center">
                        <span className="text-green-500 text-sm">✓</span>
                     </div>
                   )}
                   <div className={`text-2xl absolute top-3 ${isActive ? 'right-3' : 'left-3'}`}>{mod.icon}</div>
                   <div>
                     <div className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-800'}`}>{mod.id}</div>
                     <div className={`text-xs font-semibold ${isActive ? 'text-white/80' : 'text-gray-500'}`}>5 topics</div>
                   </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={startQuiz}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-md text-xl flex items-center justify-center gap-2 kid-button w-full"
        >
           🎯 Play
        </button>
        <button 
          onClick={startTest}
          className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-8 rounded-2xl shadow-md text-xl flex items-center justify-center gap-2 kid-button w-full transition-colors"
        >
           📝 Test ({TEST_LENGTH} Qs)
        </button>
      </div>
    </div>
  )

  const QuizView = () => {
    if (!problem) return null;

    const diffColors = {
      Easy: 'bg-emerald-500',
      Medium: 'bg-amber-500',
      Hard: 'bg-orange-500',
      'Very Hard': 'bg-rose-600'
    }
    const diffColor = diffColors[problem.difficulty] || 'bg-gray-500';

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300 w-full relative">
        <div className={`bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 md:p-10 w-full max-w-2xl border-b-8 relative overflow-hidden ${feedback === 'correct' ? 'border-emerald-500 bg-emerald-50/50' : feedback === 'incorrect' ? 'border-rose-500 bg-rose-50/50 animate-shake' : 'border-violet-600'}`}>
           
           <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
             <div className="flex items-center gap-2 text-gray-600 font-semibold">
               <span>Operation: <span className="text-violet-700">{selectedModules.join(', ')}</span></span>
               <div className={`${diffColor} text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 ml-2`}>
                 📊 {problem.difficulty}
               </div>
             </div>
             <button onClick={() => setView('dashboard')} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
               End Session
             </button>
           </div>

           <div className="text-center font-bold text-gray-500 mb-6">
              {isTestMode ? `Test Question: ${questionsAnswered + 1} / ${TEST_LENGTH}` : `Questions: ${questionsAnswered + 1} | Streak: ${streak} 🔥`}
           </div>

           <div className={`text-6xl md:text-[5rem] font-extrabold text-center mb-10 tracking-wider text-slate-800 flex justify-center items-center gap-4 ${feedback === 'correct' ? 'animate-pop text-emerald-600' : ''}`}>
             <span>{problem.a}</span>
             <span className={problem.op === '+' ? 'text-rose-400' : problem.op === '-' ? 'text-indigo-400' : 'text-violet-400'}>{problem.op === '*' ? '×' : problem.op === '/' ? '÷' : problem.op}</span>
             <span>{problem.b}</span>
             <span className="text-slate-400">=</span>
             <span className="text-violet-600">?</span>
           </div>

           <div className="max-w-md mx-auto relative group">
             <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Your Answer:</label>
             <input 
               type="number" 
               inputMode="numeric"
               value={userAnswer}
               onChange={e => setUserAnswer(e.target.value)}
               onKeyPress={handleKeyPress}
               disabled={!!feedback}
               className={`w-full px-6 py-5 text-2xl md:text-3xl text-center bg-gray-50 rounded-2xl border-2 font-bold focus:outline-none transition-all ${feedback === 'correct' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : feedback === 'incorrect' ? 'border-rose-500 text-rose-600 bg-rose-50' : 'border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 text-slate-800'}`}
               placeholder="Enter answer"
               autoFocus
             />
             
             {feedback === 'correct' && (
               <div className="absolute top-12 -right-4 md:-right-12 text-3xl animate-bounce">
                  ✨
               </div>
             )}
             {feedback === 'incorrect' && (
               <div className="absolute top-12 -right-4 md:-right-12 text-3xl animate-shake">
                  ❌
               </div>
             )}
           </div>

           <div className="mt-8 max-w-md mx-auto">
             <button 
               onClick={submitAnswer}
               disabled={!userAnswer || !!feedback}
               className={`w-full font-bold py-4 rounded-2xl text-xl shadow-md transition-all flex items-center justify-center kid-button disabled:opacity-50 disabled:transform-none ${feedback === 'correct' ? 'bg-emerald-500 text-white' : feedback === 'incorrect'? 'bg-rose-500 text-white' : 'bg-emerald-400 hover:bg-emerald-500 text-white'}`}
             >
               {feedback === 'correct' ? 'Correct!' : feedback === 'incorrect' ? 'Try Again' : 'Submit Answer ✓'}
             </button>
           </div>
        </div>
      </div>
    )
  }

  const ParentView = () => (
    <div className="flex-1 flex flex-col items-center p-4 sm:p-8 animate-in fade-in max-w-4xl mx-auto w-full">
      <h2 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3 mb-8 mt-4">
        👪 Parent Dashboard
      </h2>
      <div className="bg-white rounded-[2rem] p-8 shadow-xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6 text-center border-t-8 border-violet-500">
        <div className="bg-violet-50 p-8 rounded-2xl border border-violet-100">
          <div className="text-5xl mb-3">⚡</div>
          <div className="text-4xl font-black text-violet-700">{level}</div>
          <div className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-wide">Current Level</div>
        </div>
        <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
          <div className="text-5xl mb-3">⭐</div>
          <div className="text-4xl font-black text-amber-600">{xp}</div>
          <div className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-wide">Current XP</div>
        </div>
        <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
          <div className="text-5xl mb-3">🎯</div>
          <div className="text-4xl font-black text-emerald-600">{highestStreak}</div>
          <div className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-wide">Highest Streak</div>
        </div>
        <div className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
          <div className="text-5xl mb-3">✅</div>
          <div className="text-4xl font-black text-rose-600">{totalCorrect}</div>
          <div className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-wide">Total Correct</div>
        </div>
      </div>
      <button onClick={() => setView('dashboard')} className="mt-10 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-10 rounded-2xl transition-all shadow-sm kid-button text-lg">
        Back to Dashboard
      </button>
    </div>
  )

  const TestResultView = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-4 animate-in zoom-in">
      <div className="bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border-t-8 border-amber-500 relative overflow-hidden">
         <div className="text-7xl mb-6">{testScore >= 8 ? '🏆' : testScore >= 5 ? '👍' : '📚'}</div>
         <h2 className="text-3xl font-black text-gray-800 mb-2">Test Complete!</h2>
         <p className="text-gray-500 font-medium mb-8">You answered {TEST_LENGTH} questions.</p>
         
         <div className="text-6xl font-black text-amber-500 mb-8">
            {testScore} <span className="text-3xl text-gray-300">/ {TEST_LENGTH}</span>
         </div>
         
         <button onClick={() => setView('dashboard')} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 px-8 rounded-2xl shadow-md transition-all kid-button text-xl">
           Continue Learning
         </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-[#eceffd] font-['Inter',sans-serif] text-slate-800 relative">
      <Header />
      
      {view === 'intro' && IntroView()}
      {view === 'dashboard' && DashboardView()}
      {view === 'quiz' && QuizView()}
      {view === 'parent' && ParentView()}
      {view === 'testResult' && TestResultView()}

      {/* Footer */}
      {(view === 'dashboard' || view === 'quiz' || view === 'parent' || view === 'testResult') && (
        <div className="bg-[#111827] text-gray-400 py-6 text-center text-sm w-full mt-auto">
          <div>© 2026 Math Wizard. Made with 💙 for curious minds.</div>
          <div className="mt-1">Keep your learning streak alive! 🔥</div>
        </div>
      )}
    </div>
  )
}

export default App
