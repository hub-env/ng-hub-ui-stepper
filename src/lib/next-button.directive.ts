import { computed, Directive, inject } from '@angular/core';
import { StepperComponent } from './stepper/stepper.component';

/**
 * Connects a projected button to the stepper "next" action.
 * It also keeps the button disabled state synchronized with the next step availability.
 */
@Directive({
	selector: 'button[nextButton], button[continueButton]',
	standalone: true,
	host: {
		class: 'hub-stepper__button hub-stepper__button--next stepper__button stepper__button--next',
		'[disabled]': 'disabled()',
		'(click)': 'stepper.goToNext()'
	}
})
export class NextButtonDirective {
	readonly stepper = inject(StepperComponent);

	/**
	 * Reflects whether the control can trigger forward navigation — the same question the
	 * built-in Continue button asks, so a projected control and the one it replaces never
	 * disagree about the same wizard. `isReachable` covers the bounds, the `disabled` input and,
	 * for a wizard that states one, the current step's validity.
	 */
	readonly disabled = computed(() => !this.stepper.isReachable(this.stepper.currentIndex() + 1));
}
