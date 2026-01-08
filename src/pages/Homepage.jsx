import React, { useMemo, useEffect, useRef } from 'react';
import '../App.css';
import { useNavigate, useLocation } from 'react-router-dom';

import useHomepageStages from '../hooks/useHomepageStages';
import Stage12 from '../components/home/Stage12';
import Stage3 from '../components/home/Stage3';
import Stage4 from '../components/home/Stage4';

export default function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();

  const startStage = location.state?.startStage;

  // ✅ 只在首次进入这个组件时决定一次 initialStage，之后不再变化
  const initialStageRef = useRef(startStage === 4 ? 4 : 1);

  // ✅ 用完 startStage 立刻清掉，避免刷新/返回一直带着 4
  useEffect(() => {
    if (startStage === 4) {
      navigate('.', { replace: true, state: null });
    }
  }, [startStage, navigate]);

  const { stage, running, typed } = useHomepageStages({
    initialStage: initialStageRef.current,
  });

  const go = (path) => navigate(path);
  const appClass = `app stage-${stage} ${running ? 'is-running' : ''}`;

  return (
    <div className={appClass} aria-label="个人网站首页">
      <Stage12 stage={stage} />

      <div className="code-bloom" aria-hidden="true">
        <div className="bloom bloom--1" />
        <div className="bloom bloom--2" />
        <div className="bloom bloom--3" />
        <div className="grid-hint" />
      </div>

      <Stage3 stage={stage} typed={typed} />
      <Stage4 stage={stage} go={go} />
    </div>
  );
}
