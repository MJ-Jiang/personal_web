import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../App.css';

export default function Homepage() {
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
  const TYPE_SPEED_MS = 60; // 打字速度（可调）
  const AFTER_TYPE_PAUSE_MS = 700; // 打完后停留一下再进 stage4

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
      // stage-4 在 stage-3 打完字后再触发
    };

    run();
    return () => {
      clearStageTimers();
      clearTypingTimer();
    };
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

        // 打完后停留一下，再进入 stage-4
        clearStageTimers();
        stageTimerRef.current.t3 = window.setTimeout(() => {
          setStage(4);
        }, AFTER_TYPE_PAUSE_MS);
      }
    }, TYPE_SPEED_MS);

    return () => clearTypingTimer();
  }, [stage]);

  const appClass = `app stage-${stage} ${running ? 'is-running' : ''}`;

  return (
    <div className={appClass} aria-label="个人网站首页">
      {/* stage1/2 分屏 —— 不动 */}
      <div className="split" aria-hidden={stage >= 3}>
        <section className="panel panel--left" aria-label="攀岩">
          <div className="climbPhoto">
            <img className="climbPhoto__img" src="/bouldering.png" alt="" />
            <div className="climbPhoto__veil" aria-hidden="true" />
            <div className="panel__label panel__label--right">
              <div className="title">结构 · 路径 · 决策</div>
            </div>
          </div>
        </section>

        <section className="panel panel--right" aria-label="影视剪辑">
          <div className="panel__bg panel__bg--edit" aria-hidden="true" />
          <div className="edit">
            <div className="edit__vignette" aria-hidden="true" />
            <div className="edit__frames" aria-hidden="true">
              <div className="shot s1">
                <img className="shot__img" src="/edit1.png" alt="" />
                <span className="shot__veil" aria-hidden="true" />
              </div>
              <div className="shot s2">
                <img className="shot__img" src="/edit2.png" alt="" />
                <span className="shot__veil" aria-hidden="true" />
              </div>
              <div className="shot s3">
                <img className="shot__img" src="/edit3.png" alt="" />
                <span className="shot__veil" aria-hidden="true" />
              </div>
            </div>

            <div className="edit__timeline" aria-hidden="true">
              <div className="tl-row r1">
                <span className="clip c1" />
                <span className="clip c2" />
                <span className="clip c3" />
              </div>
              <div className="tl-row r2">
                <span className="clip c4" />
                <span className="clip c5" />
                <span className="clip c6" />
                <span className="clip c7" />
              </div>
              <div className="tl-row r3">
                <span className="clip c8" />
                <span className="clip c9" />
                <span className="clip c10" />
              </div>
            </div>

            <div className="edit__playhead" aria-hidden="true" />

            <div className="panel__label">
              <div className="title">时间 · 叙事 · 节奏</div>
            </div>
          </div>
        </section>

        <div className="seam" aria-hidden="true">
          <div className="seam__line" />
          <div className="seam__core" />
        </div>
      </div>

      {/* stage3 bloom —— 保留 */}
      <div className="code-bloom" aria-hidden="true">
        <div className="bloom bloom--1" />
        <div className="bloom bloom--2" />
        <div className="bloom bloom--3" />
        <div className="grid-hint" />
      </div>

      {/* ✅ stage3：代码居中打字 + 左下角 quote */}
      {stage === 3 && (
        <>
          <div className="stage3Type" aria-hidden="true">
            <div className="ide">
              <div className="ide__top">
                <div className="ide__dots" aria-hidden="true">
                  <span className="dot d1" />
                  <span className="dot d2" />
                  <span className="dot d3" />
                </div>
                <div className="ide__title">alive.js</div>
                <div className="ide__spacer" aria-hidden="true" />
              </div>

              <pre className="typeBlock">
                <code>
                  {typed}
                  <span className="caret" />
                </code>
              </pre>
            </div>
          </div>

          <div className="stage3Quote" aria-hidden="true">
            <div>It works,</div>
            <div>I don't know why.</div>
          </div>
        </>
      )}

      {/* stage4 空屏 —— 保留 */}
      <div className="stage4-empty" aria-hidden={stage !== 4} />
    </div>
  );
}
