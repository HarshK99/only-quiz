import { Question, Quiz } from '../types/quiz';

// Mock question database - in a real app, this would come from an API or AI service
const questionTemplates: Record<string, Question[]> = {
  javascript: [
    {
      id: 1,
      text: "What is the correct way to declare a variable in modern JavaScript?",
      options: ["var myVar = 'hello'", "let myVar = 'hello'", "variable myVar = 'hello'", "declare myVar = 'hello'"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Which method is used to add an element to the end of an array?",
      options: ["append()", "push()", "add()", "insert()"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "What does '===' compare in JavaScript?",
      options: ["Value only", "Type only", "Both value and type", "Reference only"],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "Which of the following is NOT a primitive data type in JavaScript?",
      options: ["string", "number", "object", "boolean"],
      correctAnswer: 2
    },
    {
      id: 5,
      text: "What is the result of 'typeof null' in JavaScript?",
      options: ["'null'", "'undefined'", "'object'", "'boolean'"],
      correctAnswer: 2
    },
    {
      id: 6,
      text: "Which method is used to convert a string to uppercase?",
      options: ["toUpper()", "upperCase()", "toUpperCase()", "upper()"],
      correctAnswer: 2
    },
    {
      id: 7,
      text: "What is the correct way to write a JavaScript function?",
      options: ["function myFunction() {}", "function = myFunction() {}", "def myFunction() {}", "func myFunction() {}"],
      correctAnswer: 0
    },
    {
      id: 8,
      text: "Which operator is used to assign a value to a variable?",
      options: ["*", "=", "==", "==="],
      correctAnswer: 1
    },
    {
      id: 9,
      text: "What is the correct way to create an object in JavaScript?",
      options: ["var obj = {}", "var obj = []", "var obj = new Object{}", "var obj = object()"],
      correctAnswer: 0
    },
    {
      id: 10,
      text: "Which method is used to remove the last element from an array?",
      options: ["removeLast()", "pop()", "delete()", "slice()"],
      correctAnswer: 1
    }
  ],
  'world history': [
    {
      id: 1,
      text: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1
    },
    {
      id: 2,
      text: "Who was the first person to walk on the moon?",
      options: ["Buzz Aldrin", "John Glenn", "Neil Armstrong", "Alan Shepard"],
      correctAnswer: 2
    },
    {
      id: 3,
      text: "The Berlin Wall fell in which year?",
      options: ["1987", "1988", "1989", "1990"],
      correctAnswer: 2
    },
    {
      id: 4,
      text: "Which empire was ruled by Julius Caesar?",
      options: ["Greek Empire", "Roman Empire", "Byzantine Empire", "Ottoman Empire"],
      correctAnswer: 1
    },
    {
      id: 5,
      text: "The American Revolution began in which year?",
      options: ["1773", "1775", "1776", "1777"],
      correctAnswer: 1
    },
    {
      id: 6,
      text: "Who painted the ceiling of the Sistine Chapel?",
      options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
      correctAnswer: 2
    },
    {
      id: 7,
      text: "The French Revolution began in which year?",
      options: ["1789", "1790", "1791", "1792"],
      correctAnswer: 0
    },
    {
      id: 8,
      text: "Which explorer is credited with discovering America in 1492?",
      options: ["Amerigo Vespucci", "Christopher Columbus", "Vasco da Gama", "Ferdinand Magellan"],
      correctAnswer: 1
    },
    {
      id: 9,
      text: "The Great Wall of China was primarily built during which dynasty?",
      options: ["Tang Dynasty", "Song Dynasty", "Ming Dynasty", "Qing Dynasty"],
      correctAnswer: 2
    },
    {
      id: 10,
      text: "Which ancient wonder of the world was located in Alexandria?",
      options: ["Hanging Gardens", "Lighthouse of Alexandria", "Colossus of Rhodes", "Statue of Zeus"],
      correctAnswer: 1
    }
  ],
  science: [
    {
      id: 1,
      text: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2
    },
    {
      id: 2,
      text: "How many bones are in the adult human body?",
      options: ["204", "206", "208", "210"],
      correctAnswer: 1
    },
    {
      id: 3,
      text: "What is the speed of light in a vacuum?",
      options: ["299,792,458 m/s", "300,000,000 m/s", "298,000,000 m/s", "301,000,000 m/s"],
      correctAnswer: 0
    },
    {
      id: 4,
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      id: 5,
      text: "What is the most abundant gas in Earth's atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correctAnswer: 2
    },
    {
      id: 6,
      text: "What is the smallest unit of matter?",
      options: ["Molecule", "Atom", "Electron", "Proton"],
      correctAnswer: 1
    },
    {
      id: 7,
      text: "How many chambers does a human heart have?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 2
    },
    {
      id: 8,
      text: "What is the hardest natural substance on Earth?",
      options: ["Steel", "Diamond", "Quartz", "Titanium"],
      correctAnswer: 1
    },
    {
      id: 9,
      text: "Which organelle is known as the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
      correctAnswer: 2
    },
    {
      id: 10,
      text: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "CH4"],
      correctAnswer: 0
    }
  ]
};

// Generic questions for topics not in our database
const generateGenericQuestions = (topic: string): Question[] => {
  const genericTemplates = [
    {
      text: `Which of the following is most commonly associated with ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0
    },
    {
      text: `What is a fundamental concept in ${topic}?`,
      options: ["Basic principle", "Advanced theory", "Complex methodology", "Simple approach"],
      correctAnswer: 0
    },
    {
      text: `In the context of ${topic}, what is most important?`,
      options: ["Understanding basics", "Memorizing facts", "Following trends", "Avoiding mistakes"],
      correctAnswer: 0
    },
    {
      text: `Which approach is recommended when studying ${topic}?`,
      options: ["Systematic learning", "Random exploration", "Avoiding practice", "Skipping fundamentals"],
      correctAnswer: 0
    },
    {
      text: `What is a common misconception about ${topic}?`,
      options: ["It's too difficult", "It's not practical", "It's outdated", "It's only for experts"],
      correctAnswer: 0
    },
    {
      text: `When learning ${topic}, what should you focus on first?`,
      options: ["Core concepts", "Advanced topics", "Obscure details", "Historical context"],
      correctAnswer: 0
    },
    {
      text: `Which resource is most valuable for ${topic}?`,
      options: ["Expert guidance", "Random articles", "Outdated books", "Unverified sources"],
      correctAnswer: 0
    },
    {
      text: `What is the best way to practice ${topic}?`,
      options: ["Regular application", "Occasional review", "Passive reading", "Avoiding challenges"],
      correctAnswer: 0
    },
    {
      text: `In ${topic}, what leads to mastery?`,
      options: ["Consistent practice", "Natural talent only", "Luck", "Avoiding difficulty"],
      correctAnswer: 0
    },
    {
      text: `What is essential for success in ${topic}?`,
      options: ["Dedication and effort", "Perfect conditions", "Expensive tools", "Immediate results"],
      correctAnswer: 0
    }
  ];

  return genericTemplates.map((template, index) => ({
    id: index + 1,
    text: template.text,
    options: template.options,
    correctAnswer: template.correctAnswer
  }));
};

export function generateQuiz(topic: string): Quiz {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check if we have specific questions for this topic
  let questions: Question[] = [];
  
  if (questionTemplates[normalizedTopic]) {
    questions = [...questionTemplates[normalizedTopic]];
  } else {
    // Check for partial matches
    const matchingKey = Object.keys(questionTemplates).find(key => 
      normalizedTopic.includes(key) || key.includes(normalizedTopic)
    );
    
    if (matchingKey) {
      questions = [...questionTemplates[matchingKey]];
    } else {
      // Generate generic questions
      questions = generateGenericQuestions(topic);
    }
  }

  // Shuffle questions and take 10
  const shuffledQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((q, index) => ({ ...q, id: index + 1 }));

  return {
    topic,
    questions: shuffledQuestions
  };
}

export function calculateScore(questions: Question[], userAnswers: number[]): number {
  return questions.reduce((score, question, index) => {
    const userAnswer = userAnswers[index];
    return userAnswer === question.correctAnswer ? score + 1 : score;
  }, 0);
}