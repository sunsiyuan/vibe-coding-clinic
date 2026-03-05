# 观众项目展示墙

本目录用于生成并展示「孙哥的 AI 急诊时间」连线观众的 AI 项目集合页。每个项目卡片按以下顺序展示：① **logo**（56px）② **项目名** ③ **简述**（最多 3 行）④ **访问项目**（若有）⑤ **AI急诊时间复盘**（默认折叠，点击展开；两篇小红书：标题链接 + 摘要 1 行）。不展示类型与作者。

- **页面顶部**：使用直播室头像 **clinic-logo.png** 作为项目墙的大 logo（居中展示），与标题「孙哥的 AI 急诊时间 · 观众项目墙」一起呈现。替换 logo 时只需覆盖本目录下的 `clinic-logo.png` 并重新生成或直接刷新页面即可。

## 生成方式

在项目根目录执行：

```bash
node wall/generate.js        # 只生成 manifest.json
node wall/generate.js --html  # 同时生成 manifest.json 与 index.html
```

脚本会扫描 `episodes/` 下每场连线的 `README.md`，从 YAML frontmatter 读取：

- `guest`、`date`、`project_name`、`project_summary`
- **`project_link`**：项目链接（外链或本仓库路径，可选）
- **`logo`**：logo 图片 URL 或相对路径（如 `episodes/2025-03-06_xxx/logo.png`），可选（卡片上 56px 展示）
- **`project_author`**：项目作者（当前不在卡片展示，可选填，存于 manifest）
- 「AI急诊时间复盘」默认折叠，点击展开；每篇：**标题（超链）** + **摘要（1 行）**；不展示金句与 workshop 文件列表
- 第一篇：`xiaohongshu_post_title` / `xiaohongshu_post_url` / `xiaohongshu_post_excerpt`
- 第二篇（可选）：`xiaohongshu_post_title_2` / `xiaohongshu_post_url_2` / `xiaohongshu_post_excerpt_2`

以及 `workshop/` 下的文件列表（不在卡片上展示）。

**小红书主账号**：在 `wall/config.json` 中配置 `xiaohongshu.account_name` 与 `xiaohongshu.account_url`，页面头部会展示对应链接（与直播室头像复用同一头像）。

输出：

- **manifest.json**：项目清单
- **index.html**（加 `--html` 时）：单页展示墙

## 展示页

直接用浏览器打开 `wall/index.html` 即可查看。页面内链接为相对路径，在「从仓库根目录发布」时（如 GitHub Pages 选 root）会正确指向各 episode 与 workshop 文件。

## GitHub Pages 部署

可以**直接用 GitHub Pages** 发布：

1. 仓库 **Settings → Pages**：Source 选 **Deploy from a branch**，Branch 选 `main`，Folder 选 **/ (root)**。
2. 推送代码后访问：`https://<用户名>.github.io/<仓库名>/wall/index.html` 即为项目墙。

若希望打开仓库首页即进入项目墙，可另建 `gh-pages` 分支，仅放 `wall/` 内容到该分支根目录，并在 Pages 里选择该分支发布。
