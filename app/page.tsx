'use client'

import { useState, useEffect } from 'react'
import { Plus, Flame, Target, TrendingUp } from 'lucide-react'
import { getHabits, getHabitStats } from '@/lib/habits'
import { Habit } from '@/lib/types'
import HabitList from '@/components/HabitList'
import HabitForm from '@/components/HabitForm'
import StatsCard from '@/components/StatsCard'

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    completionRate: 0,
  })

  useEffect(() => {
    const loadHabits = () => {
      const habitsData = getHabits()
      setHabits(habitsData)
      
      // Calculate stats
      const todayRecords = habitsData.map(habit => {
        const habitStats = getHabitStats(habit.id)
        return habitStats
      })
      
      const completedToday = habitsData.filter(habit => {
        const today = new Date().toISOString().split('T')[0]
        const records = JSON.parse(localStorage.getItem('habit-records') || '[]')
        return records.some((r: any) => r.habitId === habit.id && r.date === today && r.completed)
      }).length
      
      const avgCompletionRate = habitsData.length > 0
        ? todayRecords.reduce((acc, stat) => acc + stat.completionRate, 0) / habitsData.length
        : 0
      
      const maxStreak = todayRecords.reduce((acc, stat) => Math.max(acc, stat.currentStreak), 0)
      
      setStats({
        totalHabits: habitsData.length,
        completedToday,
        currentStreak: maxStreak,
        completionRate: Math.round(avgCompletionRate),
      })
    }
    
    loadHabits()
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadHabits()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleFormSubmit = () => {
    setShowForm(false)
    setHabits(getHabits())
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your daily habits and build consistency
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Habits"
          value={stats.totalHabits}
          description="Active habits"
          icon={Target}
        />
        <StatsCard
          title="Completed Today"
          value={`${stats.completedToday}/${stats.totalHabits}`}
          description={stats.totalHabits > 0 ? `${Math.round((stats.completedToday / stats.totalHabits) * 100)}% complete` : 'No habits yet'}
          icon={Plus}
        />
        <StatsCard
          title="Current Streak"
          value={stats.currentStreak}
          description="Days in a row"
          icon={Flame}
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          description="Last 30 days"
          icon={TrendingUp}
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Today's Habits</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Habit
        </button>
      </div>

      <HabitList />

      {showForm && (
        <HabitForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  )
}