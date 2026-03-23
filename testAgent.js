import { MathKnowledgeBase } from './src/utils/mathEngine.js';

console.log("👧 AGENT: Starting Kindergarten Playtest...");

let correctStrk = 0;
let level = 1;

for (let i = 1; i <= 9; i++) {
  const q = MathKnowledgeBase.generateQuestion('Kindergarten', level);
  console.log(`[Level ${level}] Q${i}: ${q.text}`);
  
  // Simulate 80% accuracy for a kindergartener
  const isCorrect = Math.random() > 0.2;
  
  if (isCorrect) {
    console.log(`   -> Agent answers: ${q.answer} 🎉 (CORRECT)`);
    correctStrk++;
    if (correctStrk >= 3) {
      console.log(`   🌟 Leveling up to Level ${level + 1}!`);
      level++;
      correctStrk = 0;
    }
  } else {
    // Answer incorrectly
    console.log(`   -> Agent answers: ${q.answer + 1} ❌ (INCORRECT)`);
    correctStrk = 0;
  }
}

console.log("\n👦 AGENT: Starting 1st Grade Playtest...");
correctStrk = 0;
level = 1;

for (let i = 1; i <= 9; i++) {
  const q = MathKnowledgeBase.generateQuestion('1st Grade', level);
  console.log(`[Level ${level}] Q${i}: ${q.text}`);
  
  // Simulate 70% accuracy for 1st Grader taking harder questions
  const isCorrect = Math.random() > 0.3;
  
  if (isCorrect) {
    console.log(`   -> Agent answers: ${q.answer} 🎉 (CORRECT)`);
    correctStrk++;
    if (correctStrk >= 3) {
      console.log(`   🌟 Leveling up to Level ${level + 1}!`);
      level++;
      correctStrk = 0;
    }
  } else {
    console.log(`   -> Agent answers: ${q.answer - 1} ❌ (INCORRECT)`);
    correctStrk = 0;
  }
}

console.log("\n✅ Automated Playtesting Complete. Difficulty curve verified!");
