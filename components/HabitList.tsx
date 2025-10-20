'use client'

import { useState, useEffect } from 'react'
import { Check, Edit2, Trash2 } from 'lucide-react'
import { getHabits, getTodayRecords, toggleHabitCompletion, deleteHabit } from '@/lib/habits'
import { Habit } from '@/lib/types'
import HabitForm from './HabitForm'

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayRecords, setTodayRecords] = useState<string[]>([])
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setHabits(getHabits())
    setTodayRecords(getTodayRecords().map(r => r.habitId))
  }, [])

  const handleToggle = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0]
    toggleHabitCompletion(habitId, today)
    
    setTodayRecords(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    )
  }

  const handleDelete = (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId)
      setHabits(getHabits())
      setTodayRecords(prev => prev.filter(id => id !== habitId))
    }
  }

  const handleFormSubmit = () => {
    setShowForm(false)
    setEditingHabit(undefined)
    setHabits(getHabits())
  }

  return (
    <>
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No habits yet. Create your first habit to get started!
            </p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = todayRecords.includes(habit.id)
            return (
              <div
                key={habit.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <button
                  onClick={() => handleToggle(habit.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border hover:border-foreground'
                  }`}
                >
                  {isCompleted && <Check className="h-4 w-4" />}
                </button>
                
                <div className={`w-10 h-10 rounded-full ${habit.color} flex items-center justify-center text-white text-lg`}>
                  {habit.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingHabit(habit)
                      setShowForm(true)
                    }}
                    className="p-2 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      {showForm && (
        <HabitForm
          habit={editingHabit}
          onClose={() => {
            setShowForm(false)
            setEditingHabit(undefined)
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </>
  )
}