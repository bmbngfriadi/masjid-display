import { useState, useEffect, useRef } from 'react';
import NoSleep from 'nosleep.js';

export default function useWakeLock(shouldLock = true) {
  const [isSupported, setIsSupported] = useState(true); // With NoSleep fallback, it's always supported
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef(null);
  const noSleepRef = useRef(null);

  useEffect(() => {
    noSleepRef.current = new NoSleep();
    return () => {
      if (noSleepRef.current) {
        noSleepRef.current.disable();
      }
    };
  }, []);

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsActive(true);
        
        wakeLockRef.current.addEventListener('release', () => {
          setIsActive(false);
          console.log('Native Wake Lock was released');
        });
        console.log('Native Wake Lock is active');
      } else {
        // Fallback to NoSleep.js for non-secure HTTP contexts
        if (noSleepRef.current) {
          noSleepRef.current.enable();
          setIsActive(true);
          console.log('NoSleep.js fallback is active');
        }
      }
    } catch (err) {
      console.error(`WakeLock Error: ${err.name}, ${err.message}`);
      // If native fails (e.g. no user gesture yet), try NoSleep fallback
      if (noSleepRef.current) {
        try {
          noSleepRef.current.enable();
          setIsActive(true);
          console.log('NoSleep.js fallback is active after native failure');
        } catch(fallbackErr) {
          console.error('NoSleep fallback also failed', fallbackErr);
          setIsActive(false);
        }
      } else {
        setIsActive(false);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current !== null) {
      await wakeLockRef.current.release().catch(console.error);
      wakeLockRef.current = null;
    }
    if (noSleepRef.current) {
      noSleepRef.current.disable();
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (shouldLock) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [shouldLock]);

  // Re-acquire wake lock on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && shouldLock) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [shouldLock]);

  return { isSupported, isActive, requestWakeLock, releaseWakeLock };
}
