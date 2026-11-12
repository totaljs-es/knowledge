# jComponent 20: the official guides

How to use the elements of the interface library of Total.js in HTML, and how to write a component. These pages are the guides of the Total.js team, copied without changes from the repository of the components, so that they are here with the rest:

- Source: <https://github.com/totaljs/components> (`docs/api.md` and `docs/aicontext/`), revision `f3ac05f7`.
- License: MIT, Copyright (c) Peter Širka. The notice is in [LICENSE](LICENSE).
- Update them from the source; do not edit them here.
- `component-development.md` mentions `jcomponent-components.md`, a page that the source does not have either.

| Page | What it is |
|---|---|
| [ui-component.md](aicontext/ui-component.md) | Use a component in HTML with `<ui-component>`: `name`, `path`, `config`, `default` |
| [ui-bind.md](aicontext/ui-bind.md) | Bind data to HTML with `<ui-bind>`: text, HTML, templates, classes, visibility |
| [ui-plugin.md](aicontext/ui-plugin.md) | A screen with its own scope: `<ui-plugin>` and `PLUGIN()` |
| [ui-import.md](aicontext/ui-import.md) | Load a part of the interface when it is needed with `<ui-import>` |
| [api.md](api.md) | The methods of the library and what a component can implement |
| [component-development.md](aicontext/component-development.md) | Write a new component from a description: contract, hooks, data flow, verification |

The catalogue of the published components, with a live preview of each, is <https://componentator.com>. The templates of a `ui-bind` are [Tangular](../../conventions/frontend/tangular.md), and the applications [`apps/board`](../../apps/board) and [`apps/chat`](../../apps/chat) use these elements in screens that were checked in a browser.
