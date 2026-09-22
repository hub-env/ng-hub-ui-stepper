# ng-hub-ui-stepper

[Español](./README.es.md) | **English**

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-stepper.svg)](https://www.npmjs.com/package/ng-hub-ui-stepper)
[![license](https://img.shields.io/npm/l/ng-hub-ui-stepper.svg)](https://github.com/hub-env/ng-hub-ui-stepper/blob/main/LICENSE)

A flexible, customizable, and accessible stepper component for Angular 21+. Perfect for multi-step forms, wizards, and guided user experiences with a focus on developer experience and modern standards.

> [!IMPORTANT]
> Version `22.10.3` targets **Angular 22** and uses the **Signals** architecture shared across `ng-hub-ui`.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/stepper/overview/
- Live examples: https://hubui.dev/en/stepper/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI on GitHub (issues, roadmap and contributing): https://github.com/hub-env/hub-ui

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper) ← You are here
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage (Quick Start)](#usage-quick-start)
- [Examples](#examples)
	- [Linear Stepper](#linear-stepper)
	- [Custom Navigation](#custom-navigation)
	- [Custom Buttons](#custom-buttons)
	- [Step transitions](#step-transitions)
- [API Reference](#api-reference)
	- [StepperComponent](#steppercomponent-hub-stepper)
	- [StepComponent](#stepcomponent-hub-step)
	- [Directives](#directives)
	- [Host classes](#host-classes)
	- [Services](#services)
	- [Providers](#providers)
	- [Interfaces](#interfaces)
- [Internationalization](#internationalization)
- [Styling](#styling)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🚀 **Angular 21+ Built-in**: Uses Signals and new control flow syntax.
- 🎨 **Highly Customizable**: Easy to theme via CSS variables, the `hub-stepper-theme()` Sass mixin and custom templates.
- ♿ **Accessible**: WAI-ARIA tablist rail with full keyboard navigation.
- 🔢 **Multi-layout**: Supports Vertical, Sidebar, and RTL modes.
- 🔄 **Smooth Transitions**: Opt-in CSS animations, enabled with the `stepper--animated` host class (see [Step transitions](#step-transitions)). No `@angular/animations` dependency.
- 🧩 **Flexible Controls**: Use default buttons or project your own.
- ✂️ **Opt-in title truncation + tooltip**: set `truncateTitles` to clip long nav titles (bounded by `--hub-stepper-nav-title-max-width`) and reveal the full text on hover — hub-ui tooltip by default, swappable with `provideHubTooltip`. Requires `ng-hub-ui-utils >= 22.6.0` + `@use 'ng-hub-ui-utils/styles/tooltip';`.

> ℹ️ **What the stepper does not do**: it never inspects your forms. `canNavigateTo()` answers on the
> step's `disabled` input and nothing else, so an "advance only when this step is valid" rule lives in
> your component — bind `[disabled]` on the following step to whatever your form says (see
> [Linear Stepper](#linear-stepper)).

> ♿ **Accessibility model**: the step rail is a WAI-ARIA `tablist` (each trigger a `tab`, each step content a `tabpanel`) with a roving tabindex, so it is a single Tab stop. Arrow keys move focus between enabled steps (skipping disabled ones, wrapping), `Home`/`End` jump to the first/last enabled step, and `Enter`/`Space` activates the focused step under the same rules as clicking it. The rail's accessible name comes from the `railLabel` input (default `'Steps'`).

## Installation

```bash
npm install ng-hub-ui-stepper
```

## Usage (Quick Start)

Import the standalone building blocks your template uses:

```typescript
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  standalone: true,
  imports: [StepperComponent, StepComponent],
  // ...
})
export class YourComponent { }
```

The rest of the surface — `StepTriggerDirective`, `StepperNavDirective`, `PreviousButtonDirective`,
`NextButtonDirective` and `SubmitButtonDirective` — is imported the same way, one by one, as each
template needs it.

Then register the library once, so the built-in Back / Continue / Submit controls have text:

```typescript
import { provideHubStepper } from 'ng-hub-ui-stepper';

bootstrapApplication(AppComponent, {
  providers: [provideHubStepper({ language: 'en' })]
});
```

> **`StepperModule` is deprecated and will be removed in 23.0.0.** It only re-exports the seven
> building blocks above, so importing them directly is the whole migration, and
> `StepperModule.forRoot()` becomes `provideHubStepper()` — same providers, no module. See
> [Providers](#providers) and [Internationalization](#internationalization).

In your template:

```html
<hub-stepper>
  <hub-step title="Account Setup">
    <h3>Welcome!</h3>
    <p>Setup your account details here.</p>
  </hub-step>

  <hub-step title="Personal Info">
    <h3>Profile Data</h3>
    <p>Tell us more about yourself.</p>
  </hub-step>

  <hub-step title="Review">
    <h3>Save & Finalize</h3>
    <p>Ready to go?</p>
  </hub-step>
</hub-stepper>
```

## Examples

### Linear Stepper

Control navigation by enabling/disabling steps programmatically.

```html
<hub-stepper (completed)="onFinish()">
  <hub-step title="Step 1">
    <!-- Step 1 Content -->
  </hub-step>

  <hub-step title="Step 2" [disabled]="!isStep1Valid()">
    <!-- Step 2 Content -->
  </hub-step>
</hub-stepper>
```

### Custom Navigation

Mark an `ng-template` with the `hubStepperNav` (or `stepperNav`) directive and it replaces the whole
built-in rail. The context gives you `steps` — the projected `StepComponent` instances, so `title` and
`disabled` are signals — and `currentIndex`. A template reference on the stepper gets you `goTo()`.

```html
<hub-stepper #stepper>
  <ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
    <ol class="my-custom-nav">
      @for (step of steps; track step; let i = $index) {
        <li>
          <button
            type="button"
            [class.active]="i === currentIndex"
            [disabled]="!stepper.canNavigateTo(i)"
            (click)="stepper.goTo(i)">
            {{ step.title() || 'Step ' + (i + 1) }}
          </button>
        </li>
      }
    </ol>
  </ng-template>

  <hub-step title="A">...</hub-step>
  <hub-step title="B">...</hub-step>
</hub-stepper>
```

> Replacing the rail also replaces its accessibility: the WAI-ARIA tablist, the roving tabindex and the
> arrow-key handling described above belong to the built-in rail. A custom template owns its own semantics.

### Custom Buttons

Project your own buttons to override the default footer. Each directive wires the click and keeps the
button disabled while the move is unavailable.

```html
<hub-stepper>
  <hub-step>...</hub-step>

  <button previousButton class="btn-back">Go back</button>
  <button nextButton class="btn-next">Next step</button>
  <button submitButton class="btn-done">Complete</button>
</hub-stepper>
```

### Step transitions

Transitions are plain CSS and opt-in: add `hub-stepper--animated` to the host, then pick the flavour
with `hub-stepper--anim-slide` (the default when neither is set) or `hub-stepper--anim-fade`. Duration
comes from `--hub-stepper-animation-duration`. The unprefixed `stepper--animated`,
`stepper--anim-slide` and `stepper--anim-fade` are still read, and go in 23.0.0.

```html
<hub-stepper
  class="hub-stepper--animated hub-stepper--anim-fade"
  [style.--hub-stepper-animation-duration.ms]="240"
>
  <hub-step title="Profile">...</hub-step>
  <hub-step title="Summary">...</hub-step>
</hub-stepper>
```

### Custom rail triggers

`hubStepperNav` replaces the whole rail. When all you want is a different control inside each rail
item — a numbered circle, an icon, a check on the steps already done — `hubStepTrigger` is one level
down: the rail keeps its list, its `role="tablist"`, its orientation and its label, and only the
button inside each item is yours.

```html
<hub-stepper #wizard>
  <ng-template hubStepTrigger let-title="title" let-index="index" let-isCurrent="isCurrent" let-disabled="disabled">
    <button
      type="button"
      role="tab"
      [attr.aria-selected]="isCurrent"
      [disabled]="disabled"
      (click)="wizard.goTo(index)"
    >
      <span class="badge">{{ index + 1 }}</span> {{ title }}
    </button>
  </ng-template>

  <hub-step title="Account">...</hub-step>
  <hub-step title="Payment">...</hub-step>
</hub-stepper>
```

The context carries the step as `$implicit` and as `step`, plus `title`, `index`, `isCurrent`,
`isCompleted` and `disabled`. Activating a step stays with you, through a template reference on the
host — which is why the example names the stepper `#wizard`. Give the trigger `role="tab"` if you
want the rail's arrow-key navigation to keep finding it.

A stepper that declares both templates uses `hubStepperNav` and ignores this one.

## API Reference

### StepperComponent (`hub-stepper`)

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `string` | `undefined` (renders as primary) | Semantic accent for the active step pill and the next / submit controls. Built-in values: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark`. Any other string is also accepted and resolves through `--hub-sys-color-<variant>`. |
| `backLabel` | `string \| null` | `null` | Overrides the back button label. While `null`, the translated `BACK` label is used. |
| `continueLabel` | `string \| null` | `null` | Overrides the continue button label. While `null`, the translated `CONTINUE` label is used. |
| `submitLabel` | `string \| null` | `null` | Overrides the submit button label. While `null`, the translated `SUBMIT` label is used. |
| `truncateTitles` | `boolean` | `false` | Clips each rail title to `--hub-stepper-nav-title-max-width` (default `12rem`) and reveals the full text as a tooltip when it overflows. |
| `railLabel` | `string` | `'Steps'` | Accessible name of the step rail tablist. |
| `options` | `StepperOptions` | `{}` | Visual and layout configuration. |

| Output | Type | Description |
|---|---|---|
| `completed` | `OutputEmitterRef<void>` | Emitted when the last step is completed. |
| `previousStep` | `OutputEmitterRef<number>` | Emitted when moving back. Passes the new index. |
| `nextStep` | `OutputEmitterRef<number>` | Emitted when moving forward. Passes the new index. |

Public members you can reach through a template reference (`<hub-stepper #stepper>`):

| Member | Signature | Description |
|---|---|---|
| `currentIndex` | `WritableSignal<number>` | Index of the active step. |
| `steps` | `Signal<readonly StepComponent[]>` | The projected steps, in order. |
| `currentStep` | `StepComponent \| null` | The active step instance. |
| `goTo` | `(index: number) => void` | Activates a step. Only bounds are checked — it does not consult `canNavigateTo`, so a programmatic jump can land on a `disabled` step. |
| `goToPrevious` / `goToNext` | `() => void` | Moves one step back / forward. |
| `canNavigateTo` | `(index: number) => boolean` | `true` when the index exists and its step is not `disabled`. |
| `complete` | `() => void` | Emits `completed`. |

### StepComponent (`hub-step`)

| Input | Type | Default | Description |
|---|---|---|---|
| `title` | `string \| undefined` | `undefined` | Text displayed in the rail. Falls back to `Step N` when omitted. |
| `disabled` | `boolean` | `false` | Prevents navigation to this step through the rail and the built-in controls. |

`index` is **not** an input: the parent stepper assigns it. Reading it (`step.index()`) is fine; binding it is not.

### Directives

| Directive | Selectors | Applies to | Purpose |
|---|---|---|---|
| `NextButtonDirective` | `button[nextButton]`, `button[continueButton]` | `<button>` | Calls `goToNext()` and disables the button when there is no enabled next step. |
| `PreviousButtonDirective` | `button[previousButton]`, `button[backButton]` | `<button>` | Calls `goToPrevious()` and disables the button when there is no enabled previous step. |
| `SubmitButtonDirective` | `button[submitButton]` | `<button>` | Calls `complete()` and disables the button while the current step is `disabled`. |
| `StepperNavDirective` | `[hubStepperNav]`, `[stepperNav]` | `<ng-template>` | Replaces the built-in rail. Context: `steps`, `currentIndex`. |
| `StepTriggerDirective` | `[hubStepTrigger]`, `[stepTrigger]` | `<ng-template>` | Replaces the rail trigger the default rail draws, once per step. Context: `$implicit` / `step`, `title`, `index`, `isCurrent`, `isCompleted`, `disabled`. Ignored when a `hubStepperNav` template is present, since a custom rail draws its own triggers. |

### Host classes

Set these on `<hub-stepper>` itself; they are read by the stylesheet, not by inputs.

| Class | Effect |
|---|---|
| `hub-stepper--animated` | Enables the CSS transition between step panels. Without it, panels swap instantly. |
| `hub-stepper--anim-slide` | Slide transition (also the default when only `hub-stepper--animated` is set). |
| `hub-stepper--anim-fade` | Fade transition instead of the slide. |

> **Renamed in 22.10.0.** These were `stepper--animated`, `stepper--anim-slide` and
> `stepper--anim-fade`, and the component itself wore a bare `stepper` class. `stepper` is a word in
> the application's namespace, not the library's, so a host application with a `.stepper` rule of its
> own restyled the component from the outside. The whole block is now `hub-stepper`, in line with
> every other library of the family. **The old spellings still work and are still written to the
> DOM**; both go in **23.0.0**. See [`BREAKING_CHANGES.md`](./BREAKING_CHANGES.md).

### Services

#### `StepperThemeService`

Provided in root. Writes `--hub-stepper-*` custom properties on `documentElement`, for themes decided at
runtime (a tenant colour arriving from an API, say). Keys are passed **without** the `--hub-stepper-`
prefix, which the service adds:

```typescript
inject(StepperThemeService).setTheme({
  accent: '#7c3aed',
  'nav-link-active-color': '#ffffff',
  gap: '1.5rem'
});
```

For a theme known at build time, prefer the [`hub-stepper-theme()` mixin](#sass-mixin): it scopes to a
selector instead of the document root.

### Providers

#### `provideHubStepper(config?: StepperConfig)`

The standalone entry point. Registers the ten bundled dictionaries and the `HubTranslationService`
that `TranslatePipe` injects to resolve the built-in control labels — the service is not
`providedIn: 'root'`, so without this (or another provider of it) the first render throws
`NullInjectorError`.

```typescript
bootstrapApplication(AppComponent, {
  providers: [provideHubStepper({ language: 'en', fallbackLanguage: 'en' })]
});
```

It can also be scoped to the route that owns the wizard, which is what an application already
configuring `provideHubTranslation()` at the root should do — see
[Internationalization](#internationalization) for why.

#### `STEPPER_DICTIONARIES`

The bundled dictionaries as a plain record, keyed by language code, so you can register only the
languages you ship or merge the labels into a dictionary of your own:

```typescript
import { STEPPER_DICTIONARIES } from 'ng-hub-ui-stepper';

provideHubTranslation({
  language: 'ca',
  fallbackLanguage: 'en',
  dictionaries: {
    ca: { ...STEPPER_DICTIONARIES['ca'], ...myCatalanStrings },
    en: { ...STEPPER_DICTIONARIES['en'], ...myEnglishStrings }
  }
});
```

The keys are flat — `BACK`, `CONTINUE`, `SUBMIT` — which is what the component resolves once its
`HUBUI.STEPPER` namespace misses.

### Interfaces

#### `StepperOptions`
```typescript
interface StepperOptions {
  layout?: 'vertical' | 'sidebar';
  rtl?: boolean;
}
```

#### `StepperConfig`

Accepted by `provideHubStepper()` and by the deprecated `StepperModule.forRoot()`:

```typescript
interface StepperConfig {
  language?: string;        // default 'es'
  fallbackLanguage?: string; // default 'en'
}
```

## Internationalization

The built-in back, continue and submit labels go through `TranslatePipe` from `ng-hub-ui-utils`. There are
two ways to feed them, and they can be combined.

**The bundled dictionaries.** `provideHubStepper()` registers translations for `en`, `es`, `ca`, `eu`,
`gl`, `ast`, `an`, `de`, `zh` and `ar`, and the `HubTranslationService` that `TranslatePipe` injects:

```typescript
providers: [provideHubStepper({ language: 'en', fallbackLanguage: 'en' })];
```

`StepperModule.forRoot({ language: 'en', fallbackLanguage: 'en' })` does the same and is **removed in
23.0.0** along with the module; it now delegates to `provideHubStepper()`, so the swap changes nothing
at runtime.

One caveat: `provideHubStepper()` writes `HUB_TRANSLATION_CONFIG`, and that is a single
application-wide token. If your application already calls `provideHubTranslation()` at the root, do
not register both — whichever comes last wins and the other loses its dictionaries. Merge the stepper
labels into your own call with [`STEPPER_DICTIONARIES`](#stepper_dictionaries), or scope
`provideHubStepper()` to the route that owns the wizard.

**Your application dictionary.** Configure `provideHubTranslationAdapter()` once in `app.config.ts`; its
reactive dictionary updates the rendered navigation automatically. The component provides
`HUB_TRANSLATION_PREFIX` as `HUBUI.STEPPER`, so the namespaced keys are looked up first and the bare keys
remain as the fallback:

```typescript
// Preferred — namespaced, so the stepper reserves no generic top-level keys:
//   HUBUI.STEPPER.BACK, HUBUI.STEPPER.CONTINUE, HUBUI.STEPPER.SUBMIT
// Still honoured for existing flat dictionaries:
//   BACK, CONTINUE, SUBMIT
```

Per instance, `backLabel` / `continueLabel` / `submitLabel` win over both.

## Styling

Customize the component using CSS variables. For a complete list of available tokens, see the [CSS Variables Reference](docs/css-variables-reference.md).

```css
.my-stepper {
  --hub-stepper-primary-color: #0d6efd;
  --hub-stepper-surface-color: #ffffff;
  --hub-stepper-gap: 1.5rem;
}
```

### Semantic accent

The `--hub-stepper-accent` token drives the active step pill and the next / submit controls. It defaults to `var(--hub-sys-color-primary)`. The easiest way to set it is the `variant` input (see [API Reference](#steppercomponent-hub-stepper)), but you can also override the token directly:

```css
.my-stepper {
  --hub-stepper-accent: var(--hub-sys-color-success);
}
```

### Sass mixin

For full theming in a single call, the package ships a `hub-stepper-theme()` Sass mixin. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-stepper-*` overrides:

```scss
@use 'ng-hub-ui-stepper/styles' as *;

.checkout-stepper {
  @include hub-stepper-theme(
    $accent: var(--hub-sys-color-success),
    $gap: 1.5rem,
    $nav-link-active-color: #fff,
    $sidebar-width: 220px
  );
}
```

## Contributing

We welcome contributions! Please follow our [Commit Guidelines](https://github.com/hub-env/hub-ui/blob/main/CONTRIBUTING.md).

1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## Support

If you find this project helpful, consider supporting its development:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

## Commercial support

These libraries are maintained by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), a freelance frontend architect working with teams that build and maintain Angular applications.

If your team depends on Hub-UI and needs more than an issue thread can solve, that is my day job: architecture audits, design systems, Angular migrations and team mentoring. For projects that also need design and a full team, I run them through [Frog Hub](https://froghub.es), my development studio.

Have a look at [the services](https://www.carlosmorcillo.com/en/services/) or [tell me about your project](https://www.carlosmorcillo.com/en/contact/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
