// Ad trigger utility - ensures popunder ads fire on real user clicks
// The plumprush script in index.html automatically captures all clicks
// This function just logs for debugging - real clicks trigger ads naturally
export const triggerAd = () => {
  try {
    if (typeof window !== 'undefined') {
      // Log for debugging (optional - can be removed in production)
      console.log('🎯 Ad opportunity - Real click will trigger popunder');
      
      // The plumprush ad script handles the actual popunder
      // No need to simulate clicks - browser blocks those anyway
    }
  } catch (error) {
    console.log('Ad trigger:', error);
  }
};

// Function to add ad trigger to any element
export const addAdTrigger = (callback?: () => void) => {
  return () => {
    triggerAd();
    if (callback) {
      callback();
    }
  };
};

