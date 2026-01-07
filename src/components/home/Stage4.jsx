import React from 'react';

export default function Stage4({ stage, go }) {
  return (
    <div className={`stage4 ${stage === 4 ? 'is-active' : ''}`} aria-hidden={stage !== 4}>
      <div className="stage4-frame">
        {/* 顶部条 */}
        <header className="stage4-top">
          <div className="stage4-top-left" />
          <div className="stage4-top-right">
            {/* 三个点：纯装饰 */}
            <div className="stage4-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </header>

        {/* 中间主体 */}
        <main className="stage4-main">
          {/* 左侧引用 */}
          <section className="stage4-quote">
            <p className="q1">凡算力所及，皆为牢笼；</p>
            <p className="q2">凡算力不及，即为漏洞。</p>
          </section>

          {/* 右侧大字导航 + 英文 */}
          <section className="stage4-hero">
            <button className="stage4-hero-link" onClick={() => go('/projects')}>
              <span className="hero-cn">/ 项目</span>
              <span className="hero-en">PROJECTS</span>
            </button>

            <button className="stage4-hero-link" onClick={() => go('/skills-and-hobbies')}>
              <span className="hero-cn">/ 技能和爱好</span>
              <span className="hero-en">SKILLS AND HOBBIES</span>
            </button>
          </section>
        </main>

        {/* 底部条 */}
        <footer className="stage4-bottom">
          <div className="stage4-bottom-left">
            <div className="stage4-bottom-inner left">
              <div className="stage4-june">JUNE</div>

              <div className="stage4-roles">
                <div>软件开发</div>
                <div>软件测试</div>
              </div>
            </div>
          </div>

          <div className="stage4-bottom-divider" />

          <div className="stage4-bottom-right">
            <div className="stage4-bottom-inner right">
              <div>mJune_Jiang@outlook.com</div>
              <div>https://github.com/MJ-Jiang</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
