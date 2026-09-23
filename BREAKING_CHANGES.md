# Breaking Changes - ng-hub-ui-stepper

This document tracks all breaking changes in the `ng-hub-ui-stepper` library.

## [22.11.0] - 2026-09-23

### Angular below 17.3.0 is no longer supported

- **Change**: the `@angular/*` peer ranges move from `>=17.2.0` to `>=17.3.0`.

- **Why**: Its published `.d.ts` names `InputSignalWithTransform` or `OutputEmitterRef`, which Angular did not ship until 17.3.

- **Impact — an application below 17.3.0 gets a peer warning where it used to get a build error.**
  Nothing that worked stops working: those versions never compiled against this package. Upgrade
  Angular to 17.3.0 or stay on the previous release.

## [22.10.0] - 2026-09-08

### Announced: the unprefixed `stepper` CSS block is removed in 23.0.0

- **Change**: the component wore the bare class `stepper` on its host, and named every part under
  it — `stepper__nav`, `stepper__content`, `stepper__button`, the `stepper--layout-*` and
  `stepper--rtl` modifiers, the `stepper--animated` / `stepper--anim-slide` / `stepper--anim-fade`
  opt-ins, and three global `@keyframes` called `stepper-fade-in`, `stepper-slide-in-forward` and
  `stepper-slide-in-backward`. From this release the block is `hub-stepper`, which is what every
  other library of the family uses (`hub-calendar`, `hub-table`, `hub-panels__panel-header`).
  **Nothing is removed here for the classes**: both spellings are written to the DOM, both are
  matched by the stylesheet, and `hasAnimationClass()` reads either. Their removal lands in 23.0.0,
  the next version that tracks a new Angular major. The three `@keyframes` are the exception — they
  are renamed here and now, with no alias, because they were never a documented surface: nothing in
  the README, the API tables or `FUNCTIONALITIES.md` has ever named them, and reaching one meant
  guessing an internal identifier out of the compiled stylesheet.

    One thing the compatibility window does not cover: the opt-in and the flavour must share a
    prefix. `class="stepper--animated hub-stepper--anim-fade"` on the same host matches neither rule.
    Migrate the three together.

- **Why**: `stepper` is a word in the application's namespace, not the library's. A host
  application with a `.stepper` rule of its own — and it is a common enough word that themes ship
  one — restyled the component from the outside, with nothing in either codebase saying why. The
  `@keyframes` are worse than the classes: emulated encapsulation does not scope keyframe names at
  all, so `stepper-fade-in` was a global identifier this package planted in every application that
  installed it. It is the same complaint that took the bare `[tooltip]` selector out of
  `ng-hub-ui-utils` in its 22.14.0.

- **What happens if you do nothing**: nothing, until 23.0.0 — unless you wrote
  `animation-name: stepper-fade-in` (or `stepper-slide-in-forward` / `stepper-slide-in-backward`)
  by hand, which stops resolving in this release. From 23.0.0 a stylesheet that targets `.stepper`,
  `::ng-deep .stepper__nav`, `button.stepper__button` or any of the modifiers stops matching too —
  and a stylesheet that stops matching fails silently, which is the reason this entry exists.
  `class="stepper--animated"` on the host likewise stops enabling the transition.

- **Migration**: prefix. Every name gains `hub-` and nothing else changes.

    ```html
    <!-- Before -->
    <hub-stepper class="stepper--animated stepper--anim-fade">…</hub-stepper>

    <!-- After -->
    <hub-stepper class="hub-stepper--animated hub-stepper--anim-fade">…</hub-stepper>
    ```

    ```scss
    // Before
    .stepper { … }
    ::ng-deep .stepper__nav-trigger { … }
    button.stepper__button--next { … }

    // After
    .hub-stepper { … }
    ::ng-deep .hub-stepper__nav-trigger { … }
    button.hub-stepper__button--next { … }
    ```

    The step's own `step__content` becomes `hub-step__content` under the same terms.

### The projected-control queries no longer look inside the steps

- **Change**: `previousButton`, `nextButton` and `submitButton` are content queries for the three
  control directives, and they ran with Angular's default `descendants: true`. Content projection
  with a `select` only ever matches a **direct** child of the host, so a `button nextButton` nested
  deeper — inside a `hub-step`, inside a form — could never reach the controls row. The query found
  it regardless, the component concluded a custom control had been supplied, and rendered none: the
  stepper lost its own button to a button it could not display. The three queries are now shallow.

- **Impact**: a stepper with a control directive buried inside a step now renders its built-in
  control again, where before it rendered nothing. The buried button keeps working as a next /
  previous / submit control, because the directive is still applied to it — so a wizard that looked
  broken now shows two ways forward instead of none.

- **What happens if you do nothing**: the missing button comes back. If you want only the buried
  one, move it out to be a direct child of `<hub-stepper>`, which is the only place the controls row
  can render it anyway.

## [22.8.2] - 2026-09-06

### Announced: `StepperModule` and `StepperModule.forRoot()` are removed in 23.0.0

- **Change**: both are now marked `@deprecated`. Nothing is removed here and nothing changes at runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { StepperModule }`, `imports: [StepperModule]` and `StepperModule.forRoot({ … })` stop compiling. `forRoot()` costs more than the rest: it is the only thing that provides `HubTranslationService`, which the stepper's `translate` pipe injects and which is not `providedIn: 'root'`. An application that drops it without putting something in its place fails at runtime with `NullInjectorError: No provider for HubTranslationService`.
- **Migration**: import the seven standalone building blocks directly, and swap `forRoot()` for `provideHubStepper()`, added in **22.9.0**. It registers the same dictionaries and the same service without a module — `forRoot()` delegates to it — so the swap changes nothing at runtime.

> **Updated in 22.9.0.** The note first published with 22.8.2 had no provider function to point at, because there was none: the ten dictionaries were internal and died with the module, so it sent the reader off to name the three controls by hand or write their own dictionary. `provideHubStepper()` and the exported `STEPPER_DICTIONARIES` close that hole; the paths below are kept because they remain useful, not because they are the migration.

**The building blocks:**

```ts
// Before
@NgModule({ imports: [StepperModule] })
export class AppModule {}

// After
@Component({
	imports: [
		StepperComponent,
		StepComponent,
		StepTriggerDirective,
		StepperNavDirective,
		PreviousButtonDirective,
		NextButtonDirective,
		SubmitButtonDirective
	]
})
export class CheckoutComponent {}
```

**The labels.** `forRoot()` bundles dictionaries for `en`, `es`, `ca`, `eu`, `gl`, `ast`, `an`, `de`, `zh` and `ar`. Since 22.9.0 they no longer go with the module:

```ts
// Before
@NgModule({ imports: [StepperModule.forRoot({ language: 'es', fallbackLanguage: 'en' })] })
export class AppModule {}

// After
import { provideHubStepper } from 'ng-hub-ui-stepper';

bootstrapApplication(AppComponent, {
	providers: [provideHubStepper({ language: 'es', fallbackLanguage: 'en' })]
});
```

`provideHubStepper()` writes `HUB_TRANSLATION_CONFIG`, which is one application-wide token. An application that already calls `provideHubTranslation()` at the root should merge the stepper languages into that call rather than register both — `STEPPER_DICTIONARIES` is exported for exactly that — or scope `provideHubStepper()` to the route that owns the wizard:

```ts
import { STEPPER_DICTIONARIES } from 'ng-hub-ui-stepper';
import { provideHubTranslation } from 'ng-hub-ui-utils';

provideHubTranslation({
	language: 'es',
	fallbackLanguage: 'en',
	dictionaries: {
		es: { ...STEPPER_DICTIONARIES['es'], ...myOwnSpanishStrings },
		en: { ...STEPPER_DICTIONARIES['en'], ...myOwnEnglishStrings }
	}
});
```

The three built-in controls are the only strings the library renders on its own, so two shorter paths remain open when the ten languages are not what you want.

Pass them straight to the component:

```html
<hub-stepper backLabel="Atrás" continueLabel="Continuar" submitLabel="Enviar">
	<hub-step title="Datos">…</hub-step>
</hub-stepper>
```

Or register your own dictionary, which also provides the `HubTranslationService` the pipe needs:

```ts
import { provideHubTranslation } from 'ng-hub-ui-utils';

bootstrapApplication(AppComponent, {
	providers: [
		provideHubTranslation({
			language: 'es',
			fallbackLanguage: 'en',
			dictionaries: {
				es: { HUBUI: { STEPPER: { BACK: 'atrás', CONTINUE: 'continuar', SUBMIT: 'enviar' } } },
				en: { HUBUI: { STEPPER: { BACK: 'back', CONTINUE: 'continue', SUBMIT: 'submit' } } }
			}
		})
	]
});
```

An application already bridging its own translation source with `provideHubTranslationAdapter()` needs nothing further: that provider supplies `HubTranslationService` too.

## [22.5.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-stepper/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/stepper/styles/...` instead of `dist/stepper/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-stepper/styles' as *;`

## [22.4.0] - 2026-07-06

### Legacy `ng80-stepper` / `ng80-step` element selectors removed

- **Change**: the components match only `hub-stepper` / `hub-ui-stepper` and `hub-step` / `hub-ui-step`. The `ng80-*` selectors, kept from before the rename to the `hub-` prefix, are gone.
- **Impact**: `<ng80-stepper>` and `<ng80-step>` markup no longer instantiates anything. Angular treats an unmatched element as an unknown one, so the wizard silently disappears from the page instead of failing loudly.
- **Migration**: rename the elements.

**Before:**

```html
<ng80-stepper>
	<ng80-step title="Account">…</ng80-step>
</ng80-stepper>
```

**After:**

```html
<hub-stepper>
	<hub-step title="Account">…</hub-step>
</hub-stepper>
```

> The major stays at `22` because it tracks the supported Angular major, not the shape of the API. That is why a removal like this one ships as a minor and is announced here.

## Version 22.1.0

### Removed shorthand padding tokens

The shorthand CSS custom properties `--hub-stepper-nav-padding` and `--hub-stepper-content-padding` have been **removed** in favour of the canonical directional `-padding-x` / `-padding-y` pairs. This produces no visual change, but any custom CSS that set the shorthands must be migrated.

**Before:**

```css
hub-stepper {
	--hub-stepper-nav-padding: 1rem;
	--hub-stepper-content-padding: 1.5rem;
}
```

**After (use the directional pairs):**

```css
hub-stepper {
	--hub-stepper-nav-padding-x: 1rem;
	--hub-stepper-nav-padding-y: 1rem;
	--hub-stepper-content-padding-x: 1.5rem;
	--hub-stepper-content-padding-y: 1.5rem;
}
```

| Removed                         | Replace with                                                          |
| ------------------------------- | --------------------------------------------------------------------- |
| `--hub-stepper-nav-padding`     | `--hub-stepper-nav-padding-x` + `--hub-stepper-nav-padding-y`         |
| `--hub-stepper-content-padding` | `--hub-stepper-content-padding-x` + `--hub-stepper-content-padding-y` |

## Version 21.2.0

### Removed `[index]` input from `StepComponent`

**Before:**

```html
<hub-step [index]="0" title="Step 1">...</hub-step> <hub-step [index]="1" title="Step 2">...</hub-step>
```

**After (remove `[index]` entirely):**

```html
<hub-step title="Step 1">...</hub-step> <hub-step title="Step 2">...</hub-step>
```

Indexes are now automatically assigned by the parent `StepperComponent`.

### `StepComponent.disabled$` backing signal removed

**Before:** `step.disabled$()` (writable signal)
**After:** `step.disabled()` (read-only signal input)

### `StepperComponent` signal renames

| Before                                     | After                             |
| ------------------------------------------ | --------------------------------- |
| `stepper.currentIndex` (getter → `number`) | `stepper.currentIndex()` (signal) |
| `stepper.currentIndex$()`                  | `stepper.currentIndex()`          |
| `stepper.contentAnimating$()`              | `stepper.contentAnimating()`      |
| `stepper.animationDirection$()`            | `stepper.animationDirection()`    |

## Version 21.x.x

### Major Version Jump (1.x -> 21.x)

- **Reason**: Alignment with the global repository versioning and Angular 21 major release.
- **Migration**: Update your project to Angular 21 to use this version.

### API Changes

- Internal state management has been migrated to **Signals**. While most public APIs remain compatible, custom extensions relying on internal observables might need updates.
- Improved typing for `StepperOptions`.

### Minimum Requirements

- **Angular**: >= 21.0.0
- **Node.js**: >= 18.0.0 (Recommended for Angular 21)
