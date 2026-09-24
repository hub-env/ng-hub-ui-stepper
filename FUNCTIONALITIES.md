# Functionalities of Stepper Library

This table details the functionalities of the `ng-hub-ui-stepper` library and indicates which ones are covered by interactive examples.

The public surface is two components, `hub-stepper` and `hub-step`, five directives, a runtime theming service, the `provideHubStepper()` provider function with the `STEPPER_DICTIONARIES` record it registers, the deprecated `StepperModule` convenience wrapper and the `StepperOptions` / `StepperConfig` / `StepperLayout` / `StepperAnimationDirection` / `StepperNavVariant` / `StepperStepChange` / `StepperStepChangeGuard` types.

## Component (`hub-stepper`)

| Category          | Functionality                                                                                                    | Example Covered |
| :---------------- | :--------------------------------------------------------------------------------------------------------------- | :-------------: |
| **Layout**        | Vertical layout (`options.layout`, the default)                                                                  |       ✅        |
|                   | Sidebar layout                                                                                                   |       ✅        |
|                   | Right-to-left rendering (`options.rtl`)                                                                          |       ✅        |
| **Navigation**    | Click a rail step to activate it                                                                                 |       ✅        |
|                   | Built-in Back / Continue / Submit controls                                                                       |       ✅        |
|                   | Any enabled step reachable; `disabled` steps closed off                                                          |       ✅        |
|                   | Programmatic `goTo(index)` through a template reference                                                          |       ✅        |
|                   | `goToPrevious()` / `goToNext()` called directly                                                                  |       ❌        |
|                   | `canNavigateTo(index)` permission check called directly                                                          |       ❌        |
|                   | `currentIndex` / `steps` / `currentStep` read from a template reference                                          |       ❌        |
|                   | Inline track rail (`nav="track"`), beside the `pills` default                                                    |       ✅        |
|                   | Forward jump gated on the steps in between (`isReachable(index)`)                                                |       ✅        |
|                   | `isInOrder(index)` and `isReachable(index)` read from a template reference                                       |       ✅        |
|                   | `beforeStepChange` gate — sync, promise, or promise rejection cancels the move                                   |       ✅        |
| **Labels**        | `backLabel` / `continueLabel` / `submitLabel` per-instance overrides                                             |       ✅        |
|                   | Fallback to the translated `BACK` / `CONTINUE` / `SUBMIT` labels                                                 |       ✅        |
|                   | `inOrderLabel` override for the track status text                                                                |       ❌        |
| **Rail titles**   | `title` shown on the trigger, `Step N` when omitted                                                              |       ✅        |
|                   | Opt-in truncation (`truncateTitles`)                                                                             |       ✅        |
|                   | Overflowing truncated title revealed as a tooltip                                                                |       ✅        |
|                   | Truncation width (`--hub-stepper-nav-title-max-width`)                                                           |       ❌        |
| **Transitions**   | Opt-in via the `hub-stepper--animated` host class                                                                |       ✅        |
|                   | Slide flavour (`hub-stepper--anim-slide`, also the default)                                                      |       ✅        |
|                   | Fade flavour (`hub-stepper--anim-fade`)                                                                          |       ✅        |
|                   | The unprefixed `stepper--animated` / `stepper--anim-slide` / `stepper--anim-fade`, deprecated, removed in 23.0.0 |       ❌        |
|                   | Duration (`--hub-stepper-animation-duration`)                                                                    |       ✅        |
| **Outputs**       | `completed`                                                                                                      |       ✅        |
|                   | `nextStep` (new index)                                                                                           |       ✅        |
|                   | `previousStep` (new index)                                                                                       |       ✅        |
| **Accessibility** | Rail as `role="tablist"` with `aria-orientation`                                                                 |       ✅        |
|                   | Triggers as `role="tab"` with `aria-selected` / `aria-current="step"`                                            |       ✅        |
|                   | `aria-disabled` on non-navigable steps                                                                           |       ✅        |
|                   | Step content as `role="tabpanel"` wired by generated ids                                                         |       ✅        |
|                   | Accessible name of the rail (`railLabel`)                                                                        |       ❌        |
|                   | Roving tabindex — the rail is a single Tab stop                                                                  |       ✅        |
|                   | Arrow keys move focus, skipping disabled steps and wrapping                                                      |       ✅        |
|                   | `Home` / `End` jump to the first / last enabled step                                                             |       ✅        |
|                   | `Enter` / `Space` activate the focused step                                                                      |       ✅        |
|                   | Triggers declare `type="button"`, so a surrounding form is not submitted                                         |       ✅        |

> The stepper still never inspects a form. What changed in **22.12.0** is that it will now listen: `[valid]` is where the consuming component states its verdict, and the library turns that into `inOrder` and `isReachable`. `canNavigateTo()` is unchanged and answers on `disabled` alone.

## Component (`hub-step`)

| Category     | Functionality                                                          | Example Covered |
| :----------- | :--------------------------------------------------------------------- | :-------------: |
| **Metadata** | `title`                                                                |       ✅        |
|              | `disabled`                                                             |       ✅        |
|              | `index` assigned automatically by the parent stepper                   |       ✅        |
| **Validity** | `valid` — the consumer verdict on this step: `true`, `false` or `null` |       ✅        |
|              | `visited`, written by the stepper when the step is reached             |       ✅        |
|              | `inOrder` — the stated validity, or `visited` when nothing is stated   |       ✅        |
| **Content**  | Projected step body rendered in the active panel                       |       ✅        |
| **API**      | `isAccessible()`                                                       |       ❌        |

## Directives

| Category      | Functionality                                                                                             | Example Covered |
| :------------ | :-------------------------------------------------------------------------------------------------------- | :-------------: |
| **Controls**  | `nextButton` / `continueButton`                                                                           |       ✅        |
|               | `previousButton` / `backButton`                                                                           |       ✅        |
|               | `submitButton`                                                                                            |       ✅        |
|               | Projected controls disable themselves when the move is unavailable                                        |       ✅        |
|               | Projected controls relocated by a host (a modal footer) keep working                                      |       ✅        |
| **Templates** | `hubStepperNav` / `stepperNav` replaces the whole rail                                                    |       ✅        |
|               | Rail template context (`steps`, `currentIndex`)                                                           |       ✅        |
|               | `hubStepTrigger` / `stepTrigger` replaces the trigger of every rail item                                  |       ❌        |
|               | Trigger template context (`$implicit` / `step`, `title`, `index`, `isCurrent`, `isCompleted`, `disabled`) |       ❌        |
|               | Trigger context additions: `visited`, `valid`, `inOrder`, `reachable`                                     |       ❌        |
|               | Ignored by `nav="track"`, which draws its own marker                                                      |       ✅        |

> `hubStepTrigger` renders from **22.10.0** on; before that the directive was exported and captured its
> `TemplateRef`, and the stepper never queried it. No interactive example uses it yet — both READMEs
> carry a worked snippet — so the coverage column says so.

## Internationalization

| Category                   | Functionality                                                                             | Example Covered |
| :------------------------- | :---------------------------------------------------------------------------------------- | :-------------: |
| **Bundled dictionaries**   | `en`, `es`, `ca`, `eu`, `gl`, `ast`, `an`, `de`, `zh`, `ar`                               |       ✅        |
|                            | Registered through `provideHubStepper(StepperConfig)`                                     |       ❌        |
|                            | `STEPPER_DICTIONARIES` exported, to register some or merge them into your own             |       ✅        |
|                            | `IN_ORDER`, the status of a ticked track marker                                           |       ✅        |
|                            | Registered through `StepperModule.forRoot(StepperConfig)` — deprecated, removed in 23.0.0 |       ❌        |
|                            | `language` / `fallbackLanguage` config                                                    |       ❌        |
| **Application dictionary** | Namespaced `HUBUI.STEPPER.*` keys resolved first                                          |       ✅        |
|                            | Flat `BACK` / `CONTINUE` / `SUBMIT` keys as the fallback                                  |       ❌        |
|                            | Runtime language switching (`HubTranslationService`)                                      |       ✅        |
|                            | `provideHubTranslationAdapter()` from `ng-hub-ui-utils`                                   |       ❌        |

## Styling

| Category      | Functionality                                                                  | Example Covered |
| :------------ | :----------------------------------------------------------------------------- | :-------------: |
| **Accent**    | `variant` input (the built-in nine, a registered accent or a literal colour)   |       ❌        |
|               | `--hub-stepper-accent` single recolour hook                                    |       ✅        |
|               | Derived roles `--hub-stepper-accent-emphasis` / `-subtle` / `-on`              |       ❌        |
| **Tokens**    | Surfaces (`--hub-stepper-surface-color`, `-background-color`, `-border-color`) |       ✅        |
|               | Rail (`--hub-stepper-nav-*`)                                                   |       ✅        |
|               | Step pills (`--hub-stepper-nav-link-*`, `--hub-stepper-nav-trigger-*`)         |       ✅        |
|               | Track rail (`--hub-stepper-track-*`)                                           |       ✅        |
|               | Controls (`--hub-stepper-control-*`, `--hub-stepper-controls-*`)               |       ✅        |
|               | Spacing (`--hub-stepper-gap`, `--hub-stepper-*-padding-*`)                     |       ✅        |
|               | Sidebar width (`--hub-stepper-sidebar-width` and its clamp bounds)             |       ✅        |
|               | Disabled opacity (`--hub-stepper-disabled-opacity`)                            |       ✅        |
|               | Step-indicator diameter (`--hub-stepper-indicator-size`)                       |       ❌        |
| **Sass**      | `hub-stepper-theme()` mixin, from `ng-hub-ui-stepper/styles`                   |       ✅        |
| **Runtime**   | `StepperThemeService.setTheme()`                                               |       ✅        |
| **Structure** | BEM classes (`hub-stepper__nav`, `__nav-trigger`, `__content`, `__controls`)   |       ❌        |
|               | The unprefixed `stepper__*` names beside them, deprecated, removed in 23.0.0   |       ❌        |

> `provideHubStepper()` returns `EnvironmentProviders`, which only a bootstrap or a route can
> declare — a component cannot. The i18n example therefore names it in its code tab and switches
> languages through a component-scoped `HubTranslationService` instead, which is also what keeps the
> demo from rewriting the dictionary of the whole documentation page.

## Legend

- ✅ Covered by an interactive example or a playground control on the documentation site.
- ❌ Supported by the library but not yet demonstrated by an example.
