import { defineConfig } from "vitepress";
import AutoNav from "vite-plugin-vitepress-auto-nav";
import { resolve } from "path";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LWG Study",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: "Home", link: "/" },
    //   { text: "Examples", link: "/markdown-examples" },
    // ],

    // sidebar: [
    //   {
    //     text: "Java学习资料",
    //     items: [
    //       { text: "第一章", link: "/chapter1" },
    //       { text: "第二章", link: "/chapter2" },
    //     ],
    //   },
    // ],

    socialLinks: [
      { icon: "github", link: "https://gitee.com/gasj0ee/java_No1_knowledge/tree/master/" },
    ],
  },
  vite: {
    base: "./",
    server: {
      port: 6657,
    },
    plugins: [
      AutoNav({
        pattern: ["**/!(README|TODO).md"],
        itemsSetting: {
          "Intro": { hide: true },
        },
        useArticleTitle: true
      })
    ]
  }
});
