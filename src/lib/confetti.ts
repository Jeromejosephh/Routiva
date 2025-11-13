import confetti from 'canvas-confetti';

/**
 * Trigger confetti celebration for streak milestones
 */
export function celebrateStreak(_streakCount: number) {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Fire confetti from two sides
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

/**
 * Simple confetti burst for habit completion
 */
export function celebrateCompletion() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    zIndex: 9999,
  });
}

/**
 * Firework-style confetti for major milestones (7, 30, 100, 365 days)
 */
export function celebrateMajorMilestone(_milestone: number) {
  const duration = 5000;
  const animationEnd = Date.now() + duration;

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Create firework effect
    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: randomInRange(0.1, 0.9),
        y: randomInRange(0.3, 0.6)
      },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00BFFF'],
      zIndex: 9999,
    });
  }, 200);
}

/**
 * Realistic confetti cannon effect for extra special occasions
 */
export function confettiCannon() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

/**
 * Determine which celebration to use based on streak count
 */
export function celebrateStreakMilestone(streakCount: number) {
  // Major milestones get special treatment
  if (streakCount === 365) {
    confettiCannon();
    setTimeout(() => celebrateMajorMilestone(365), 500);
  } else if (streakCount === 100 || streakCount === 200 || streakCount === 300) {
    celebrateMajorMilestone(streakCount);
  } else if (streakCount === 30 || streakCount === 60 || streakCount === 90) {
    celebrateMajorMilestone(streakCount);
  } else if (streakCount === 7 || streakCount === 14 || streakCount === 21) {
    celebrateStreak(streakCount);
  } else if (streakCount % 10 === 0 && streakCount >= 10) {
    // Every 10 days milestone
    celebrateStreak(streakCount);
  } else {
    // Regular completion
    celebrateCompletion();
  }
}
