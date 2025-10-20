# Habit Flow Tracker

A simple and effective habit tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your daily habits, monitor your progress, and build consistency with visual statistics and streak tracking.

## Features

- ✅ Create and manage daily habits
- 📊 Visual statistics and progress tracking
- 🔥 Streak tracking (current and longest)
- 📈 30-day completion rate analysis
- 🎨 Customizable habit colors and icons
- 📱 Responsive design for all devices
- 💾 Local storage for data persistence

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Create Habits**: Click "Add Habit" to create new habits with custom names, descriptions, colors, and icons
2. **Track Daily**: Mark habits as complete each day using the checkbox
3. **View Statistics**: Navigate to the Statistics page to see detailed analytics and progress charts
4. **Monitor Streaks**: Keep track of your current and longest streaks for each habit

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization charts
- **date-fns** - Date manipulation utilities

## Project Structure

```
habit-flow-tracker/
├── app/
│   ├── api/
│   │   └── ping/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── stats/
│       └── page.tsx
├── components/
│   ├── HabitForm.tsx
│   ├── HabitList.tsx
│   └── StatsCard.tsx
├── lib/
│   ├── habits.ts
│   └── types.ts
├── public/
└── ...config files
```

## Data Storage

This application uses browser's localStorage to persist data locally. All habits and completion records are stored in your browser and are not synced to any external service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License