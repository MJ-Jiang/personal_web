import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ExternalLink, Code2 } from "lucide-react";
import "../pages/ResourceHub.css";

export default function Resourcehub() {
  const navigate = useNavigate();

  const projects = useMemo(
    () => [
      {
        id: "p1",
        name: "明星资源站",
        intro:
          "这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。",
        websiteUrl: "https://www.txnlemonade.cn/",
        codeUrl: "https://github.com/MJ-Jiang/txning-resource",
        images: [
          "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
        ],
      },
    ],
    []
  );

  const project = projects[0];
  const images = project?.images ?? [];
  const realCount = images.length;

  // 主图索引
  const [imageIndex, setImageIndex] = useState(0);

  // 视觉上至少显示多少个槽位（不足用占位补）
  const STRIP_SLOTS = 5;
  const totalSlots = Math.max(STRIP_SLOTS, realCount);

  // refs
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  // 用 ref 存“步进像素”和“最大位移像素”，避免频繁 setState
  const stepPxRef = useRef(0);
  const maxTranslatePxRef = useRef(0);

  // 真实 translateX（像素）
  const [translateX, setTranslateX] = useState(0);

  // 主图
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

  const goHome = () => navigate("/", { state: { startStage: 4 } });

  // 渲染槽位：真实图 or 占位
  const slots = Array.from({ length: totalSlots }, (_, i) => images[i] ?? null);

  // ✅ 计算 stepPx 和 maxTranslatePx（只要尺寸变化就重新算）
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

      // 1) stepPx = 一个 slot 的宽度 + gap
      const slotW = firstSlot.getBoundingClientRect().width;
      const styles = window.getComputedStyle(trackEl);
      const gapStr = styles.gap || styles.columnGap || "0px";
      const gapPx = parseFloat(gapStr) || 0;
      const stepPx = slotW + gapPx;

      // 2) maxTranslatePx = trackWidth - viewportWidth（<=0 表示不能动）
      const viewportW = viewportEl.clientWidth;
      const trackW = trackEl.scrollWidth;
      const maxTranslatePx = Math.max(0, trackW - viewportW);

      stepPxRef.current = stepPx;
      maxTranslatePxRef.current = maxTranslatePx;

      // 重新 clamp 一次（比如 resize 后）
      const desired = imageIndex * stepPxRef.current;
      const nextX = Math.min(desired, maxTranslatePxRef.current);
      setTranslateX(nextX);
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

  // ✅ 关键：每次选中 index 变化，都按“推进一格”计算 translate
  //    translate = imageIndex * stepPx，直到 maxTranslatePx（最后一张贴右后不再动）
  useEffect(() => {
    const step = stepPxRef.current;
    const maxX = maxTranslatePxRef.current;

    if (!step || maxX === 0) {
      setTranslateX(0);
      return;
    }

    const desired = imageIndex * step;
    const nextX = Math.min(desired, maxX);
    setTranslateX(nextX);
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

                  {/* 底部 strip：<> 切换 imageIndex；track 自动推进并在末尾贴右 */}
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

                    <div
                      className="rh-strip-viewport"
                      ref={viewportRef}
                      aria-label="缩略图视窗"
                    >
                      <div
                        className="rh-strip-track"
                        ref={trackRef}
                        style={{
                          transform: `translateX(-${translateX}px)`,
                        }}
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
                      <a className="rh-link" href={project?.websiteUrl} target="_blank" rel="noreferrer">
                        <ExternalLink size={16} />
                        <span>{project?.websiteUrl}</span>
                      </a>
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
