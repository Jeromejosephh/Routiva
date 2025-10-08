// Diagnostic script for troubleshooting habit log updates
// Add this to your browser console to test the API directly

async function testHabitLogUpdate(habitId, date, status) {
  try {
    const response = await fetch(`/api/habits/${habitId}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date,
        status: status
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', response.status, data);
      return { error: data.error || 'Could not update', status: response.status };
    }
    
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Network Error:', error);
    return { error: 'Network error', message: error.message };
  }
}

// Usage examples:
// 1. Test marking a habit as done:
// testHabitLogUpdate('your-habit-id', '2025-01-08', 'done');

// 2. Test undoing (changing status from done to fail):
// testHabitLogUpdate('your-habit-id', '2025-01-08', 'fail');

// 3. Test undoing (changing status from done to skip):
// testHabitLogUpdate('your-habit-id', '2025-01-08', 'skip');

console.log('Habit log diagnostic script loaded. Use testHabitLogUpdate(habitId, date, status) to test API calls.');