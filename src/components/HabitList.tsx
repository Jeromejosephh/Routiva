'use client';

import { useThemeClasses, getThemeClasses, PASTEL_COLORS } from "@/components/ThemeProvider";
import HabitRow from "@/components/HabitRow";
import HabitActions from "@/components/HabitActions";

interface Habit {
  id: string;
  name: string;
  groupId: string | null;
  isArchived: boolean;
}

interface Group {
  id: string;
  name: string;
  color: string;
  icon?: string;
  _count?: { habits: number };
}

interface HabitListProps {
  habits: Habit[];
  groups: Group[];
  doneSet: Set<string>;
}

export default function HabitList({ habits, groups, doneSet }: HabitListProps) {
  const themeClasses = useThemeClasses();

  // Group habits by their groupId
  const groupedHabits: Record<string, Habit[]> = {};
  const ungroupedHabits: Habit[] = [];

  habits.forEach((habit) => {
    if (habit.groupId) {
      const groupId = habit.groupId;
      if (!groupedHabits[groupId]) {
        groupedHabits[groupId] = [];
      }
      groupedHabits[groupId].push(habit);
    } else {
      ungroupedHabits.push(habit);
    }
  });

  // Function to get theme classes for a specific color
  function getGroupThemeClasses(color: string) {
    // Map group colors to our pastel color system
    const colorMapping: Record<string, string> = {
      blue: 'blue',
      green: 'green', 
      purple: 'purple',
      red: 'red',
      orange: 'orange',
      yellow: 'yellow',
      pink: 'pink',
      teal: 'teal'
    };
    
    const pastellColor = colorMapping[color] || 'blue';
    const pastellColorKey = pastellColor as keyof typeof PASTEL_COLORS;
    
    // Use the current theme's dark mode setting
    const isDark = document.documentElement.classList.contains('dark');
    return getThemeClasses(pastellColorKey, isDark);
  }

  return (
    <div className="space-y-6">
      {/* Grouped habits */}
      {Object.entries(groupedHabits).map(([groupId, groupHabits]) => {
        const group = groups.find((g) => g.id === groupId);
        if (!group) return null;
        
        const groupThemeClasses = getGroupThemeClasses(group.color);

        return (
          <div key={groupId} className={`border rounded-lg p-4 ${groupThemeClasses.secondary} ${groupThemeClasses.border}`}>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">{group.icon}</span>
              {group.name}
              <span className="text-sm text-gray-600">({groupHabits.length})</span>
            </h3>
            <ul className="space-y-2">
              {groupHabits.map((habit) => (
                <li key={habit.id} className={`border p-3 rounded ${groupThemeClasses.primary} ${groupThemeClasses.border}`}>
                  <div className="flex items-center justify-between">
                    <span className={habit.isArchived ? "opacity-60 line-through" : ""}>
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <HabitRow habitId={habit.id} initialChecked={doneSet.has(habit.id)} />
                      <HabitActions
                        habitId={habit.id}
                        name={habit.name}
                        isArchived={habit.isArchived}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Ungrouped habits */}
      {ungroupedHabits.length > 0 && (
        <div className={`border rounded-lg p-4 ${themeClasses.secondary} ${themeClasses.border}`}>
          <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Other Habits</h3>
          <ul className="space-y-2">
            {ungroupedHabits.map((habit) => (
              <li key={habit.id} className={`border p-3 rounded ${themeClasses.primary} ${themeClasses.border}`}>
                <div className="flex items-center justify-between">
                  <span className={habit.isArchived ? "opacity-60 line-through" : ""}>
                    {habit.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <HabitRow habitId={habit.id} initialChecked={doneSet.has(habit.id)} />
                    <HabitActions
                      habitId={habit.id}
                      name={habit.name}
                      isArchived={habit.isArchived}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {habits.length === 0 && (
        <div className={`text-center p-8 border border-dashed rounded-lg ${themeClasses.border}`}>
          <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit!</p>
        </div>
      )}
    </div>
  );
}