import { useEffect, useMemo, useRef, useState } from 'react';

export default function useHomepageStages() {
  const [stage, setStage] = useState(1); // 1~4
  const [running, setRunning] = useState(false);

  // ===== Stage-3 typing =====
  const CODE_TEXT = `while (alive) {
  keepEating();
  keepLearning();
  KeepLoving();
  keepCoding();
  keepGoing();
}`;
  const TYPE_SPEED_MS = 35;
  const AFTER_TYPE_PAUSE_MS = 900;

  const [typed, setTyped] = useState('');

  const typingTimerRef = useRef(null);
  const stageTimerRef = useRef({ t1: null, t2: null, t3: null });

  const prefersReduced = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    );
  }, []);

  const T_INTRO = 1200;
  const T_MERGE = 900;

  const clearStageTimers = () => {
    const { t1, t2, t3 } = stageTimerRef.current;
    if (t1) window.clearTimeout(t1);
    if (t2) window.clearTimeout(t2);
    if (t3) window.clearTimeout(t3);
    stageTimerRef.current = { t1: null, t2: null, t3: null };
  };

  const clearTypingTimer = () => {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    typingTimerRef.current = null;
  };

  // 初始化 stage 流程
  useEffect(() => {
    clearStageTimers();
    clearTypingTimer();

    const run = () => {
      setRunning(false);
      setStage(1);
      setTyped('');

      if (prefersReduced) {
        setStage(4);
        return;
      }

      requestAnimationFrame(() => setRunning(true));

      stageTimerRef.current.t1 = window.setTimeout(() => setStage(2), T_INTRO);
      stageTimerRef.current.t2 = window.setTimeout(
        () => setStage(3),
        T_INTRO + T_MERGE
      );
      // stage-4 在 stage-3 打完字后触发
    };

    run();
    return () => {
      clearStageTimers();
      clearTypingTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  // 进入 stage-3 时开始打字；打完后再进入 stage-4
  useEffect(() => {
    if (stage !== 3) {
      clearTypingTimer();
      return;
    }

    setTyped('');
    let i = 0;

    typingTimerRef.current = window.setInterval(() => {
      i += 1;
      setTyped(CODE_TEXT.slice(0, i));

      if (i >= CODE_TEXT.length) {
        clearTypingTimer();

        clearStageTimers();
        stageTimerRef.current.t3 = window.setTimeout(() => {
          setStage(4);
        }, AFTER_TYPE_PAUSE_MS);
      }
    }, TYPE_SPEED_MS);

    return () => clearTypingTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  return { stage, running, typed };
}
