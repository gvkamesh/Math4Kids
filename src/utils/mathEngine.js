export class MathKnowledgeBase {
  static generateQuestion(grade, level, selectedModules = ['Addition']) {
    let maxNum;
    if (grade === 'Kindergarten') {
      maxNum = 5 + (level - 1) * 3;
    } else {
      maxNum = 10 + (level - 1) * 7;
    }

    // Determine operations based on selected modules
    const operations = [];
    if (selectedModules.includes('Addition')) operations.push('+');
    if (selectedModules.includes('Subtraction')) operations.push('-');
    if (selectedModules.includes('Multiplication')) operations.push('*');
    if (selectedModules.includes('Division')) operations.push('/');

    // Fallback if none are selected
    if (operations.length === 0) operations.push('+');

    const op = operations[Math.floor(Math.random() * operations.length)];

    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;

    // Difficulty label logic based on maxNum
    let difficulty = 'Easy';
    if (maxNum > 15 && maxNum <= 30) difficulty = 'Medium';
    else if (maxNum > 30 && maxNum <= 50) difficulty = 'Hard';
    else if (maxNum > 50) difficulty = 'Very Hard';

    // Constraint rules based on operation
    if (op === '-') {
      if (b > a) {
        const temp = a;
        a = b;
        b = temp;
      }
    } else if (op === '*') {
      // Keep multiplication numbers manageable
      a = Math.floor(Math.random() * (Math.sqrt(maxNum) + 2)) + 1;
      b = Math.floor(Math.random() * (Math.sqrt(maxNum) + 2)) + 1;
    } else if (op === '/') {
      // For division, generate manageable multiplication first
      b = Math.floor(Math.random() * (Math.sqrt(maxNum) + 2)) + 1;
      const result = Math.floor(Math.random() * (Math.sqrt(maxNum) + 2)) + 1;
      a = b * result; // Ensure a is divisible by b cleanly
    }

    const questionText = `${a} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${b} = ?`;
    let answer;
    if (op === '+') answer = a + b;
    if (op === '-') answer = a - b;
    if (op === '*') answer = a * b;
    if (op === '/') answer = a / b;

    return {
      text: questionText,
      answer: answer,
      a,
      b,
      op,
      difficulty
    };
  }
}
