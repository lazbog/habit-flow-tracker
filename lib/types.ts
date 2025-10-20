export interface Habit {
  id: string
  name: string
  description?: string
  createdAt: string
  color: string
  icon: string
}

export interface HabitRecord {
  habitId: string
  date: string
  completed: boolean
}

export interface HabitStats {
  currentStreak: number
  longestStreak: number
  completionRate: number
  totalCompleted: number
  totalDays: number
}