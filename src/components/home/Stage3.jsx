import React from 'react';

export default function Stage3({ stage, typed }) {
  if (stage !== 3) return null;

  return (
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
  );
}
