import React, { useEffect, useMemo, useState } from "react";
import "../App.css";

export default function Homepage() {
  const [stage, setStage] = useState(1);
  const [running, setRunning] = useState(false);

  // 图片是否加载失败（用于降级显示）
  const [imgOk, setImgOk] = useState({
    climb: true,
    e1: true,
    e2: true,
    e3: true,
  });

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const T_INTRO = 2800;
  const T_MERGE = 1200;
  const T_BLOOM = 1400;

  useEffect(() => {
    let t1, t2, t3;

    const run = () => {
      setRunning(false);
      setStage(1);

      if (prefersReduced) {
        setStage(4);
        return;
      }

      requestAnimationFrame(() => setRunning(true));
      t1 = window.setTimeout(() => setStage(2), T_INTRO);
      t2 = window.setTimeout(() => setStage(3), T_INTRO + T_MERGE);
      t3 = window.setTimeout(() => setStage(4), T_INTRO + T_MERGE + T_BLOOM);
    };

    run();
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [prefersReduced]);

  const appClass = `app stage-${stage} ${running ? "is-running" : ""}`;

  return (
    <div className={appClass} aria-label="个人网站首页">
      <div className="split" aria-hidden={stage === 4}>
        {/* 左：攀岩 */}
        <section className="panel panel--left" aria-label="攀岩">
          <div className={`climbPhoto ${imgOk.climb ? "" : "is-fallback"}`}>
            <img
              className="climbPhoto__img"
              src="/bouldering.png"
              alt="攀岩背景"
              loading="eager"
              onError={() => setImgOk((s) => ({ ...s, climb: false }))}
            />
            <div className="climbPhoto__veil" aria-hidden="true" />

            <div className="panel__label panel__label--right">
   
              <div className="title">结构 · 路径 · 决策</div>
            </div>
          </div>
        </section>

        {/* 右：影视剪辑 */}
        <section className="panel panel--right" aria-label="影视剪辑">
          <div className="panel__bg panel__bg--edit" aria-hidden="true" />

          <div className="edit">
            <div className="edit__vignette" aria-hidden="true" />

            <div className="edit__frames" aria-hidden="true">
              <div className={`shot s1 ${imgOk.e1 ? "" : "is-fallback"}`}>
                <img
                  className="shot__img"
                  src="/edit1.png"
                  alt="剪辑画面1"
                  loading="eager"
                  onError={() => setImgOk((s) => ({ ...s, e1: false }))}
                />
                <span className="shot__veil" />
              </div>

              <div className={`shot s2 ${imgOk.e2 ? "" : "is-fallback"}`}>
                <img
                  className="shot__img"
                  src="/edit2.png"
                  alt="剪辑画面2"
                  loading="eager"
                  onError={() => setImgOk((s) => ({ ...s, e2: false }))}
                />
                <span className="shot__veil" />
              </div>

              <div className={`shot s3 ${imgOk.e3 ? "" : "is-fallback"}`}>
                <img
                  className="shot__img"
                  src="/edit3.png"
                  alt="剪辑画面3"
                  loading="eager"
                  onError={() => setImgOk((s) => ({ ...s, e3: false }))}
                />
                <span className="shot__veil" />
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

      <div className="code-bloom" aria-hidden="true">
        <div className="bloom bloom--1" />
        <div className="bloom bloom--2" />
        <div className="bloom bloom--3" />
        <div className="grid-hint" />
      </div>

      <div className="stage4-empty" aria-hidden={stage !== 4} />
    </div>
  );
}
