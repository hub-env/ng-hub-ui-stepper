import { computed, Directive, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

/**
 * Connects a projected button to the stepper completion action.
 * It disables the host button when the current step is disabled.
 */
@Directive({
	selector: 'button[submitButton]',
	standalone: true,
	host: {
		class: 'hub-stepper__button hub-stepper__button--submit stepper__button stepper__button--submit',
		'[disabled]': 'disabled()',
		'(click)': 'stepper.complete()'
	}
})
export class SubmitButtonDirective {
	readonly stepper = inject(StepperComponent);

	/**
	 * Reflects whether completion is currently allowed: the last step has to be enabled and in
	 * order, which is what the built-in Submit button asks too. A stepper with no steps at all
	 * leaves the control enabled, as it always has.
	 */
	readonly disabled = computed(() => {
		const step = this.stepper.steps()?.[this.stepper.currentIndex()];
		return step ? step.disabled() || !step.inOrder() : false;
	});
}
