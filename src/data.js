export const initialQuestions = [
  { id: 1, title: "Two Sum", topic: "Arrays", difficulty: "Easy", status: "Solved", link: "https://leetcode.com/problems/two-sum/" },
  { id: 2, title: "Move Zeroes", topic: "Arrays", difficulty: "Easy", status: "Solved", link: "https://leetcode.com/problems/move-zeroes/" },
  { id: 3, title: "Valid Anagram", topic: "Strings", difficulty: "Easy", status: "In Progress", link: "https://leetcode.com/problems/valid-anagram/" },
  { id: 4, title: "Maximum Subarray", topic: "Greedy", difficulty: "Medium", status: "Not Started", link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: 5, title: "Reverse Linked List", topic: "Linked Lists", difficulty: "Easy", status: "Not Started", link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 6, title: "Binary Tree Level Order Traversal", topic: "Trees", difficulty: "Medium", status: "Not Started", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 7, title: "Climbing Stairs", topic: "Dynamic Programming", difficulty: "Easy", status: "Solved", link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 8, title: "Jump Game", topic: "Greedy", difficulty: "Medium", status: "In Progress", link: "https://leetcode.com/problems/jump-game/" }
];

export const initialTasks = [
  { id: 1, title: "Solve two DSA problems", category: "DSA", due: today(), done: true },
  { id: 2, title: "Revise React hooks", category: "Frontend", due: today(), done: false },
  { id: 3, title: "Practice SQL queries", category: "Database", due: today(), done: false }
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const quizQuestions = [
  {
    question: "Which React Hook is used to manage state in a functional component?",
    options: ["useEffect", "useState", "useRef", "useMemo"],
    answer: 1,
    explanation: "useState adds state to a functional component."
  },
  {
    question: "Which data structure follows FIFO order?",
    options: ["Stack", "Tree", "Queue", "Graph"],
    answer: 2,
    explanation: "A queue is First In, First Out (FIFO)."
  },
  {
    question: "Which SQL clause filters grouped results?",
    options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"],
    answer: 2,
    explanation: "HAVING filters groups after GROUP BY."
  },
  {
    question: "What is the average lookup time of a hash table?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    answer: 2,
    explanation: "Hash table lookup is O(1) on average, though worst cases can be O(n)."
  },
  {
    question: "Which HTTP method is commonly used to retrieve data?",
    options: ["POST", "GET", "PATCH", "DELETE"],
    answer: 1,
    explanation: "GET requests retrieve a resource."
  }
];
