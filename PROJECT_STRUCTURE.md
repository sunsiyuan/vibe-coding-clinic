# Vibe Coding 急诊室｜项目结构说明

本仓库为「Vibe Coding 急诊室」服务，用于记录每期嘉宾访谈、项目产出，以及运营材料。节目形式为腾讯会议：嘉宾介绍自己的 vibe coding 项目，分享心路历程，一起讨论项目痛点与解法；每期结束后适当剪辑发在社媒。最终目标之一：把所有嘉宾的项目展示在一面「项目墙」网页上（可自动生成）。

---

## 目录结构概览

```
vibe-coding-clinic/
├── README.md                    # 项目说明 + 展示墙入口
├── PROJECT_STRUCTURE.md         # 本文件：结构说明与约定
│
├── episodes/                    # 按期次记录的嘉宾访谈（每期一个文件夹）
│   └── YYYY-MM-DD_嘉宾昵称/
│       ├── README.md            # 本期简介（嘉宾、主题、日期、项目名）
│       ├── recap.md             # 复盘文档（访谈内容为主，不含敏感数据）
│       └── workshop/            # 本期 workshop 产出（小说、文档等）
│
├── wall/                        # 嘉宾项目展示墙（网页 + 自动生成）
│   ├── index.html               # 展示页（可由脚本生成）
│   ├── manifest.json            # 项目清单（由脚本扫描 episodes 生成）
│   └── generate.js               # 扫描 episodes，生成 manifest + 可选 HTML
│
└── _ops/                        # 运营用（数据、小红书等，对外价值较低）
    ├── 数据/                    # 场次数据汇总（人数、停留等，非原始数据）
    ├── 小红书发文思路/          # 行文思路、配图规划等
    └── 小红书发文正文/          # 发文正文、封面文案等
```

---

## 一、episodes/（期次）

- **用途**：每期嘉宾访谈一个文件夹，记录该期嘉宾、主题、复盘与 workshop 产出。
- **命名**：`YYYY-MM-DD_嘉宾昵称`，例如 `2025-03-06_yutou`。
- **约定**：
  - **README.md**：本期简介，建议包含 YAML frontmatter（便于展示墙脚本解析）：
    - `guest`：嘉宾昵称
    - `date`：访谈日期（YYYY-MM-DD）
    - `project_name`：项目名称
    - `project_summary`：简述（如「都市惊悚短篇，AI协作写作」），项目墙只展示此项，不展示类型
    - **`project_author`**：项目作者（当前不在卡片上展示，仅存于 manifest，可选填）
    - **`project_link`**：项目链接（外链或本仓库内路径，可选）
    - **`logo`**：项目 logo 图片 URL 或相对路径（如 `episodes/2025-03-06_xxx/logo.png`），可选
    - **`show_workshop_on_wall`**：是否在项目墙展示本期 workshop 文件列表，设为 `false` 时不展示
    - **`xiaohongshu_post_title`** / **`xiaohongshu_post_url`**：第一篇标题（超链）
    - **`xiaohongshu_post_excerpt`**：第一篇摘要（项目墙仅展示 1 行，建议写一句精炼句）
    - **`xiaohongshu_post_title_2`** / **`xiaohongshu_post_url_2`** / **`xiaohongshu_post_excerpt_2`**：第二篇同上（可选）
    - 项目墙卡片不展示类型、不展示作者、不展示金句与 workshop 文件列表；复盘区「Vibe Coding 急诊室复盘」默认折叠，点击展开，每篇为标题链接 + 摘要（1 行）
  - **recap.md**：复盘文档，以访谈内容为主；**不放入敏感或大批量原始数据**。
  - **workshop/**：本期 workshop 产出的文件（如小说正文、世界观文档等），即「嘉宾的 vibe coding 项目」内容。
- **数据**：复盘里可以写总结性数据；详细数据放在 `_ops/数据/`，不放在 episodes 下。

---

## 二、wall/（嘉宾项目展示墙）

- **用途**：把所有嘉宾的 vibe coding 项目展示在一面墙上，理想形态是一个网页（可自动生成）。
- **卡片展示顺序**：① **logo**（56px）② **项目名** ③ **简述**（最多 3 行）④ **访问项目**（若有链接）⑤ **Vibe Coding 急诊室复盘**（默认折叠，点击展开；两篇小红书：标题链接 + 摘要 1 行）。不展示类型、不展示作者。
- **机制**：
  - `generate.js`（或其它脚本）扫描 `episodes/` 下各期的 README 与 workshop 内容，生成 `manifest.json`。
  - 展示页 `index.html` 可手写或由脚本根据 manifest 生成；展示「嘉宾昵称 + 项目名 + 日期 + 链接/摘要」等。
- **manifest 约定**：脚本从每期 `episodes/YYYY-MM-DD_昵称/README.md` 的 YAML frontmatter 读取：`guest`、`date`、`project_name`、`project_summary`、`project_author`、`project_link`、`logo`、`show_workshop_on_wall`、两篇小红书字段，以及 `workshop/` 下的文件列表（当 `show_workshop_on_wall` 为 false 时不在墙内展示 workshop）。

---

## 三、_ops/（运营材料）

- **用途**：数据汇总、小红书发文思路与发文正文等，单独集中管理。
- **对外**：不强调保密，但对外价值较低，主要给运营/复盘使用；展示墙与对外介绍不依赖此目录。
- **子目录建议**：
  - **数据/**：场次访谈人数等汇总（不放大批量原始数据）。
  - **小红书发文思路/**：行文思路、配图规划、封面文案思路等。
  - **小红书发文正文/**：最终发文正文、封面文字等。

---

## 四、新增一期时的操作

1. 在 `episodes/` 下新建文件夹：`YYYY-MM-DD_嘉宾昵称`。
2. 新建该期的 `README.md`（含嘉宾、主题、项目名、一句话描述）。
3. 访谈中若有 workshop，将产出放入 `workshop/`。
4. 访谈结束后写 `recap.md`（复盘以访谈内容为主）。
5. 如需更新展示墙：在项目根目录执行 `wall/generate.js`（或对应命令），生成 `manifest.json` 与可选 `index.html`。
6. 数据、小红书材料放入 `_ops/` 对应子目录。

---

## 五、GitHub Pages 部署

项目墙可直接用 **GitHub Pages** 发布为静态站：

1. 在仓库 **Settings → Pages** 中，Source 选 **Deploy from a branch**，Branch 选 `main`（或当前主分支），Folder 选 **/ (root)**，保存。
2. 推送后访问：`https://<你的用户名>.github.io/<仓库名>/wall/index.html` 即为项目墙。
3. 若希望项目墙在根路径（如 `https://xxx.github.io/sunge-ai-clinic-hours/` 打开即展示墙），可新建分支 `gh-pages`，只把 `wall/` 下的 `index.html`、`manifest.json` 及可能用到的资源放到该分支根目录，并在 Pages 里选择该分支发布；或使用 GitHub Actions 在推送时自动构建并发布到 `gh-pages`。

当前生成的 `index.html` 使用相对路径（`../episodes/...`），在「从本仓库根目录发布」时，链接会正确指向仓库内的 episode 与 workshop 文件。

## 六、关于数据与隐私

- **episodes**：只放复盘内容与 workshop 产出，不放敏感或大批量原始数据。
- **直播数据**：汇总性、结论性数据可写在复盘里；详细数据放 `_ops/直播数据/`。
- **展示墙**：仅展示项目名、简述、项目链接、logo 与「Vibe Coding 急诊室复盘」内两篇小红书（标题链接 + 摘要），不展示项目作者、类型、金句、workshop 文件列表与运营数据。
