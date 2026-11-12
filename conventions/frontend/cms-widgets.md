# CMS widgets

A CMS widget is a reusable editable content block. Preserve the catalogue's native single-file format, `widgets/<id>.html`; a widget is not a jComponent registration or a standalone web page. Inspect the consuming CMS before choosing APIs: the reference CMS uses Framework 5 on the server and jComponent v19 in the admin. The backend major does not determine the browser UI major.

## Sections

| Section | Purpose |
| --- | --- |
| `<script total>` | Metadata and optional server hooks |
| `<settings>` | Editor controls and optional settings script/style |
| `<style>` | Widget CSS |
| `<body>` | Initial editable content |
| `<script>` outside settings/body | Optional public browser code |
| `<template>` | Optional render template |
| `<readme>` | Purpose, defaults, allowed values and dependencies |

Use exact lowercase section tags. The CMS extracts settings before other sections, so its nested script/style stay inside settings. Metadata follows existing widgets: `exports.id`, `name`, `author`, `version`, `preview`, and `config` when needed. Match the id and filename; check existing ids and names. Preview is an embedded image, not a separate required catalogue file.

## Scope and settings

The compiler replaces `CLASS` with `w-<normalized-widget-id>` in CSS, settings, body, public JS and template. That prefix belongs to the widget type and is shared by its instances. Scope CSS with `.CLASS`/`.CLASS-...`; change an individual instance through the `el` argument rather than a global selector or fixed DOM id.

Settings controls use `?.key` paths corresponding to defaults in `exports.config`. Their `<script>` may export `check(config, el)`, `load(config, el)` and `save(config, el)`. Defaults must match the initial body. Document finite values such as status/alignment explicitly; validate them before constructing classes or styles. Apply cosmetic changes without replacing edited text, repeated blocks or nested widgets. Repeated saves must be safe.

Use the existing editor markers where appropriate: `CMS_edit`, `CMS_remove`, `CMS_repeat`, `CMS_attribute` and `CMS_widgets` for nested content. Visitor content remains editable content, rather than being converted into fixed admin translation keys. Follow the consuming CMS's localization path for settings UI.

## Server rendering

A static widget normally needs no render hook. A dynamic widget may export `render(opt, next)` in `<script total>`. The CMS supplies instance configuration in `opt.config`, inner markup in `opt.html`, the whole body in `opt.body` and the render template in `opt.template`. Other page/user context is optional.

Call `next(content, replace, cache)` exactly once on success, empty and failure paths. The default keeps the wrapper; `replace: true` removes it. Cache only output that is safe to share within the CMS cache scope. Do not assume incoming saved config contains newly added defaults.

The server script is evaluated before scoping and is not rewritten: never return unresolved CLASS placeholders from a server render hook. Reuse scoped markup or emit known classes explicitly. Encode text inserted into server HTML with `.encode()`; use `.text()` in editor DOM. Public scripts cannot assume the admin's library or state is loaded on every site layout.

## Verification and AI guidance

Give agents the native format, actual hook contracts, compatible examples, a short creation/review workflow and commands that check the artifact. Keep a shared skill/checklist instead of divergent copies for each agent. Generate model indexes from the maintained pages and check links and commands. Preserve existing catalogue files when adding an authoring kit; tooling and examples do not need a catalogue migration.

Check with the real parser/compiler, then browser settings and published rendering. Test edited content, nested slots, repeated saves, two configurations, empty/long/HTML-like text and desktop/mobile widths. Open a screenshot of the final widget before accepting its appearance. Chromium can be installed by Playwright; Chrome is an alternative. An isolated browser harness does not prove complete CMS editor integration. See [native tests](../general/testing.md).

## References

- [CMS definitions/func.js](https://github.com/totaljs/cms/blob/2d3e9471c166a31e33ea9e93e32bb9a501ebcc9c/definitions/func.js): FUNC.recompile, sections and CLASS substitution.
- [CMS widget template](https://github.com/totaljs/cms/blob/2d3e9471c166a31e33ea9e93e32bb9a501ebcc9c/public/widget.txt), [editor](https://github.com/totaljs/cms/blob/2d3e9471c166a31e33ea9e93e32bb9a501ebcc9c/public/cmseditor/index.html), [admin layout](https://github.com/totaljs/cms/blob/2d3e9471c166a31e33ea9e93e32bb9a501ebcc9c/views/admin.html): hooks, markers and UI version.
- [Framework 5 cms.js](https://github.com/totaljs/framework5/blob/7d2d553fc774090081b4e3b1ae75a52ef06b42b8/cms.js): rendering, wrappers and cache.
- [CMS widget authoring kit](https://github.com/totaljs-es/cms-widgets/blob/63892ff/AGENTS.md): runnable examples, checks, skills and embedded previews.
