# ng-hub-ui-stepper - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-stepper`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Base System Fallbacks](#base-system-fallbacks)
- [Stepper Variables](#stepper-variables)
    - [Core](#core)
    - [Navigation](#navigation)
    - [Inline track rail](#inline-track-rail)
        - [Controls & Buttons](#controls--buttons)
        - [Layout & Spacing](#layout--spacing)
        - [Animations](#animations)
- [Customization Examples](#customization-examples)

---

## How it Works

The stepper styles are encapsulated within the component using canonical tokens (`--hub-stepper-*`).

This allows:

- Easy customization via CSS variables on the component's host or parent.
- Runtime theming via CSS custom properties.
- Support for complex layouts like `sidebar` and `rtl` using the same variable set.

---

## Base System Fallbacks

`ng-hub-ui-stepper` consumes these base tokens from the global system:

| Variable                             | Default   |
| ------------------------------------ | --------- |
| `--hub-sys-color-primary`            | `#009ef7` |
| `--hub-sys-surface-elevated`         | `#f3f6f9` |
| `--hub-sys-surface-page`             | `#ffffff` |
| `--hub-sys-text-primary`             | `#181c32` |
| `--hub-sys-border-color-default`     | `#d8dde6` |
| `--hub-ref-space-3`                  | `1rem`    |
| `--hub-sys-transition-duration-base` | `260ms`   |

---

## Stepper Variables

### Core

| Variable                         | Default                                        | Description                                                                                                                                                                       |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--hub-stepper-accent`           | `var(--hub-sys-color-primary, #0d6efd)`        | Semantic accent driving the active step pill and the next / submit controls. Re-based by the `variant` input; `--hub-stepper-primary-color` and the active-pill tokens follow it. |
| `--hub-stepper-primary-color`    | `var(--hub-stepper-accent)`                    | Main theme color used for active steps and primary buttons.                                                                                                                       |
| `--hub-stepper-background-color` | `var(--hub-sys-surface-elevated, #f8f9fa)`     | Secondary background color for "back" buttons.                                                                                                                                    |
| `--hub-stepper-text-color`       | `var(--hub-sys-text-primary, #212529)`         | Base text color for labels and content.                                                                                                                                           |
| `--hub-stepper-border-color`     | `var(--hub-sys-border-color-default, #dee2e6)` | Border color for containers and controls.                                                                                                                                         |
| `--hub-stepper-surface-color`    | `var(--hub-sys-surface-page, #ffffff)`         | Main background color for the content area.                                                                                                                                       |
| `--hub-stepper-disabled-opacity` | `var(--hub-sys-opacity-50, 0.5)`               | Opacity for disabled controls.                                                                                                                                                    |

### Navigation

| Variable                              | Default                                    | Description                                      |
| ------------------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `--hub-stepper-nav-bg`                | `var(--hub-sys-surface-page, transparent)` | Background for the navigation container.         |
| `--hub-stepper-nav-padding-x`         | `0`                                        | Horizontal padding for the navigation container. |
| `--hub-stepper-nav-padding-y`         | `0`                                        | Vertical padding for the navigation container.   |
| `--hub-stepper-nav-border-width`      | `0`                                        | Border width for the navigation container.       |
| `--hub-stepper-nav-link-color`        | `var(--hub-sys-text-primary, #212529)`     | Text color for pending navigation links.         |
| `--hub-stepper-nav-link-active-bg`    | `var(--hub-stepper-accent)`                | Background for the currently active nav step.    |
| `--hub-stepper-nav-link-active-color` | `var(--hub-stepper-accent-on, #ffffff)`    | Text color for the currently active nav step.    |
| `--hub-stepper-nav-trigger-padding-y` | `var(--hub-ref-space-2, 0.5rem)`           | Vertical padding for nav triggers.               |
| `--hub-stepper-nav-trigger-padding-x` | `var(--hub-ref-space-3, 1rem)`             | Horizontal padding for nav triggers.             |

### Inline track rail

Only in play when the stepper is asked for the track, with `nav="track"`. The pills rail reads none
of these.

| Variable                                        | Default                                    | Description                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `--hub-stepper-track-marker-size`               | `var(--hub-stepper-indicator-size)`        | Diameter of the numbered marker. Follows the published indicator metric by default, so a density re-theme moves both together. |
| `--hub-stepper-track-gap`                       | `var(--hub-ref-space-2, 0.5rem)`           | Space between a marker and its title, and around the connector.                                                                |
| `--hub-stepper-track-marker-bg`                 | `var(--hub-sys-surface-page, #ffffff)`     | Marker background for a step that is neither current nor in order.                                                             |
| `--hub-stepper-track-marker-color`              | `var(--hub-sys-text-muted, #6c757d)`       | Number colour in that same resting state.                                                                                      |
| `--hub-stepper-track-marker-border-color`       | `var(--hub-stepper-border-color)`          | Marker ring in the resting state.                                                                                              |
| `--hub-stepper-track-marker-in-order-bg`        | `var(--hub-stepper-accent-subtle)`         | Marker fill once the step is in order.                                                                                         |
| `--hub-stepper-track-marker-in-order-color`     | `var(--hub-stepper-accent-emphasis)`       | Number and ring colour once the step is in order.                                                                              |
| `--hub-stepper-track-marker-current-bg`         | `var(--hub-stepper-accent)`                | Marker fill of the step the user is on. Wins over the in-order fill.                                                           |
| `--hub-stepper-track-marker-current-color`      | `var(--hub-stepper-accent-on, #ffffff)`    | Number colour of the current marker.                                                                                           |
| `--hub-stepper-track-marker-out-of-order-color` | `var(--hub-sys-color-danger, #dc3545)`     | Number and ring colour of a step stated `[valid]="false"`.                                                                     |
| `--hub-stepper-track-tick-size`                 | `0.875rem`                                 | Diameter of the tick badge in the corner of an in-order marker.                                                                |
| `--hub-stepper-track-tick-bg`                   | `var(--hub-stepper-accent)`                | Tick badge background.                                                                                                         |
| `--hub-stepper-track-tick-color`                | `var(--hub-stepper-accent-on, #ffffff)`    | Tick glyph colour.                                                                                                             |
| `--hub-stepper-track-title-color`               | `var(--hub-stepper-nav-link-color)`        | Step title beside the marker.                                                                                                  |
| `--hub-stepper-track-title-font-size`           | `var(--hub-stepper-nav-trigger-font-size)` | Step title size.                                                                                                               |
| `--hub-stepper-track-connector-thickness`       | `2px`                                      | Thickness of the line joining two markers.                                                                                     |
| `--hub-stepper-track-connector-color`           | `var(--hub-stepper-border-color)`          | Connector colour by default.                                                                                                   |
| `--hub-stepper-track-connector-in-order-color`  | `var(--hub-stepper-accent)`                | Connector colour leaving a step that is in order.                                                                              |

### Controls & Buttons

| Variable                          | Default                                 | Description                             |
| --------------------------------- | --------------------------------------- | --------------------------------------- |
| `--hub-stepper-controls-justify`  | `flex-end`                              | Horizontal alignment of action buttons. |
| `--hub-stepper-controls-gap`      | `var(--hub-ref-space-2, 0.5rem)`        | Spacing between controls.               |
| `--hub-stepper-control-padding-y` | `0.375rem`                              | Vertical padding for action buttons.    |
| `--hub-stepper-control-padding-x` | `var(--hub-ref-space-3, 1rem)`          | Horizontal padding for action buttons.  |
| `--hub-stepper-control-font-size` | `var(--hub-ref-font-size-sm, 0.875rem)` | Font size for buttons.                  |

### Layout & Spacing

| Variable                          | Default                                                                                                                     | Description                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `--hub-stepper-gap`               | `var(--hub-ref-space-3, 1rem)`                                                                                              | Gap between nav, content, and controls.                 |
| `--hub-stepper-nav-gap`           | `var(--hub-ref-space-1, 0.25rem)`                                                                                           | Gap between individual nav items.                       |
| `--hub-stepper-sidebar-width`     | `clamp(var(--hub-stepper-sidebar-min-width), var(--hub-stepper-sidebar-ideal-width), var(--hub-stepper-sidebar-max-width))` | Width of the navigation sidebar in `sidebar` layout.    |
| `--hub-stepper-content-padding-x` | `0`                                                                                                                         | Horizontal internal padding for the step content panel. |
| `--hub-stepper-content-padding-y` | `0`                                                                                                                         | Vertical internal padding for the step content panel.   |

### Animations

| Variable                           | Default                                                | Description                                |
| ---------------------------------- | ------------------------------------------------------ | ------------------------------------------ |
| `--hub-stepper-animation-duration` | `var(--hub-sys-transition-duration-base, 260ms)`       | Duration of content transition animations. |
| `--hub-stepper-animation-easing`   | `var(--hub-sys-transition-timing-function-base, ease)` | Timing function for transitions.           |
| `--hub-stepper-animation-distance` | `var(--hub-ref-space-4, 1.5rem)`                       | Offset distance for sliding animations.    |

---

## Customization Examples

### Clean Horizontal Stepper

```css
hub-stepper {
	--hub-stepper-gap: 2rem;
	--hub-stepper-nav-padding-x: 1rem;
	--hub-stepper-nav-padding-y: 1rem;
	--hub-stepper-nav-bg: #f8f9fa;
	--hub-stepper-nav-border-width: 1px;
	--hub-stepper-content-padding-x: 1.5rem;
	--hub-stepper-content-padding-y: 1.5rem;
}
```

### Modern Dark Vibe

```css
hub-stepper {
	--hub-stepper-primary-color: #7239ea;
	--hub-stepper-surface-color: #1e1e2d;
	--hub-stepper-text-color: #ffffff;
	--hub-stepper-border-color: #323248;
	--hub-stepper-nav-link-color: #a2a5b9;
}
```

### Compact Sidebar

```css
hub-stepper {
	--hub-stepper-sidebar-width: 180px;
	--hub-stepper-nav-trigger-padding-y: 0.25rem;
	--hub-stepper-nav-gap: 0;
}
```
