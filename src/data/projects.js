// src/data/projects.js
export const PROJECTS = {
  resourcehub: {
    id: "p1",
    name: "明星资源站",
    intro: "这里是介绍（待填写）。你可以写 2–4 句话，说明你做了什么、你的角色、以及亮点。",
    websiteUrl: "https://www.txnlemonade.cn/",
    codeUrl: "https://github.com/MJ-Jiang/txning-resource",
    images: [
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    ],
  },

  answerbook: {
    id: "p2",
    name: "答案之书",
    intro: "本微信小程序以演员杨超越在综艺与访谈中的真实语录为内容核心，通过随机呈现的方式，为用户提供一种像被回应、被理解的体验。每一次点击都会从语录库中抽取一句话，并配合对应的音频播放，让文字与声音共同出现。项目为纯前端实现，音频与图片资源托管在阿里云 OSS 上，整体采用微信小程序原生技术栈开发，包括 WXML、WXSS 与 JavaScript，通过自定义组件完成播放与交互逻辑，将内容与技术轻量而稳定地结合在一起。",
    websiteUrl: "微信小程序搜索'你问我答超越版'",
    codeUrl: "https://github.com/MJ-Jiang/BookOfAnswer/tree/wechat-mini",
    images: [
      "/ycy1.png",
      "/ycy2.png",
    ],
  },
};
