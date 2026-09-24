/**
 * Direction of the step transition animation.
 */
export enum StepperAnimationDirection {
	Forward = 'forward',
	Backward = 'backward'
}

/**
 * Available layout modes for the stepper container.
 */
export enum StepperLayout {
	Vertical = 'vertical',
	Sidebar = 'sidebar'
}

/**
 * Optional configuration object for the stepper component.
 */
export interface StepperOptions {
	/**
	 * Controls how nav, content and footer are arranged inside the stepper grid.
	 */
	layout?: StepperLayout;

	/**
	 * Enables right-to-left rendering for nav, content and controls.
	 */
	rtl?: boolean;
}

/**
 * Presentation of the built-in step rail.
 *
 * `'pills'` is the rail the component has always drawn: one text button per step. `'track'` is
 * the inline variant — a numbered marker per step, joined by a connector, with a tick on every
 * step that is in order.
 *
 * A union of string literals rather than an enum so `nav="track"` can be written as a plain
 * attribute: a string enum member is not assignable from its own literal under strict templates,
 * and `StepperLayout` gets away with being an enum only because it is set from TypeScript,
 * inside `StepperOptions`.
 */
export type StepperNavVariant = 'pills' | 'track';

/**
 * The move `beforeStepChange` is asked about. It is handed over *before* anything moves, so
 * `from` is still the active step while the guard runs.
 */
export interface StepperStepChange {
	/** Index the stepper is leaving. */
	from: number;

	/** Index the stepper would land on. */
	to: number;
}

/**
 * Gate consulted before the active step changes, so a consumer can save the step it is leaving
 * and refuse the move if that fails.
 *
 * Returning `false`, or a promise that resolves to `false` or rejects, cancels the move; anything
 * else lets it through. Same contract as `beforeDismiss` in `ng-hub-ui-portal`, which is where
 * this family already settled the question of how a transition is cancelled.
 */
export type StepperStepChangeGuard = (change: StepperStepChange) => boolean | Promise<boolean>;
