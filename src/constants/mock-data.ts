import { Subject } from "../types"

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "Basic concepts of programming and algorithms.",
    department: {
      id: 1,
      name: "Computer Science",
      description: "Computer science department"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Calculus I",
    code: "MATH101",
    description: "Fundamental principles of calculus including limits, derivatives, and integrals.",
    department: {
      id: 2,
      name: "Mathematics",
      description: "Mathematics department"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "English Literature",
    code: "ENG201",
    description: "Study of classic English literature from various periods and authors.",
    department: {
      id: 3,
      name: "English",
      description: "English department"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Physics I",
    code: "PHYS101",
    description: "Introduction to mechanics, including kinematics, dynamics, and energy.",
    department: {
      id: 4,
      name: "Physics",
      description: "Physics department"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "General Chemistry",
    code: "CHEM101",
    description: "Basic principles of chemistry including atomic structure and chemical reactions.",
    department: {
      id: 5,
      name: "Chemistry",
      description: "Chemistry department"
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "World History",
    code: "HIST101",
    description: "Overview of major historical events and civilizations throughout world history.",
    department: {
      id: 6,
      name: "History",
      description: "History department"
    },
    createdAt: new Date().toISOString()
  }
]