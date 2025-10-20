'use client';

import { Habit, HabitRecord, HabitStats } from './types'
import { format, isToday, parseISO, startOfDay, subDays } from 'date-fns'

const HABITS_KEY = 'habits'
const RECORDS_KEY = 'habit-records'

export function getHabits(): Habit[] {
  if (typeof window === 'undefined') return []
  const habits = localStorage.getItem(HABITS_KEY)
  return habits ? JSON.parse(habits) : []
}

export function saveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

export function addHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Habit {
  const newHabit: Habit = {
    ...habit,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  const habits = getHabits()
  saveHabits([...habits, newHabit])
  return newHabit
}

export function updateHabit(id: string, updates: Partial<Habit>): void {
  const habits = getHabits()
  const updatedHabits = habits.map(h => h.id === id ? { ...h, ...updates } : h)
  saveHabits(updatedHabits)
}

export function deleteHabit(id: string): void {
  const habits = getHabits()
  saveHabits(habits.filter(h => h.id !== id))
  
  const records = getRecords()
  saveRecords(records.filter(r => r.habitId !== id))
}

export function getRecords(): HabitRecord[] {
  if (typeof window === 'undefined') return []
  const records = localStorage.getItem(RECORDS_KEY)
  return records ? JSON.parse(records) : []
}

export function saveRecords(records: HabitRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function toggleHabitCompletion(habitId: string, date: string): void {
  const records = getRecords()
  const existingRecord = records.find(r => r.habitId === habitId && r.date === date)
  
  if (existingRecord) {
    const updatedRecords = records.filter(r => !(r.habitId === habitId && r.date === date))
    saveRecords(updatedRecords)
  } else {
    const newRecord: HabitRecord = {
      habitId,
      date,
      completed: true,
    }
    saveRecords([...records, newRecord])
  }
}

export function getHabitStats(habitId: string): HabitStats {
  const records = getRecords().filter(r => r.habitId === habitId)
  const today = format(new Date(), 'yyyy-MM-dd')
  
  // Sort records by date
  const sortedRecords = records.sort((a, b) => a.date.localeCompare(b.date))
  
  // Calculate current streak
  let currentStreak = 0
  let checkDate = new Date()
  
  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd')
    const record = sortedRecords.find(r => r.date === dateStr)
    
    if (record && record.completed) {
      currentStreak++
      checkDate = subDays(checkDate, 1)
    } else if (isToday(parseISO(dateStr))) {
      // If today is not completed, streak is 0
      break
    } else {
      break
    }
  }
  
  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 0
  let lastDate: string | null = null
  
  for (const record of sortedRecords) {
    if (record.completed) {
      if (!lastDate || isOneDayApart(lastDate, record.date)) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
      lastDate = record.date
    } else {
      tempStreak = 0
      lastDate = null
    }
  }
  
  // Calculate completion rate for last 30 days
  const thirtyDaysAgo = subDays(new Date(), 30)
  const recentRecords = records.filter(r => parseISO(r.date) >= thirtyDaysAgo)
  const totalDays = 30
  const totalCompleted = recentRecords.filter(r => r.completed).length
  const completionRate = totalDays > 0 ? (totalCompleted / totalDays) * 100 : 0
  
  return {
    currentStreak,
    longestStreak,
    completionRate,
    totalCompleted,
    totalDays,
  }
}

function isOneDayApart(date1: string, date2: string): boolean {
  const d1 = parseISO(date1)
  const d2 = parseISO(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

export function getTodayRecords(): HabitRecord[] {
  const today = format(new Date(), 'yyyy-MM-dd')
  return getRecords().filter(r => r.date === today)
}