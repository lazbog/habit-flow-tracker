'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { addHabit, updateHabit } from '@/lib/habits'
import { Habit } from '@/lib/types'

interface HabitFormProps {
  habit?: Habit
  onClose: () => void
  onSubmit: () => void
}

const COLORS = [
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Pink', value: 'bg-pink-500' },
]

const ICONS = [
  { name: 'Check', value: '✓' },
  { name: 'Star', value: '★' },
  { name: 'Heart', value: '♥' },
  { name: 'Fire', value: '🔥' },
  { name: 'Book', value: '📚' },
  { name: 'Exercise', value: '💪' },
]

export default function HabitForm({ habit, onClose, onSubmit }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '')
  const [description, setDescription] = useState(habit?.description || '')
  const [color, setColor] = useState(habit?.color || COLORS[0].value)
  const [icon, setIcon] = useState(habit?.icon || ICONS[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    if (habit) {
      updateHabit(habit.id, { name, description, color, icon })
    } else {
      addHabit({ name, description, color, icon })
    }
    
    onSubmit()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {habit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Morning Exercise"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.value} ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Icon
            </label>
            <div className="flex gap-2">
              {ICONS.map((i) => (
                <button
                  key={i.value}
                  type="button"
                  onClick={() => setIcon(i.value)}
                  className={`w-10 h-10 rounded border flex items-center justify-center text-lg ${
                    icon === i.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-foreground'
                  }`}
                  title={i.name}
                >
                  {i.value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {habit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}