// src/components/ProjectShowcase.jsx
import React, { useEffect, useRef, useState } from "react";
import { Home, ExternalLink, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Project.css";

export default function ProjectShowcase({ project }) {
  const navigate = useNavigate();

  const images = project?.images ?? [];
  const realCount = images.length;

  const [imageIndex, setImageIndex] = useState(0);

  const STRIP_SLOTS = 5;
  const totalSlots = Math.max(STRIP_SLOTS, realCount);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const stepPxRef = useRef(0);
  const maxTranslatePxRef = useRef(0);

  const [translateX, setTranslateX] = useState(0);

  const currentImage = images[imageIndex] ?? "";
  const hasPrev = imageIndex > 0;
  const hasNext = imageIndex < realCount - 1;

  function prevImage() {
    setImageIndex((i) => Math.max(0, i - 1));
  }
  function nextImage() {
    setImageIndex((i) => Math.min(realCount - 1, i + 1));
  }
  function onThumbClick(idx) {
    if (idx >= 0 && idx < realCount) setImageIndex(idx);
  }
function isHttpUrl(v) {
  if (!v) return false;
  const s = String(v).trim();
  return /^https?:\/\/\S+$/i.test(s);
}

  const goHome = () => navigate("/", { state: { startStage: 4 } });

  const slots = Array.from({ length: totalSlots }, (_, i) => images[i] ?? null);

  useEffect(() => {
    // 换项目时，回到第 1 张 + 重置位移
    setImageIndex(0);
    setTranslateX(0);
  }, [project?.id]);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    const trackEl = trackRef.current;
    if (!viewportEl || !trackEl) return;

    const computeMetrics = () => {
      const firstSlot = trackEl.querySelector(".rh-strip-slot");
      if (!firstSlot) {
        stepPxRef.current = 0;
        maxTranslatePxRef.current = 0;
        setTranslateX(0);
        return;
      }

      const slotW = firstSlot.getBoundingClientRect().width;
      const styles = window.getComputedStyle(trackEl);
      const gapStr = styles.gap || styles.columnGap || "0px";
      const gapPx = parseFloat(gapStr) || 0;
      const stepPx = slotW + gapPx;

      const viewportW = viewportEl.clientWidth;
      const trackW = trackEl.scrollWidth;
      const maxTranslatePx = Math.max(0, trackW - viewportW);

      stepPxRef.current = stepPx;
      maxTranslatePxRef.current = maxTranslatePx;

      const desired = imageIndex * stepPxRef.current;
      setTranslateX(Math.min(desired, maxTranslatePxRef.current));
    };

    computeMetrics();

    const ro = new ResizeObserver(() => computeMetrics());
    ro.observe(viewportEl);
    ro.observe(trackEl);

    window.addEventListener("resize", computeMetrics);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeMetrics);
    };
  }, [imageIndex, totalSlots, realCount]);

  useEffect(() => {
    const step = stepPxRef.current;
    const maxX = maxTranslatePxRef.current;

    if (!step || maxX === 0) {
      setTranslateX(0);
      return;
    }

    const desired = imageIndex * step;
    setTranslateX(Math.min(desired, maxX));
  }, [imageIndex]);

  return (
    <div className="rh-page">
      <div className="rh-container">
        <div className="rh-monitor">
          <div className="rh-bezel">
            <div className="rh-screen" aria-label="电脑屏幕">
              <div className="rh-screen-split">
                {/* 左侧：主图 + strip */}
                <div className="rh-screen-left" aria-label="项目图片">
                  <div className="rh-mainshot" aria-label="主图">
                    {currentImage ? (
                      <img
                        className="rh-screen-img"
                        src={currentImage}
                        alt={project?.name || "project image"}
                        draggable={false}
                      />
                    ) : (
                      <div className="rh-empty">暂无图片</div>
                    )}
                    <div className="rh-screen-gradient" />
                  </div>

                  <div className="rh-strip" aria-label="项目图片条">
                    <button
                      type="button"
                      className="rh-strip-nav"
                      onClick={prevImage}
                      disabled={!hasPrev}
                      aria-label="上一张"
                      title="上一张"
                    >
                      <span className="rh-chevron" aria-hidden="true">
                        {"<"}
                      </span>
                    </button>

                    <div className="rh-strip-viewport" ref={viewportRef} aria-label="缩略图视窗">
                      <div
                        className="rh-strip-track"
                        ref={trackRef}
                        style={{ transform: `translateX(-${translateX}px)` }}
                      >
                        {slots.map((src, idx) => {
                          const isReal = Boolean(src);
                          const isActive = isReal && idx === imageIndex;

                          return (
                            <button
                              key={`${idx}-${src ?? "empty"}`}
                              type="button"
                              className={`rh-strip-slot ${isActive ? "is-active" : ""} ${
                                isReal ? "" : "is-empty"
                              }`}
                              onClick={() => onThumbClick(idx)}
                              disabled={!isReal}
                              aria-label={isReal ? `切换到第 ${idx + 1} 张` : "占位"}
                              title={isReal ? `第 ${idx + 1} 张` : "占位"}
                            >
                              {isReal ? (
                                <img className="rh-thumb-img" src={src} alt="" draggable={false} />
                              ) : (
                                <span className="rh-slot-placeholder" aria-hidden="true" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rh-strip-nav"
                      onClick={nextImage}
                      disabled={!hasNext}
                      aria-label="下一张"
                      title="下一张"
                    >
                      <span className="rh-chevron" aria-hidden="true">
                        {">"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 右侧：文字面板 */}
                <div className="rh-screen-right" aria-label="项目信息">
                  <div className="rh-card rh-card-in-screen">
                    <div className="rh-card-hd">
                      <div className="rh-label">名称</div>
                      <div className="rh-project-name">{project?.name}</div>
                    </div>

                    <div className="rh-field">
  <div className="rh-label">网页链接</div>

  {isHttpUrl(project?.websiteUrl) ? (
    <a className="rh-link" href={project.websiteUrl} target="_blank" rel="noreferrer">
      <ExternalLink size={16} />
      <span>{project.websiteUrl}</span>
    </a>
  ) : (
    <div className="rh-link is-text" role="note" aria-label="网页链接说明">
      <ExternalLink size={16} />
      <span>{project?.websiteUrl || "暂无"}</span>
    </div>
  )}
</div>

                    <div className="rh-field">
                      <div className="rh-label">代码链接</div>
                      <a className="rh-link" href={project?.codeUrl} target="_blank" rel="noreferrer">
                        <Code2 size={16} />
                        <span>{project?.codeUrl}</span>
                      </a>
                    </div>

                    <div className="rh-field">
                      <div className="rh-label">介绍</div>
                      <p className="rh-text">{project?.intro}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底座 */}
          <div className="rh-stand" aria-hidden="true">
            <div className="rh-stand-neck" />
            <div className="rh-stand-base" />
          </div>
        </div>

        {/* 右下角主页按钮 */}
        <button className="rh-home" onClick={goHome} type="button" aria-label="回到主页">
          <Home size={18} />
          <span>主页</span>
        </button>
      </div>
    </div>
  );
}
