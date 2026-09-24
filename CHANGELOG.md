# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.12.0] - 2026-09-23

### Added

- **`hub-step` takes a validity state: `[valid]`.** Tri-state — `true`, `false`, or `null` when
  nothing has been said — because the library cannot tell "this step is fine" from "nobody has
  looked yet", and collapsing the two would make every existing stepper behave as if all its steps
  failed. From it the step derives `inOrder`: the stated validity when there is one, otherwise
  whether the user has been through the step. Position no longer stands in for either.
- **`hub-step` also exposes `visited`**, set by the stepper when the step is actually reached.
  A jump over a step does not mark it, and walking back does not unmark the ones behind.
- **An inline track rail: `nav="track"`.** A numbered marker per step, joined by a connector, with
  a tick in the corner of every step that is in order — the number stays visible under it. It is a
  variant, not a replacement: `nav` defaults to `'pills'` and the rail the component has always
  drawn is untouched.
- **The track allows a forward jump only when the steps in between are in order**, and a jump back
  always. `isReachable(index)` answers the question, `isInOrder(index)` the one underneath it, and
  both are public so a custom rail can ask them too.
- **`beforeStepChange` intercepts a move before it happens**, so a wizard can save the step it is
  leaving and refuse the jump if the save fails. It runs while the stepper is still on the step
  being left; returning `false`, a promise resolving to `false`, or a promise that rejects cancels
  the move. Same contract `ng-hub-ui-portal` gives `beforeDismiss` — an output could not do this
  job, since by the time one fires the step has already changed.
- The `hubStepTrigger` context gains `visited`, `valid`, `inOrder` and `reachable`. `isCompleted`
  is left exactly as it was — `index < currentIndex` — so a template written against the old
  context reads the same.
- `IN_ORDER` joins the ten bundled dictionaries, and `inOrderLabel` overrides it per instance. It
  is the text a screen reader hears on a ticked marker.
- Track tokens: `--hub-stepper-track-*`, listed in `docs/css-variables-reference.md`. The marker
  reuses the published `--hub-stepper-indicator-size` rather than inventing a second diameter.

### Fixed

- **`goTo()` walked onto `disabled` steps.** It checked the bounds and nothing else, so a
  programmatic jump — or `goToNext()` into a disabled step — landed where the rail refused to go,
  and the two disagreed about the same wizard. It now asks `canNavigateTo()`, which is the
  permission the rail has always used. See `BREAKING_CHANGES.md`.

### Changed

- The **Continue** and **Submit** controls now consult the step's validity — the built-in buttons
  and the projected `button[nextButton]` / `button[submitButton]` alike, so the two never disagree
  about the same wizard. For a stepper that never mentions `valid` this is the same
  answer as before, to the letter: an unstated step that the user is standing on is visited, so it
  is in order. See `BREAKING_CHANGES.md`.

## [22.11.0] - 2026-09-23

### Changed

- **BREAKING — the Angular floor rises from `17.2.0` to `17.3.0`.** The old range was
  measured from the source alone, and its published `.d.ts` names `InputSignalWithTransform` or `OutputEmitterRef`, which Angular did not ship until 17.3. An application below the new floor could install this
  package and then fail to build, with an error that pointed at Angular rather than here; it now
  gets the peer warning it should always have had. Nothing that worked stops working. See
  `BREAKING_CHANGES.md`.
- **The floor is proved by running it now, not only derived.** `npm run floors:matrix` builds a real
  project pinned to the oldest Angular this package claims, installs it there, typechecks the
  published types against that version's `@angular/*` and runs that version's linker over the
  compiled output. It is what found this.

## [22.10.4] - 2026-09-23

### Changed

- **The Angular peer range now says what the code needs, not a number somebody picked.** It asked
  for `>=21.1.2`, which nothing in this package justified. The newest Angular API the source uses is
  the signal queries, which shipped in 17.2, and the partial-Ivy output the Angular linker checks carries no
  marker above it. The range is `>=17.2.0`, so applications on those versions can install this
  library instead of being turned away by a range that was never measured.
- **The floor is derived and checked from now on.** `npm run peers:floors` works it out from three
  things that can be verified — the Angular APIs the source calls, the `minVersion` markers in the
  compiled output, and the Angular types that reach the published `.d.ts` — and CI fails when a
  declaration drifts away from it again.

## [22.10.3] - 2026-09-20

### Fixed

- The version banner at the top of both READMEs announced `22.10.1` while the manifest published
  `22.10.2`. npm renders the README of each version on its package page, so the banner is what a
  reader sees before anything else, and it named a release they were not looking at.

## [22.10.2] - 2026-09-20

### Changed

- The npm keywords declare `ng-hub-ui`, the family name somebody searching for the ecosystem
  types. Metadata only: no code, types or styles change.

## [22.10.1] - 2026-09-16

### Changed

- The repository moved to the `hub-env` organization. Issues for every Hub UI package are now
  gathered in [hub-env/hub-ui](https://github.com/hub-env/hub-ui/issues), and the `repository`, `bugs`
  and README links point at the new addresses. GitHub redirects the old ones.

### Fixed

- The version banner at the top of both READMEs said the package targets Angular 21. It targets
  Angular 22, as its major version says.

## [22.10.0] - 2026-09-08

### Added

- **`hubStepTrigger` finally draws something.** The directive was exported, listed in the module and
  documented in both READMEs, and the stepper never queried it — so an `ng-template` marked with it
  was captured and then dropped on the floor. It now replaces the trigger the default rail draws,
  once per step, with the step itself as `$implicit` and `title`, `index`, `isCurrent`,
  `isCompleted` and `disabled` in the context. Retiring the directive was the other option and was
  rejected: it is published API with a name that promises exactly this, and the rail already
  rendered its trigger through a parameterised inner template, so connecting it was smaller than
  removing it. `hubStepperNav` still wins where both are present, because a custom rail draws its
  own triggers.

### Changed

- **BREAKING — the CSS block is `hub-stepper`, and the bare `stepper` goes in 23.0.0.** The host
  wore the class `stepper` and named every part under it, including three global `@keyframes`
  called `stepper-fade-in` and friends — and emulated encapsulation does not scope keyframe names,
  so those were identifiers this package planted in every application that installed it. `stepper`
  is a word in the application's namespace, not the library's: a host with a `.stepper` rule of its
  own restyled the component from outside. Every name is now prefixed, as in the rest of the
  family. No class is removed in this release — both spellings are written to the DOM and both are
  matched by the stylesheet — but the old ones are deprecated and go in 23.0.0. The three keyframe
  names are the exception and are renamed outright, with no alias: they were never named in the
  README, the API tables or `FUNCTIONALITIES.md`, so reaching one meant guessing an internal
  identifier out of the compiled stylesheet. [`BREAKING_CHANGES.md`](./BREAKING_CHANGES.md) has
  the full rename list, and the one thing the compatibility window does not cover — the opt-in and
  the flavour have to share a prefix.

### Fixed

- **A control directive buried inside a step no longer makes the stepper render no control at
  all.** `previousButton`, `nextButton` and `submitButton` are content queries, and they ran with
  Angular's default `descendants: true` while `<ng-content select="button[nextButton]">` matches
  only a direct child. So a `button nextButton` inside a step's own form was found by the query and
  could not be projected: the component believed a custom control had been supplied and drew
  nothing, leaving a wizard with no way forward. The three queries are now shallow, which is
  exactly what projection can reach. The buried button keeps working as a control — the directive
  is still applied to it — it simply no longer suppresses the built-in one.

- **The roving focus of the rail is scoped to the rail, and finds a custom trigger.** It queried
  `.stepper__nav-trigger` across the whole host, which would have picked up the tabs of a stepper
  nested inside a step panel, and which finds nothing at all once `hubStepTrigger` draws the
  trigger. It now searches inside the nav only, and accepts `[role="tab"]` as well as either
  spelling of the class.

## [22.9.0] - 2026-09-07

### Added

- **`provideHubStepper(config?: StepperConfig)` — the standalone entry point the rest of the family
  already has** (`provideHubPaginableActions`, `provideToast`, `provideHubSkeletonPresets`). Until now
  `StepperModule.forRoot()` was the only thing that registered the bundled `en` / `es` / `ca` / `eu` /
  `gl` / `ast` / `an` / `de` / `zh` / `ar` dictionaries and the `HubTranslationService` the built-in
  Back / Continue / Submit controls resolve their text through — and the module is removed in 23.0.0.
  So the announced migration cost a consumer either the ten languages, rewritten by hand, or a
  `NullInjectorError` at first render. The new function registers exactly the same providers without a
  module, and `forRoot()` now delegates to it, so the two entry points cannot drift apart.

- **`STEPPER_DICTIONARIES`, the ten bundled dictionaries exported as a plain record.** They were
  internal, which is why the migration note could not hand them over. An application that keeps a
  single translation configuration can now register only the languages it ships, or merge the stepper
  labels into a dictionary of its own, instead of retyping thirty strings. The keys stay flat — `BACK`,
  `CONTINUE`, `SUBMIT` — because that is what the component resolves once its `HUBUI.STEPPER` namespace
  misses; nesting them would silently stop matching.

### Changed

- **The 23.0.0 migration note for `StepperModule.forRoot()` names `provideHubStepper()`** instead of
  sending the reader off to rewrite ten dictionaries. Nothing changes at runtime; what changes is that
  the removal announced in 22.8.2 now has a replacement to point at.

## [22.8.2] - 2026-09-06

### Added

- **Unit specs for the seven building blocks that had none** — `StepComponent`, the `nextButton` /
  `previousButton` / `submitButton` directives, `StepperNavDirective`, `StepTriggerDirective` and
  `StepperThemeService`. Coverage stopped at `StepperComponent`, so every regression in the pieces
  around it reached a release: an input signal compared instead of read left the projected controls
  permanently disabled, and a selector written with a descendant combinator stopped matching
  altogether. Both are the kind of break the suite now catches on its own, instead of waiting for
  someone to click through the documentation page.

- **`FUNCTIONALITIES.md`** — the library shipped without the coverage matrix its siblings all carry, so
  there was no single place saying which of its features an interactive example actually demonstrates.
- **A migration note for the 22.4.0 removal of the `ng80-stepper` / `ng80-step` selectors.** The CHANGELOG
  flagged it BREAKING, but `BREAKING_CHANGES.md` jumped straight from 22.5.0 to 22.1.0. Since the major
  tracks the Angular major and can never signal a break, that file is the only warning a consumer gets —
  and an unmatched element does not fail loudly, it just stops rendering, which is the worst way to find out.

### Deprecated

- **`StepperModule` and `StepperModule.forRoot()`, marked for removal in 23.0.0.** Neither carried a
  `@deprecated` tag, so an editor gave no hint and neither did the build. The module only re-exports
  the seven standalone building blocks, and importing them directly is the whole migration.
  `forRoot()` needs a word more: it is the only thing that registers the bundled `en` / `es` / `ca` /
  `eu` / `gl` / `ast` / `an` / `de` / `zh` / `ar` dictionaries, and those dictionaries are not part of
  the public API. A standalone application names the three built-in controls through the
  `backLabel` / `continueLabel` / `submitLabel` inputs of `<hub-stepper>`, or registers its own
  dictionary under `HUBUI.STEPPER` with `provideHubTranslation()` from `ng-hub-ui-utils` — which is
  also what supplies the `HubTranslationService` the stepper's `translate` pipe injects. See
  `BREAKING_CHANGES.md`.

### Removed

- **The `console.warn` for a step declared without a title and the `console.error` for an out-of-range `goTo()`.** Neither was guarded, so both shipped inside the published bundle and wrote into the console of every consuming application — the first once per untitled step, on every render pass that created one. A library has no business logging into its host's console. Navigation is unchanged: `goTo()` still ignores an index outside the steps collection.

### Fixed

- **Projected `nextButton` and `previousButton` controls no longer arrive permanently disabled.** Both directives compared the adjacent step's `disabled` input signal itself instead of reading its value, so the expression was a function — always truthy — whenever an adjacent step existed. Every custom navigation button a consumer projected was therefore inert and only the built-in controls worked, which is the opposite of what the directives exist for.
- **`StepComponent.isAccessible()` now answers for the step it is asked about.** It negated the `disabled` input signal rather than its value, so it returned `false` for every step, enabled or not, contradicting the contract its own documentation states.
- **`variant="secondary"`, `"neutral"`, `"light"` and `"dark"` are resolved by the stylesheet like the other five built-ins.** The component's built-in list had stayed at the five variants that predate 22.2.0, so the four added then took the custom-accent branch and were written as an inline style, which outranks both a consumer rule and the `hub-stepper-theme()` mixin. The rendered colour was already correct; what changes is that overriding the accent now behaves identically for all nine documented variants.

- **The documentation no longer describes an API the library does not have.** The page and both READMEs
  promised per-step `FormGroup` validation, a completed-steps signal, an orientation input and
  `stepperNavTpt` as the consumer entry point — none of which exist — and gave `'Back'` / `'Continue'` /
  `'Submit'` as the defaults of three inputs that default to `null`. What the library does have and nobody
  had written down is now written down: `variant`, `truncateTitles`, the `stepperNav` rail template and its
  context, the `stepper--animated` / `--anim-slide` / `--anim-fade` host classes, `StepperThemeService`,
  `StepperModule.forRoot()` and the namespaced `HUBUI.STEPPER.*` translation keys.
- Outputs are documented as `OutputEmitterRef`, which is what `output()` returns; the tables still called
  them `EventEmitter`.
- The version banner in both READMEs announced 21.2.1 against a manifest publishing 22.8.2.
- The page's "Recent changes" block skipped eight releases between 22.5.1 and 21.2.0, among them the two
  that introduced `variant` and `truncateTitles`.
- The `stepper-modal` example was registered but unreachable: it appeared in no navigation entry, no
  preview map and no feature group.

## [22.8.1] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.8.0] - 2026-08-14

### Changed

- **Default action labels now resolve `HUBUI.STEPPER.*` before the legacy flat keys.** The component provides the namespace through `HUB_TRANSLATION_PREFIX`, so an application dictionary can feed the built-in navigation labels via `provideHubTranslationAdapter()` without reserving generic top-level keys. Existing flat dictionaries keep working — the bare key is still the fallback.

### Added

- README documentation for the application-wide translation adapter (`provideHubTranslationAdapter()` from `ng-hub-ui-utils`).

### Removed

- **Removed the `@angular/animations` peer dependency.** The package is deprecated upstream and the library never used it. Applications that installed it only for `ng-hub-ui-stepper` can drop it.

## [22.7.1] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.7.0] - 2026-07-29

### Added

- **`--hub-stepper-indicator-size`** — the canonical step-indicator diameter, `calc(var(--hub-ref-space-3, 1rem) * 2)` by default. The built-in nav renders text-only pill triggers and draws no indicator; this token is the published metric that custom trigger templates and companion step/lifecycle tracks read, so those UIs stop hard-coding `2rem`/`2.5rem` literals — and, being space-derived, a density re-theme moves the indicator together with the paddings and font sizes that already scale (upstream report).

## [22.6.0] - 2026-07-28

### Added

- **WAI-ARIA tablist semantics on the step rail.** The default nav now implements the APG tabs pattern: the rail list is `role="tablist"` with `aria-orientation` (`horizontal` in the default layout, `vertical` in the sidebar layout) and an accessible name; each step trigger is `role="tab"` with `aria-selected`, `aria-current="step"` on the active step, `aria-disabled` on non-navigable steps, and `aria-controls` pointing at the step content panel, now `role="tabpanel"` with `aria-labelledby` back to its tab through stable per-instance generated ids.
- **Keyboard navigation on the step rail.** Roving tabindex makes the rail a single Tab stop: ArrowRight/ArrowLeft (or ArrowDown/ArrowUp) move focus between enabled step tabs — disabled steps are skipped, wrapping around — Home/End jump to the first/last enabled tab, and Enter/Space activates the focused step under exactly the same permission model as clicking its trigger (`canNavigateTo`: any enabled step is reachable). Moving focus never changes the active step (manual activation).
- New `railLabel` input: accessible name of the step rail tablist. Defaults to `'Steps'`.

### Fixed

- The default rail triggers now declare `type="button"`, so a stepper rendered inside a `<form>` no longer submits it when a step trigger is clicked.

## [22.5.1] - 2026-07-26

### Fixed

- **`StepTriggerDirective` never instantiated.** Its selector used a descendant combinator (`'[hubStepTrigger] [stepTrigger]'`) instead of a comma, so neither attribute alone ever matched. The selector is now `'[hubStepTrigger], [stepTrigger]'` and the directive captures its `TemplateRef` when applied. Note: the stepper does not yet render these trigger templates anywhere — this is groundwork that makes the directive instantiable and queryable; wiring it into the step rail is tracked as follow-up work.

### Changed

- Declared the real `ng-hub-ui-utils` peer range: `>=22.7.0`. The library imports `resolveHubAccent`, introduced in utils 22.7.0; the previous `>=1.2.0` floor allowed installs that compile but fail at runtime.

## [22.5.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-stepper/styles`.** The theme mixin now builds to `dist/stepper/styles/...` (was `dist/stepper/src/lib/styles/...`), so `@use 'ng-hub-ui-stepper/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-stepper>` `variant` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` helper (imported from `ng-hub-ui-utils`): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.4.0] - 2026-07-06

### Removed

- **BREAKING — legacy `ng80-stepper` / `ng80-step` element selectors removed.** The components now match only `hub-stepper` / `hub-ui-stepper` and `hub-step` / `hub-ui-step`, aligning with the rest of the ng-hub-ui ecosystem (the `hub-ui-*` compatibility alias stays). Replace any `<ng80-stepper>` / `<ng80-step>` markup with `<hub-stepper>` / `<hub-step>`. (Major stays at `22` to track the supported Angular major; this breaking removal ships as a minor bump per the ecosystem's Angular-aligned versioning.)

### Fixed

- CSS variable fallbacks realigned to the ds light defaults (`--hub-sys-color-primary`: `#009ef7` → `#0d6efd`); fallbacks only apply when ng-hub-ui-ds is not loaded. The `transparent` fallback of `--hub-sys-surface-page` on the nav background is intentional degradation and stays unchanged.
- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).
- Docs: the README theming example now uses the ds accent (`#0d6efd`) instead of the old-palette blue (`#009ef7`).

## [22.3.0] - 2026-06-30

### Added

- **Opt-in nav title truncation + tooltip.** New `truncateTitles` input on `hub-stepper`: when enabled, each nav step title is clipped to the new `--hub-stepper-nav-title-max-width` CSS variable (default `12rem`) with an ellipsis, and reveals its full text on hover when it overflows. The tooltip is **agnostic** — it defaults to the hub-ui tooltip (via `ng-hub-ui-utils`' `[hubOverflowTooltip]`) but is swappable with `provideHubTooltip(...)`. Off by default, so the standard nav layout is unchanged. Requires `ng-hub-ui-utils >= 22.6.0` and the tooltip styles (`@use 'ng-hub-ui-utils/styles/tooltip';`).

## [22.2.0] - 2026-06-26

### Added

- **Open-set accent variants.** `<hub-stepper variant="…">` now accepts the full open accent set out of the box — `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark` (previously only the first five chromatic ones re-based the accent). Any other variant works at runtime with no recompile: define a single `--hub-sys-color-<name>` (e.g. `:root { --hub-sys-color-brand: #ff6b00; }`) and `<hub-stepper variant="brand">` derives the active-pill / controls treatment from it, via the new open-set `[data-variant]` rule.
- New derived accent roles `--hub-stepper-accent-emphasis`, `--hub-stepper-accent-subtle` and `--hub-stepper-accent-on`, mixed locally from the single `--hub-stepper-accent` slot. The active step pill and the next/submit controls now take their text colour from `--hub-stepper-accent-on` instead of a hardcoded white, so a light custom accent stays legible.
- The `hub-stepper-theme()` mixin now re-derives the accent role family whenever its `$accent` parameter is passed, so a brand accent applied on a custom selector recomputes `-emphasis` / `-subtle` / `-on` (the slot stays the single source of truth — no duplication).

### Changed

- The accent role family is now mixed in the **OKLCH** colour space (`color-mix(in oklch, …)`) for perceptually even tints across every accent.

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Added

- New **`variant` input** on `<hub-stepper>` selecting a **semantic accent**: `<hub-stepper variant="success">` recolours the active step pill and the next / submit controls. The built-in values (`primary` / `success` / `danger` / `warning` / `info`) map to the design-system families via a Sass `@each` loop; **any other string is also accepted** — the accent reads `--hub-sys-color-<variant>`. Defaults to primary (no visual change). New token `--hub-stepper-accent` (the `--hub-stepper-primary-color` and active-pill tokens now follow it).
- New **`hub-stepper-theme()` Sass mixin** (`styles/mixins/stepper-theme`) — theme a stepper in one call: accent, surfaces, nav pills, controls, spacing and the sidebar width. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-stepper-*` overrides. Token-based, no Bootstrap dependency. (Complements the existing `StepperThemeService` for runtime overrides.)
- The `styles/` folder is now shipped inside the package, so the mixin can be consumed directly via `@use 'ng-hub-ui-stepper/styles/mixins/stepper-theme'`.

### Changed

- Replaced the `--hub-stepper-content-padding` and `--hub-stepper-nav-padding` shorthands with the canonical directional `-padding-x` / `-padding-y` tokens. No visual change. **BREAKING**: set the `-x`/`-y` tokens instead of the removed shorthands.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.

## [21.2.1] - 2026-06-13

### Fixed

- `StepperThemeService.setTheme` no longer references the global `document`, which threw `ReferenceError: document is not defined` during server-side rendering. It now injects the `DOCUMENT` token, making runtime theming SSR-safe.

## [21.2.0] - 2026-03-19

### Added

- `StepperAnimationDirection` enum exported from `stepper-options.ts` for typed animation direction values (`Forward`, `Backward`).
- Step indexes are now automatically assigned by `StepperComponent` via a reactive `effect()` — no manual `[index]` binding required.

### Changed

- `StepComponent.index` is now an internal writable signal managed by the parent stepper. Remove all `[index]="N"` bindings from `hub-step` templates.
- `StepComponent.disabled` simplified from a getter/setter with a backing `disabled$` signal to a direct signal input (`input(false)`).
- `StepperComponent.currentIndex` is now a public writable signal (`signal<number>`) — call as `currentIndex()` instead of the previous getter.
- Renamed internal signals: `currentIndex$` → `currentIndex`, `contentAnimating$` → `contentAnimating`, `animationDirection$` → `animationDirection` (removed `$` suffix convention).
- Animation direction internally uses `StepperAnimationDirection` enum values instead of raw string literals.

### Removed

- `StepComponent.disabled$` backing signal removed — use the `disabled` signal input directly.
- `[index]` template binding removed from `StepComponent` — indexes are managed internally by the stepper.

## [21.1.0] - 2026-03-18

### Added

- Integrated **Angular 21** support.
- Implemented **Signals-based** architecture for internal state management.
- Added modern **Input/Output** signal interfaces.
- Added `contentChild` and `contentChildren` for step and directive discovery.

### Changed

- Improved component performance using `ChangeDetectionStrategy.OnPush`.
- Enhanced accessibility with proper ARIA attributes and keyboard support.
- Simplified navigation logic with a more robust step transition system.
- Converted all components and directives to standalone (Angular 20+ default, no `standalone: false`).
- Refactored `StepperModule` to a convenience re-export wrapper with no `declarations`.
- Refactored `NextButtonDirective`, `PreviousButtonDirective`, and `SubmitButtonDirective` to use `computed` signals with `host` bindings, replacing `effect` + `@HostBinding`.

### Fixed

- Fixed issues with step indices and validation during dynamic step additions.
- Fixed `steps` template variable incorrectly invoked as a signal inside `ng-template` context (`steps()` → `steps`).
- Fixed `ExpressionChangedAfterItHasBeenCheckedError` (NG0100) in button directives caused by mutating host bindings inside `effect()`.
- Fixed `tsconfig.lib.json`: added `paths` mapping for `ng-hub-ui-utils` to resolve build compilation error.
