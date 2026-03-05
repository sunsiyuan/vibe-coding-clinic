# 孙哥的 AI 急诊时间

本仓库为直播项目「孙哥的 AI 急诊时间」服务，用于记录每次连线、观众 AI 项目产出与运营材料。

## 观众项目墙

所有连线观众的 AI 项目会汇总在一面「项目墙」上展示：

- **查看**：打开 [wall/index.html](wall/index.html) 即可（需先执行一次生成，见下）
- **生成**：在项目根目录执行 `node wall/generate.js --html`，会扫描 `episodes/` 并生成 `wall/manifest.json` 与 `wall/index.html`
- **小红书主账号**：在 `wall/config.json` 配置账号名与链接后，项目墙头部会展示「小红书：孙哥火星殖民计划」等（与直播室头像复用同一头像）

## 项目结构

| 目录 | 说明 |
|------|------|
| **episodes/** | 每场连线一个文件夹（`YYYY-MM-DD_观众昵称`），内含 README、复盘 recap、workshop 产出 |
| **wall/** | 观众项目展示墙：生成脚本、manifest、展示页 |
| **_ops/** | 运营材料：直播数据汇总、小红书发文思路与正文（对外价值较低，仅作内部使用） |

详细约定与新增场次流程见 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)。
