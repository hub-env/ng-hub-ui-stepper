import { ChangeDetectionStrategy, Component, computed, inject, input, signal, TemplateRef, viewChild } from '@angular/core';
import { StepperComponent } from '../stepper/stepper.component';

/** Default animation duration (ms) used by optional step transitions. */
const ANIMATION_DURATION = 256;

/**
 * Defines a single step inside `hub-stepper`.
 * The component exposes metadata (title, disabled state, index) and a projected template as step content.
 */
@Component({
	selector: 'hub-step, hub-ui-step',
	templateUrl: './step.component.html',
	styleUrls: ['./step.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepComponent {
	/** Parent stepper instance injected from the host context. */
	stepper = inject(StepperComponent);

	/**
	 * Zero-based position of this step within the parent stepper.
	 * Assigned automatically by `StepperComponent` — do not set this manually.
	 */
	readonly index = signal<number>(0);

	/** Optional display title rendered in the step navigation. */
	readonly title = input<string>();

	/** Whether the step is disabled and cannot be navigated to. */
	readonly disabled = input(false);

	/**
	 * The consuming wizard's verdict on this step's own data: `true` when it passes, `false` when
	 * it does not, `null` when nothing has been said.
	 *
	 * Tri-state on purpose. The library has no business inspecting a form, so it cannot tell
	 * "this step is fine" from "nobody has looked yet" — and collapsing the two would make every
	 * stepper that never mentions validity start behaving like one whose steps all fail.
	 */
	readonly valid = input<boolean | null>(null);

	/**
	 * Whether the step has been the active one at least once.
	 * Written by `StepperComponent` when the step is reached — do not set this manually.
	 */
	readonly visited = signal(false);

	/**
	 * Whether the step counts as done and sound: the stated validity when there is one, otherwise
	 * whether the user has been through it.
	 *
	 * Deliberately not a function of position. Walking back does not un-finish the steps ahead,
	 * and a wizard resuming a saved draft can hand over later steps already stated valid, which
	 * `index < currentIndex` would call unfinished.
	 */
	readonly inOrder = computed(() => this.valid() ?? this.visited());

	/** Template reference used by the parent stepper to render step content. */
	readonly innerTemplate = viewChild.required<TemplateRef<any>>('innerTemplate');

	/** Returns the animation state key consumed by content transitions. */
	get animationState() {
		return '*';
	}

	/**
	 * Returns whether the step can be navigated to.
	 *
	 * @returns `true` when the step is enabled.
	 */
	isAccessible(): boolean {
		return !this.disabled();
	}
}
