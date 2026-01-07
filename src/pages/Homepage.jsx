import React from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

import useHomepageStages from '../hooks/useHomepageStages';
import Stage12 from '../components/home/Stage12';
import Stage3 from '../components/home/Stage3';
import Stage4 from '../components/home/Stage4';

export default function Homepage() {
  const navigate = useNavigate();
  const { stage, running, typed } = useHomepageStages();

  const go = (path) => navigate(path);

  const appClass = `app stage-${stage} ${running ? 'is-running' : ''}`;

  return (
    <div className={appClass} aria-label="个人网站首页">
      {/* stage1/2 */}
      <Stage12 stage={stage} />

      {/* stage3 bloom —— 保留 */}
      <div className="code-bloom" aria-hidden="true">
        <div className="bloom bloom--1" />
        <div className="bloom bloom--2" />
        <div className="bloom bloom--3" />
        <div className="grid-hint" />
      </div>

      {/* stage3 */}
      <Stage3 stage={stage} typed={typed} />

      {/* stage4 */}
      <Stage4 stage={stage} go={go} />
    </div>
  );
}
