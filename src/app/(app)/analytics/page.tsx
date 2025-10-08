import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { computeCompletionRate, computeCurrentStreak } from "@/lib/analytics";
import { SimpleBarChart, ProgressRing } from "@/components/SimpleChart";

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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{analytics.totalHabits}</div>
          <div className="text-sm text-gray-600">Total Habits</div>
        </div>
        
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(analytics.overallCompletionRate * 100)}%
            </div>
            <div className="text-sm text-gray-600">Overall Completion</div>
          </div>
          <ProgressRing 
            percentage={analytics.overallCompletionRate * 100}
            size={50}
            color="#16A34A"
          />
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">{analytics.weeklyActivity}</div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{analytics.recentActivity}</div>
          <div className="text-sm text-gray-600">Last 30 Days</div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Habit Performance</h2>
        
        {analytics.habitStats.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No habits yet. Create your first habit to see analytics!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {analytics.habitStats.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{habit.name}</div>
                    <div className="text-sm text-gray-500">
                      {habit.totalLogs} total logs • {habit.recentActivity} this week
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-green-600">
                        {Math.round(habit.completionRate * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Success Rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {habit.currentStreak}
                      </div>
                      <div className="text-xs text-gray-500">Current Streak</div>
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
                  color: habit.completionRate >= 0.8 ? 'bg-green-500' : 
                         habit.completionRate >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }))}
                maxValue={100}
              />
            </div>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
        <div className="space-y-2 text-sm">
          {analytics.habitStats.length > 0 ? (
            <>
              <p>
                🏆 <strong>Best performing habit:</strong> {analytics.habitStats[0]?.name} 
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
            <p className="text-gray-500">Start tracking habits to see personalized insights here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
