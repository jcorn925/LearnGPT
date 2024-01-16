import React, { useState, useEffect, useRef } from 'react';
import Icon from '@src/components/IconWrapper/Icon';
import RippleButton from '@src/components/Buttons/RippleButton/rippleButton-index';
import styles from './PomodoroTimer.module.scss';


interface PomodoroTimerProps {
  workTime?: number;
  breakTime?: number;
}

enum TimerStage {
  WORK,
  BREAK
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ workTime = 25, breakTime = 5 }) => {
  const [stage, setStage] = useState(TimerStage.WORK);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(stage === TimerStage.WORK ? workTime * 60 : breakTime * 60);
  }, [stage, workTime, breakTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setStage((prevStage) => (prevStage === TimerStage.WORK ? TimerStage.BREAK : TimerStage.WORK));
            return prevTime;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [stage, isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStage(TimerStage.WORK);
    setTimeLeft(workTime * 60);
  };

  return (
    <div className={styles.container}>
      {/* <h2 className={styles.heading}>{stage === TimerStage.WORK ? 'Work' : 'Break'}</h2> */}
      <div className={styles.timer}>{formatTime(timeLeft)}</div>
      <div className={styles.buttons}>
        <Icon id="play" size={24} color="grey" onClick={handleStart} />
        <Icon id="pause" size={24} color="grey" onClick={handlePause} />
        <Icon id="reset" size={24} color="grey" onClick={handleReset} />
      </div>
    </div>
  );
};

export default PomodoroTimer;
