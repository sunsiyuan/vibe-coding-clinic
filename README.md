# Vibe Coding 急诊室

本仓库为「Vibe Coding 急诊室」服务，用于记录每期嘉宾访谈、项目产出与运营材料。

节目形式为腾讯会议，嘉宾介绍自己的 vibe coding 项目，分享心路历程，一起讨论项目痛点与解法。每期结束后适当剪辑发在社媒。

## 嘉宾项目墙

所有嘉宾的 vibe coding 项目会汇总在一面「项目墙」上展示：

- **在线查看**：[https://sunsiyuan.github.io/sunge-ai-clinic-hours/wall/index.html](https://sunsiyuan.github.io/sunge-ai-clinic-hours/wall/index.html)（GitHub Pages）
- **本地查看**：打开 [wall/index.html](wall/index.html)（需先执行一次生成，见下）
- **生成**：在项目根目录执行 `node wall/generate.js --html`，会扫描 `episodes/` 并生成 `wall/manifest.json` 与 `wall/index.html`
- **小红书主账号**：在 `wall/config.json` 配置账号名与链接后，项目墙头部会展示对应账号入口

## 项目结构

| 目录 | 说明 |
|------|------|
| **episodes/** | 每期一个文件夹（`YYYY-MM-DD_嘉宾昵称`），内含 README、复盘 recap、workshop 产出 |
| **wall/** | 嘉宾项目展示墙：生成脚本、manifest、展示页 |
| **_ops/** | 运营材料：数据汇总、小红书发文思路与正文（对外价值较低，仅作内部使用） |

详细约定与新增场次流程见 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)。
