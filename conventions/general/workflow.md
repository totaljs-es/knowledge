# Writing and correcting Total.js apps

Use this workflow with the pages for the affected zone.

## Before writing

1. Read the target project's instructions, entry point, dependencies and nearest working feature. Identify the backend version, browser UI major, storage model and route registration pattern.
2. Select the nearest existing feature of the target project with the same storage model. Read its route, action, screen and form together.
3. Record the contracts you must preserve: URL and action ID, body/query/params, response envelope, permission IDs, settings keys and plugin/model paths.
4. Find the native helper or existing component before creating a wrapper. See [native patterns](native-patterns.md). Read only the component documentation compatible with the app's UI version.

## Write a feature

Implement the same direct flow as the reference: route → validated action → existing storage → one response, with the UI calling that endpoint and binding its result. Keep `exports`, `$`, `model`, `self`, `config`, `cls` and familiar field names. Add only the files the feature needs. Keep business checks in the action; input validation does not establish ownership or authorization.

For SQL-backed features follow [queries](../database/queries.md) and add the schema upgrade if needed. For memory/FileStorage features use the app's existing load/save and cache hooks. For UI changes follow [binding and forms](../frontend/binding-and-forms.md).

## Correct existing code

Review a bounded feature or diff. For each finding record:

| Field | What to record |
|---|---|
| Location | File and line, with the concrete code |
| Rule | Page and reference file that support the finding |
| Kind | Runtime/API defect, contract change, convention mismatch or optional simplification |
| Correction | Smallest change that fixes it and the callers it affects |
| Verification | Observable result that would demonstrate the fix |

Remove duplicated validation and pass-through wrappers when a native call expresses the same behaviour. Keep ownership/business checks, cancellation, error mapping and other behaviour that the native replacement does not supply. Do not replace all storage with SQL, migrate UI versions or split actions merely to satisfy an example in this guide. Correct action/schema separators to `|` by updating registrations and callers together; check generated endpoints and preserve public URL compatibility. URL paths and plugin method paths keep their own separators.

Make corrections by coherent feature, preserving owner changes. A formatting rewrite and an endpoint redesign have different review risks; keep their intent explicit. Do not edit minified vendor assets, bundles or runtime databases as source.

## Organize files during a refactor

Apply the [project structure](project-structure.md) policy: runtime files in recognizable Total.js folders, private runtime inputs under `private/`, and documentation, evaluation material and independent examples under `docs/`. The running application must not depend on `docs/`; development tools can use its fixtures. Consume automatically loaded modules through `MODS`, while preserving standalone-tool imports.

Before deleting an old tree, remove its runtime reader, routes, generators and obsolete checks together. Preserve contracts unless the requested scope explicitly retires them. Retain the current external integration when replacing local artifacts with an external source, and keep its integrity checks. Generated/minified dependencies and historical evidence must not be silently rewritten as part of a folder move.

Check package contents and private-file allowlists, temporary export layouts, migration inputs and documentation links after moving a file. An old layout may still be intentional input to a one-time legacy migration; document that exception instead of changing what the migration reads.

## Verify the result

- Run `node --check` for changed JS; it does not cover inline scripts in HTML, templates or browser APIs.
- Exercise the affected route with valid and invalid input, anonymous and authorized users, and insufficient permissions. For record operations also check a different owner's record and a missing ID.
- Confirm the response shape expected by the caller, not just a successful HTTP status.
- In the browser, open and reopen the screen/form, create/edit/cancel, submit and confirm caller refresh. Check the served asset and console when the UI changes; test release output if compilation/minification matters.
- Use existing project checks and focused regression tests where behaviour warrants them. Record exactly what ran and what could not run, including unavailable DB, credentials or browser access.

Finish with the concrete changes, evidence and remaining limitations. A successful documentation test only validates this reference's structure; it does not prove an app follows every convention or that its runtime works.

## Project instruction snippet

Add this to a consuming project's instructions when adopting this reference:

```text
Follow the Total.js 5 knowledge of https://github.com/totaljs-es/knowledge.
Read general/workflow.md and the pages for this change.
Use the nearest compatible Total.js example. Use | between parts of action
and schema names, never / or \. Update registrations and callers together
when correcting names, checking endpoint compatibility. Preserve URLs,
permissions, storage model and UI major version during corrections.
Keep runtime inputs in private/, internal documentation and examples in docs/,
and loaded application module access through MODS. Preserve standalone-tool
imports and update package/test/export paths when moving files.
Report convention findings with file/line, rule, proposed fix and checks run.
```

## Documentation and AI kits

Keep deliverable documentation limited to contracts, setup, commands and verified limits. Do not include personal names, internal conversations, tool provenance or incidental machine details. Choose the smallest useful structure and follow the target's examples; adding an authoring kit does not authorize rewriting its catalogue.

For reusable AI guidance, use one maintained workflow per skill and pointers for the supported agents. Keep documentation indexes generated and tested. Include compatible examples and artifact-specific checks. Follow [native testing](testing.md) for the runner, dependencies and integration boundaries, and [CMS widgets](../frontend/cms-widgets.md) when the deliverable is a widget rather than a jComponent.
