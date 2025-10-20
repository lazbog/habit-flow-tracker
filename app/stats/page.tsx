'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getHabits, getHabitStats, getRecords } from '@/lib/habits'
import { Habit } from '@/lib/types'
import { format, subDays, startOfDay } from 'date-fns'
import StatsCard from '@/components/StatsCard'
import { Flame, Target, TrendingUp, Calendar } from 'lucide-react'

export default function StatsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [selectedHabit, setSelectedHabit] = useState<string>('all')
  const [chartData, setChartData] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})

  useEffect(() => {
    const habitsData = getHabits()
    setHabits(habitsData)
    
    if (habitsData.length > 0) {
      setSelectedHabit(habitsData[0].id)
    }
  }, [])

  useEffect(() => {
    if (selectedHabit === 'all') {
      generateAllHabitsData()
    } else if (selectedHabit) {
      generateHabitData(selectedHabit)
    }
  }, [selectedHabit, habits])

  const generateAllHabitsData = () => {
    const records = getRecords()
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
      const dayRecords = records.filter(r => r.date === date && r.completed)
      return {
        date: format(subDays(new Date(), 29 - i), 'MMM dd'),
        completed: dayRecords.length,
        total: habits.length,
      }
    })
    setChartData(last30Days)
    
    // Calculate overall stats
    const allStats = habits.map(habit => getHabitStats(habit.id))
    const totalCompleted = allStats.reduce((acc, stat) => acc + stat.totalCompleted, 0)
    const totalDays = allStats.reduce((acc, stat) => acc + stat.totalDays, 0)
    const avgCompletionRate = totalDays > 0 ? (totalCompleted / totalDays) * 100 : 0
    const maxStreak = Math.max(...allStats.map(stat => stat.longestStreak), 0)
    
    setStats({
      totalHabits: habits.length,
      avgCompletionRate: Math.round(avgCompletionRate),
      longestStreak: maxStreak,
      totalCompletions: totalCompleted,
    })
  }

  const generateHabitData = (habitId: string) => {
    const records = getRecords().filter(r => r.habitId === habitId)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd')
      const record = records.find(r => r.date === date)
      return {
        date: format(subDays(new Date(), 29 - i), 'MMM dd'),
        completed: record?.completed ? 1 : 0,
      }
    })
    setChartData(last30Days)
    
    const habitStats = getHabitStats(habitId)
    setStats(habitStats)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Track your progress and analyze your habit patterns
        </p>
      </div>

      <div className="flex gap-4">
        <select
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Habits</option>
          {habits.map((habit) => (
            <option key={habit.id} value={habit.id}>
              {habit.icon} {habit.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {selectedHabit === 'all' ? (
          <>
            <StatsCard
              title="Total Habits"
              value={stats.totalHabits || 0}
              description="Active habits"
              icon={Target}
            />
            <StatsCard
              title="Avg Completion Rate"
              value={`${stats.avgCompletionRate || 0}%`}
              description="Last 30 days"
              icon={TrendingUp}
            />
            <StatsCard
              title="Longest Streak"
              value={stats.longestStreak || 0}
              description="Days in a row"
              icon={Flame}
            />
            <StatsCard
              title="Total Completions"
              value={stats.totalCompletions || 0}
              description="All time"
              icon={Calendar}
            />
          </>
        ) : (
          <>
            <StatsCard
              title="Current Streak"
              value={stats.currentStreak || 0}
              description="Days in a row"
              icon={Flame}
            />
            <StatsCard
              title="Longest Streak"
              value={stats.longestStreak || 0}
              description="Best streak"
              icon={Target}
            />
            <StatsCard
              title="Completion Rate"
              value={`${Math.round(stats.completionRate || 0)}%`}
              description="Last 30 days"
              icon={TrendingUp}
            />
            <StatsCard
              title="Total Completed"
              value={stats.totalCompleted || 0}
              description="Last 30 days"
              icon={Calendar}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {selectedHabit === 'all' ? 'Daily Completion Overview' : 'Last 30 Days'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            {selectedHabit === 'all' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3b82f6" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="p-6 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Habit Performance</h3>
          <div className="space-y-4">
            {habits.map((habit) => {
              const habitStats = getHabitStats(habit.id)
              return (
                <div key={habit.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${habit.color} flex items-center justify-center text-white text-sm`}>
                      {habit.icon}
                    </div>
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {habitStats.currentStreak} day streak
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Math.round(habitStats.completionRate)}%</p>
                    <p className="text-sm text-muted-foreground">completion</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}