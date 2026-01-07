import React, { useRef } from 'react';
import NebulaCanvas from './NebulaCanvas';

export default function Stage4({ stage, go }) {
  const frameRef = useRef(null);
  const leftRef = useRef(null);

  return (
    <div className={`stage4 ${stage === 4 ? 'is-active' : ''}`} aria-hidden={stage !== 4}>
      <div ref={frameRef} className="stage4-frame stage4-frame--boxed">

        {/* ✅ 星云：不影响交互（canvas 在内容下面） */}
        <NebulaCanvas
          active={stage === 4}
          frameRef={frameRef}
          leftRef={leftRef}
        />

        {/* 左侧信息 */}
        <section ref={leftRef} className="stage4-left">
          <div className="stage4-left__name">June</div>

          <div className="stage4-left__line">软件开发　软件测试</div>

          <div className="stage4-left__line">
            <a className="stage4-left__link" href="mailto:mJune_Jiang@outlook.com">
              mJune_Jiang@outlook.com
            </a>
          </div>

          <div className="stage4-left__line">
            <a
              className="stage4-left__link"
              href="https://github.com/MJ-Jiang"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/MJ-Jiang
            </a>
          </div>
        </section>

        {/* 右侧导航 */}
        <section className="stage4-right" aria-label="导航">
          <button className="stage4-item" onClick={() => go('/projects/resourcehub')}>
            <span className="item-cn">明星资源站</span>
            <span className="item-en">2026.01 · Web Full-stack</span>
          </button>

          <button className="stage4-item" onClick={() => go('/projects/wechatycy')}>
            <span className="item-cn">答案之书</span>
            <span className="item-en">2025.07 · 微信小程序</span>
          </button>

          <button className="stage4-item" onClick={() => go('/skills-and-hobbies')}>
            <span className="item-cn">技能和爱好</span>
            <span className="item-en">Skills and Hobbies</span>
          </button>
        </section>
      </div>
    </div>
  );
}
