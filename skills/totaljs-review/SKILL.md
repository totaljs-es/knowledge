---
name: totaljs-review
description: Use when you review a Total.js 5 change (a diff, a file, a pull request) against the conventions of these pages.
---

# Review a Total.js 5 change

Review the bounded feature with its callers. Pages: [workflow](../../conventions/general/workflow.md), [actions](../../conventions/backend/actions.md), [routes and auth](../../conventions/backend/routes-and-auth.md), [queries](../../conventions/database/queries.md), [components](../../conventions/frontend/components.md), [binding and forms](../../conventions/frontend/binding-and-forms.md).

## First, the script

```bash
node ${CLAUDE_SKILL_DIR}/../../tools/check.js path/to/changed/files
```

Treat `error` as a defect and `warn` as a mismatch to confirm: existing code may keep a legacy form (slash action names, untranslated messages) that you must not rewrite unrelated to the change. `style` is a preference for new code.

## Then, by reading

- Input is declared; ownership, permission and business checks are in the action. Menu visibility is not authorization. Every response path answers once.
- Storage: the app's existing model, safe parameters, request-bound errors (`.promise($)`), the response shape the caller expects.
- Names: `|` in action and schema names; when a name changes, registrations, route targets and callers change together and public URLs stay.
- No dependency or wrapper where a native call exists; `MODS` for loaded modules; no `require()` of Node.js modules in application code.
- Interface: matching jComponent major, `exec` for clicks, `exports.tapi` for calls, form importer and caller refresh, `@(Text)`, scoped `CLASS`.
- Standalone actions: `name`, `summary`, `input`, `output`, secrets only in `config`, a test that needs no network ([action kits](../../conventions/backend/action-kits.md)).

## Report

For each finding: file and line, the problem, the page or reference file that supports it, the smallest fix and how to verify it. Separate runtime defects, contract changes, convention mismatches and optional simplifications. Do not present a project preference as a framework requirement. Say which checks ran and which could not; if nothing remains, say that without implying runtime checks that were not done.
