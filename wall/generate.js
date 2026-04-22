#!/usr/bin/env node
/**
 * 嘉宾项目展示墙 · 自动生成脚本
 *
 * 扫描 episodes/ 下各期次，从 README.md 的 YAML frontmatter 读取信息，
 * 生成 manifest.json；可选同时生成 index.html。
 *
 * 用法：node generate.js [--html]
 * 或：  node generate.js          # 只生成 manifest.json
 *       node generate.js --html   # 同时生成 index.html
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EPISODES_DIR = path.join(ROOT, 'episodes');
const WALL_DIR = path.join(ROOT, 'wall');
const MANIFEST_PATH = path.join(WALL_DIR, 'manifest.json');
const CONFIG_PATH = path.join(WALL_DIR, 'config.json');

function loadWallConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (_) {
    return {};
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = match[1];
  const data = {};
  for (const line of yaml.split('\n')) {
    const m = line.match(/^([\w_]+):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim();
  }
  return data;
}

function getWorkshopFiles(episodeDir) {
  const workshopDir = path.join(episodeDir, 'workshop');
  if (!fs.existsSync(workshopDir)) return [];
  return fs.readdirSync(workshopDir)
    .filter((f) => /\.(md|txt)$/i.test(f))
    .sort();
}

function scanEpisodes() {
  if (!fs.existsSync(EPISODES_DIR)) return [];
  const dirs = fs.readdirSync(EPISODES_DIR)
    .filter((name) => {
      const full = path.join(EPISODES_DIR, name);
      return fs.statSync(full).isDirectory() && /^\d{4}-\d{2}-\d{2}_/.test(name);
    })
    .sort()
    .reverse();

  const projects = [];
  for (const dirName of dirs) {
    const episodePath = path.join(EPISODES_DIR, dirName);
    const readmePath = path.join(episodePath, 'README.md');
    if (!fs.existsSync(readmePath)) continue;

    const readme = fs.readFileSync(readmePath, 'utf8');
    const fm = parseFrontmatter(readme);
    const guest = (fm && fm.guest) || dirName.replace(/^\d{4}-\d{2}-\d{2}_/, '');
    const date = (fm && fm.date) || dirName.slice(0, 10);
    const project_name = (fm && fm.project_name) || '';
    const project_summary = (fm && fm.project_summary) || '';
    const project_author = (fm && fm.project_author) || guest;
    const project_link = (fm && fm.project_link) || '';
    const logo = (fm && fm.logo) || '';
    const xiaohongshu_post_title = (fm && fm.xiaohongshu_post_title) || '';
    const xiaohongshu_post_url = (fm && fm.xiaohongshu_post_url) || '';
    const xiaohongshu_post_excerpt = (fm && fm.xiaohongshu_post_excerpt) || '';
    const xiaohongshu_post_quotes = (fm && fm.xiaohongshu_post_quotes) || '';
    const xiaohongshu_post_title_2 = (fm && fm.xiaohongshu_post_title_2) || '';
    const xiaohongshu_post_url_2 = (fm && fm.xiaohongshu_post_url_2) || '';
    const xiaohongshu_post_excerpt_2 = (fm && fm.xiaohongshu_post_excerpt_2) || '';
    const xiaohongshu_post_quotes_2 = (fm && fm.xiaohongshu_post_quotes_2) || '';
    const project_type = (fm && fm.project_type) || '';
    const show_workshop_on_wall = (fm && fm.show_workshop_on_wall !== undefined)
      ? (String(fm.show_workshop_on_wall).toLowerCase() === 'true')
      : true;

    const workshop_files = getWorkshopFiles(episodePath);

    projects.push({
      episode: dirName,
      guest,
      date,
      project_name,
      project_type,
      project_summary,
      project_author,
      project_link,
      logo,
      xiaohongshu_post_title,
      xiaohongshu_post_url,
      xiaohongshu_post_excerpt,
      xiaohongshu_post_quotes,
      xiaohongshu_post_title_2,
      xiaohongshu_post_url_2,
      xiaohongshu_post_excerpt_2,
      xiaohongshu_post_quotes_2,
      show_workshop_on_wall,
      workshop_files: show_workshop_on_wall ? workshop_files : [],
      recap_path: `episodes/${dirName}/recap.md`,
    });
  }
  return projects;
}

function writeManifest(projects) {
  const json = {
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    count: projects.length,
    projects,
  };
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(json, null, 2), 'utf8');
  console.log('Written:', MANIFEST_PATH, `(${projects.length} projects)`);
}

function writeHtml(projects) {
  const config = loadWallConfig();
  const xhs = (config.xiaohongshu || {});
  const xhsName = xhs.account_name || '';
  const xhsUrl = xhs.account_url || '';

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vibe Coding 急诊室 · 嘉宾项目墙</title>
  <style>
    :root { --bg: #1a1a1e; --card: #25252c; --text: #e4e4e7; --muted: #71717a; --accent: #a78bfa; }
    * { box-sizing: border-box; }
    body { font-family: "SF Pro Text", -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 2.5rem 3rem; line-height: 1.5; }
    .wall-header { text-align: center; margin-top: 0.5rem; margin-bottom: 2.5rem; }
    .wall-header .clinic-logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; display: block; margin: 0 auto 0.75rem; border: 2px solid rgba(255,255,255,0.08); }
    .wall-header h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.35rem; }
    .sub { color: var(--muted); font-size: 0.85rem; margin-bottom: 0; }
    .wall { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
    .card { background: var(--card); border-radius: 12px; padding: 1.25rem; border: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; transition: border-color 0.2s, box-shadow 0.2s; }
    .card:hover { border-color: rgba(255,255,255,0.12); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    @media (max-width: 768px) {
      body { padding: 1.25rem 1rem; }
      .wall-header { margin-bottom: 1.75rem; }
      .wall { display: block; column-count: 2; column-gap: 0.75rem; }
      .card { break-inside: avoid; margin-bottom: 0.75rem; padding: 1rem; }
    }
    .card .card-top { margin-bottom: 0.75rem; }
    .card .logo { width: 56px; height: 56px; border-radius: 12px; object-fit: cover; margin-bottom: 0.5rem; background: rgba(255,255,255,0.06); }
    .card .logo.placeholder { background: var(--accent); opacity: 0.3; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--text); }
    .card .card-name { font-size: 1.05rem; font-weight: 600; margin-bottom: 0.25rem; line-height: 1.3; }
    .card .card-summary { font-size: 0.85rem; color: var(--muted); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .card .card-recap { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.08); }
    .card .card-recap summary { font-size: 0.8rem; font-weight: 600; color: var(--text); cursor: pointer; list-style: none; user-select: none; padding: 0.25rem 0; outline: none; }
    .card .card-recap summary:focus-visible { color: var(--accent); }
    .card .card-recap summary::-webkit-details-marker { display: none; }
    .card .card-recap summary::after { content: " ▶"; font-size: 0.7em; color: var(--muted); }
    .card .card-recap[open] summary::after { content: " ▼"; }
    .card .card-recap .recap-body { margin-top: 0.4rem; }
    .card .card-recap .recap-item { margin-bottom: 0.6rem; font-size: 0.8rem; }
    .card .card-recap .recap-item a { color: var(--accent); text-decoration: none; }
    .card .card-recap .recap-item a:hover { text-decoration: underline; }
    .card .card-recap .recap-item .recap-excerpt { margin-top: 0.2rem; color: var(--muted); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
    .card .project_link { margin-top: 0.5rem; font-size: 0.85rem; }
    .card .project_link a { color: var(--accent); text-decoration: none; }
    .card .project_link a:hover { text-decoration: underline; }
    .wall-header .xhs-account { margin-top: 0.75rem; font-size: 0.9rem; }
    .wall-header .xhs-account a { color: var(--accent); text-decoration: none; }
    .wall-header .xhs-account a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header class="wall-header">
    <img class="clinic-logo" src="clinic-logo.png" alt="Vibe Coding 急诊室" />
    <h1>Vibe Coding 急诊室 · 嘉宾项目墙</h1>
    <p class="sub">嘉宾的 vibe coding 项目集合 · 共 ${projects.length} 个</p>
    ${xhsName && xhsUrl ? '<p class="xhs-account">小红书：<a href="' + xhsUrl + '" target="_blank" rel="noopener">' + xhsName + '</a></p>' : ''}
  </header>
  <div class="wall" id="wall"></div>
  <script>
    const projects = ${JSON.stringify(projects)};
    const base = location.pathname.replace(/\\/?index\\.html$/, '') || '/';
    const repo = base.includes('wall') ? base.replace(/\\/wall.*$/, '') : (base + '../');
    const repoBase = (typeof GHPAGES_BASE !== 'undefined' && GHPAGES_BASE) ? GHPAGES_BASE : repo;
    document.getElementById('wall').innerHTML = projects.map(p => {
      const baseSlash = repoBase.replace(/\\/?$/, '') + '/';
      const logoUrl = p.logo ? (p.logo.startsWith('http') ? p.logo : baseSlash + p.logo.replace(/^\\//, '')) : '';
      const logoEl = logoUrl ? '<img class="logo" src="' + logoUrl + '" alt="" loading="lazy" />' : '<div class="logo placeholder">◆</div>';
      const top = '<div class="card-top">' + logoEl + '<div class="card-name">' + (p.project_name || '—') + '</div></div>';
      const summaryEl = '<div class="card-summary">' + (p.project_summary || '').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
      const linkEl = p.project_link ? '<div class="project_link"><a href="' + p.project_link + '" target="_blank" rel="noopener">访问项目 →</a></div>' : '';
      const post1 = p.xiaohongshu_post_title ? { title: p.xiaohongshu_post_title, url: p.xiaohongshu_post_url || '', excerpt: p.xiaohongshu_post_excerpt || '' } : null;
      const post2 = p.xiaohongshu_post_title_2 ? { title: p.xiaohongshu_post_title_2, url: p.xiaohongshu_post_url_2 || '', excerpt: p.xiaohongshu_post_excerpt_2 || '' } : null;
      const recapItems = [post1, post2].filter(Boolean).map(function(post) {
        const ex = post.excerpt ? '<div class="recap-excerpt">' + post.excerpt.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>' : '';
        const titleEsc = post.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const linkOrText = post.url ? '<a href="' + post.url + '" target="_blank" rel="noopener">' + titleEsc + '</a>' : '<span>' + titleEsc + '</span>';
        return '<div class="recap-item">' + linkOrText + ex + '</div>';
      }).join('');
      const recapEl = recapItems ? '<details class="card-recap"><summary>Vibe Coding 急诊室复盘</summary><div class="recap-body">' + recapItems + '</div></details>' : '';
      const inner = top + summaryEl + linkEl + recapEl;
      return '<div class="card"><div class="card-inner">' + inner + '</div></div>';
    }).join('\\n');
  </script>
</body>
</html>
`;
  const outPath = path.join(WALL_DIR, 'index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Written:', outPath);
}

function main() {
  const projects = scanEpisodes();
  writeManifest(projects);
  if (process.argv.includes('--html')) writeHtml(projects);
}

main();
