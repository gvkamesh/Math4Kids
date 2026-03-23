export class MathKnowledgeBase {
  static generateQuestion(grade, level) {
    // Determine max number based on grade and level
    // level starts at 1
    // Kindergarden: base 5, +2 per level
    // 1st Grade: base 10, +5 per level
    
    let maxNum;
    if (grade === 'Kindergarten') {
      maxNum = 5 + (level - 1) * 2;
    } else {
      maxNum = 10 + (level - 1) * 5;
    }

    // Operations: Addition and Subtraction
    const operations = ['+', '-'];
    const op = operations[Math.floor(Math.random() * operations.length)];

    let a = Math.floor(Math.random() * maxNum) + 1;
    let b = Math.floor(Math.random() * maxNum) + 1;

    // Ensure subtraction doesn't result in negative numbers for young kids
    if (op === '-' && b > a) {
      const temp = a;
      a = b;
      b = temp;
    }
    
    // For addition, we might want to keep the sum under maxNum * 1.5 roughly
    // Kids in these grades prefer nice whole numbers

    const questionText = `${a} ${op} ${b} = ?`;
    let answer;
    if (op === '+') answer = a + b;
    if (op === '-') answer = a - b;

    return {
      text: questionText,
      answer: answer,
      a,
      b,
      op
    };
  }
}
