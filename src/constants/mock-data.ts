import { Subject } from "../types"

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    description: "Basic concepts of programming and algorithms.",
    department: "Computer Science",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Calculus I",
    code: "MATH101",
    description: "Fundamental principles of calculus including limits, derivatives, and integrals.",
    department: "Mathematics",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "English Literature",
    code: "ENG201",
    description: "Study of classic English literature from various periods and authors.",
    department: "English",
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Physics I",
    code: "PHYS101",
    description: "Introduction to mechanics, including kinematics, dynamics, and energy.",
    department: "Physics",
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "General Chemistry",
    code: "CHEM101",
    description: "Basic principles of chemistry including atomic structure and chemical reactions.",
    department: "Chemistry",
    createdAt: new Date().toISOString()
  },
  {
    id: 6,
    name: "World History",
    code: "HIST101",
    description: "Overview of major historical events and civilizations throughout world history.",
    department: "History",
    createdAt: new Date().toISOString()
  }
]