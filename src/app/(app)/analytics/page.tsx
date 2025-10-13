import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { computeCompletionRate, computeCurrentStreak } from "@/lib/analytics";
import { SimpleBarChart, ProgressRing } from "@/components/SimpleChart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Detailed habit analytics and insights - view completion rates, streaks, weekly activity, and comprehensive performance data to optimize your routine.",
  openGraph: {
    title: "Analytics | Routiva",
    description: "Track your habit performance with detailed analytics, completion rates, and streak insights.",
  },
};

//calculate comprehensive analytics for user's habits
async function getAnalyticsData(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, isArchived: false },
    include: {
      logs: {
        orderBy: { date: 'desc' }
      }
    }
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const totalHabits = habits.length;
  const totalLogs = habits.reduce((sum, habit) => sum + habit.logs.length, 0);
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + habit.logs.filter(log => log.status === 'done').length, 0
  );

  const recentLogs = habits.flatMap(habit => 
    habit.logs.filter(log => log.date >= thirtyDaysAgo)
  );
  const weeklyLogs = habits.flatMap(habit => 
    habit.logs.filter(log => log.date >= sevenDaysAgo)
  );

  //calculate individual habit performance metrics
  const habitStats = habits.map(habit => {
    const completionRate = computeCompletionRate(habit.logs);
    const currentStreak = computeCurrentStreak(habit.logs);
    const recentActivity = habit.logs.filter(log => log.date >= sevenDaysAgo).length;
    
    return {
      id: habit.id,
      name: habit.name,
      completionRate,
      currentStreak,
      recentActivity,
      totalLogs: habit.logs.length
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  return {
    totalHabits,
    totalLogs,
    totalCompletions,
    overallCompletionRate: totalLogs > 0 ? totalCompletions / totalLogs : 0,
    recentActivity: recentLogs.length,
    weeklyActivity: weeklyLogs.length,
    habitStats
  };
}

export default async function AnalyticsPage() {
  const user = await requireUser();
  const analytics = await getAnalyticsData(user.id);

  return (
  <div className="space-y-6 px-4 max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-center">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalHabits}</div>
          <div className="text-sm text-white/70">Total Habits</div>
        </div>
        
        <div className="border rounded-lg p-4 flex items-center justify-between backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(analytics.overallCompletionRate * 100)}%
            </div>
            <div className="text-sm text-white/70">Overall Completion</div>
          </div>
          <ProgressRing 
            percentage={analytics.overallCompletionRate * 100}
            size={50}
            color="#16A34A"
          />
        </div>
        
        <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="text-2xl font-bold text-purple-600">{analytics.weeklyActivity}</div>
          <div className="text-sm text-white/70">This Week</div>
        </div>
        
        <div className="border rounded-lg p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <div className="text-2xl font-bold text-orange-600">{analytics.recentActivity}</div>
          <div className="text-sm text-white/70">Last 30 Days</div>
        </div>
      </div>

  <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Habit Performance</h2>
        
        {analytics.habitStats.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <p>No habits yet. Create your first habit to see analytics!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 min-w-0">
              {analytics.habitStats.map((habit) => (
                <div key={habit.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded backdrop-blur-sm bg-white/60 dark:bg-gray-700/60 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{habit.name}</div>
                    <div className="text-sm text-white/60">
                      {habit.totalLogs} total logs • {habit.recentActivity} this week
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-row items-center space-x-4 text-sm mt-2 sm:mt-0">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {Math.round(habit.completionRate * 100)}%
                      </div>
                      <div className="text-xs text-white/60">Success Rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {habit.currentStreak}
                      </div>
                      <div className="text-xs text-white/60">Current Streak</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <SimpleBarChart
                title="Completion Rates"
                data={analytics.habitStats.map(habit => ({
                  label: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
                  value: Math.round(habit.completionRate * 100),
                  color: habit.completionRate >= 0.8 ? 'bg-green-400' : 
                         habit.completionRate >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                }))}
                maxValue={100}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
        <div className="space-y-2 text-sm">
          {analytics.habitStats.length > 0 ? (
            <>
              <p>
                🏆 <strong>Best performing habit:</strong> {" "}
                {analytics.habitStats[0]?.name} {" "}
                ({Math.round(analytics.habitStats[0]?.completionRate * 100)}% success rate)
              </p>
              
              {analytics.habitStats.find(h => h.currentStreak > 0) && (
                <p>
                  🔥 <strong>Longest current streak:</strong> {
                    Math.max(...analytics.habitStats.map(h => h.currentStreak))
                  } days
                </p>
              )}
              
              <p>
                📊 <strong>Weekly activity:</strong> {analytics.weeklyActivity} completions this week
              </p>
              
              {analytics.overallCompletionRate >= 0.8 && (
                <p>🎉 <strong>Great job!</strong> You&apos;re maintaining an excellent completion rate!</p>
              )}
            </>
          ) : (
            <p className="text-white/60">Start tracking habits to see personalized insights here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
