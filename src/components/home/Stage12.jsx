import React from 'react';

export default function Stage12({ stage }) {
  return (
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
  );
}
