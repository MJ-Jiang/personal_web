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
          "这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。",
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

  // 主图索引
  const [imageIndex, setImageIndex] = useState(0);

  // 每个设备默认显示多少个缩略图框：桌面4 / 平板3 / 手机2
  const [perView, setPerView] = useState(getPerView());

  // 缩略图“窗口”左边第几个开始显示
  const [thumbStart, setThumbStart] = useState(0);

  // 固定槽位
  const STRIP_SLOTS = 5;
  const totalSlots = Math.max(STRIP_SLOTS, images.length);

  const trackRef = useRef(null);

  // 监听 resize，动态 perView
  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 当主图变化时，保证对应缩略图在可视窗口内
  useEffect(() => {
    setThumbStart((s) => clampStartForIndex(s, imageIndex, perView, totalSlots));
  }, [imageIndex, perView, totalSlots]);

  const currentImage = images[imageIndex] ?? "";

  const hasPrev = imageIndex > 0;
  const hasNext = imageIndex < images.length - 1;

  function prevImage() {
    setImageIndex((i) => Math.max(0, i - 1));
  }
  function nextImage() {
    setImageIndex((i) => Math.min(images.length - 1, i + 1));
  }

  // strip 左右：翻缩略图窗口（不是滚动条）
  function prevThumbPage() {
    setThumbStart((s) => Math.max(0, s - 1));
  }
  function nextThumbPage() {
    const maxStart = Math.max(0, totalSlots - perView);
    setThumbStart((s) => Math.min(maxStart, s + 1));
  }

  // 点击缩略图：只在有真实图片时切换主图
  function onThumbClick(realIndex) {
    if (realIndex >= 0 && realIndex < images.length) {
      setImageIndex(realIndex);
    }
  }

  // 主页按钮
  const goHome = () => {
    navigate("/", { state: { startStage: 4 } });
  };

  // 渲染槽位：真实图 or 占位
  const slots = Array.from({ length: totalSlots }, (_, i) => images[i] ?? null);

  // 箭头是否可用（缩略图窗口）
  const canThumbPrev = thumbStart > 0;
  const canThumbNext = thumbStart < Math.max(0, totalSlots - perView);

  return (
    <div className="rh-page">
      <div className="rh-container">
        <div className="rh-monitor">
          <div className="rh-bezel">
            <div className="rh-screen" aria-label="电脑屏幕">
              <div className="rh-screen-split">
                {/* 左侧：主图(16:9) + 底部 strip */}
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

                  {/* 底部 strip：无滚动条，靠 transform 翻页 */}
                  <div className="rh-strip" aria-label="项目图片条">
                    <button
                      type="button"
                      className="rh-strip-nav"
                      onClick={prevThumbPage}
                      disabled={!canThumbPrev}
                      aria-label="上一组缩略图"
                      title="上一组缩略图"
                    >
                      <span className="rh-chevron" aria-hidden="true">
                        {"<"}
                      </span>
                    </button>

                    <div className="rh-strip-viewport" aria-label="缩略图视窗">
                      <div
                        className="rh-strip-track"
                        ref={trackRef}
                        style={{
                          transform: `translateX(calc(-1 * var(--rh-thumb-step) * ${thumbStart}))`,
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
                                <img
                                  className="rh-thumb-img"
                                  src={src}
                                  alt=""
                                  draggable={false}
                                />
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
                      onClick={nextThumbPage}
                      disabled={!canThumbNext}
                      aria-label="下一组缩略图"
                      title="下一组缩略图"
                    >
                      <span className="rh-chevron" aria-hidden="true">
                        {">"}
                      </span>
                    </button>
                  </div>

                
                </div>

                {/* 右侧：文字面板（可滚动） */}
                <div className="rh-screen-right" aria-label="项目信息">
                  <div className="rh-card rh-card-in-screen">
                    <div className="rh-card-hd">
                      <div className="rh-label">名称</div>
                      <div className="rh-project-name">{project?.name}</div>
                    </div>

                    <div className="rh-field">
                      <div className="rh-label">网页链接</div>
                      <a
                        className="rh-link"
                        href={project?.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={16} />
                        <span>{project?.websiteUrl}</span>
                      </a>
                    </div>

                    <div className="rh-field">
                      <div className="rh-label">代码链接</div>
                      <a
                        className="rh-link"
                        href={project?.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
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

          {/* 底座（ */}
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

/** --- helpers --- */
function getPerView() {
  const w = window.innerWidth;
  if (w <= 600) return 2;       // 手机
  if (w <= 1000) return 3;      // 平板
  return 4;                     // 桌面
}

function clampStartForIndex(currentStart, index, perView, totalSlots) {
  const maxStart = Math.max(0, totalSlots - perView);
  let start = currentStart;

  if (index < start) start = index;
  if (index > start + (perView - 1)) start = index - (perView - 1);

  if (start < 0) start = 0;
  if (start > maxStart) start = maxStart;
  return start;
}
