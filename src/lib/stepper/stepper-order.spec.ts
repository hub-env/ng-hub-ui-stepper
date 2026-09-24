import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHubTranslation } from 'ng-hub-ui-utils';
import { NextButtonDirective } from '../next-button.directive';
import { StepComponent } from '../step/step.component';
import { SubmitButtonDirective } from '../submit-button.directive';
import { StepperStepChange, StepperStepChangeGuard } from './stepper-options';
import { StepperComponent } from './stepper.component';

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper #stepper nav="track" [beforeStepChange]="guard()">
			<hub-step title="Account" [valid]="accountValid()">Account</hub-step>
			<hub-step title="Address" [valid]="addressValid()" [disabled]="addressDisabled()">Address</hub-step>
			<hub-step title="Payment" [valid]="paymentValid()">Payment</hub-step>
			<hub-step title="Review">Review</hub-step>
		</hub-stepper>
	`
})
class TrackHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly accountValid = signal<boolean | null>(null);
	readonly addressValid = signal<boolean | null>(null);
	readonly paymentValid = signal<boolean | null>(null);
	readonly addressDisabled = signal(false);

	/** Replaced per test; `null` leaves the stepper ungated. */
	readonly guard = signal<StepperStepChangeGuard | null>(null);
}

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One">One</hub-step>
			<hub-step title="Two">Two</hub-step>
			<hub-step title="Three">Three</hub-step>
		</hub-stepper>
	`
})
class PillsHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
}

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent, NextButtonDirective, SubmitButtonDirective],
	template: `
		<hub-stepper #stepper>
			<hub-step title="One" [valid]="firstValid()">One</hub-step>
			<hub-step title="Two" [valid]="lastValid()">Two</hub-step>
			<button nextButton>Next</button>
			<button submitButton>Submit</button>
		</hub-stepper>
	`
})
class ProjectedHostComponent {
	readonly stepper = viewChild.required<StepperComponent>('stepper');
	readonly firstValid = signal<boolean | null>(null);
	readonly lastValid = signal<boolean | null>(null);
}

describe('StepperComponent — step order, the track rail and the change gate', () => {
	let fixture: ComponentFixture<TrackHostComponent>;
	let host: TrackHostComponent;
	let stepper: StepperComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(TrackHostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
		stepper = host.stepper();
	});

	describe('visited, valid and in order are three different things', () => {
		it('marks only the steps the user has actually stood on as visited', () => {
			expect(stepper.steps()[0].visited()).toBe(true);
			expect(stepper.steps()[1].visited()).toBe(false);

			stepper.goToNext();
			fixture.detectChanges();

			expect(stepper.steps()[1].visited()).toBe(true);
		});

		it('keeps a step visited after the user walks back past it', () => {
			stepper.goTo(1);
			stepper.goTo(2);
			stepper.goTo(0);
			fixture.detectChanges();

			expect(stepper.steps()[1].visited()).toBe(true);
			expect(stepper.currentIndex()).toBe(0);
		});

		it('does not call a step visited just because the user jumped over it', () => {
			stepper.goTo(2);
			fixture.detectChanges();

			expect(stepper.steps()[1].visited()).toBe(false);
		});

		it('lets a stated validity override position: an unvisited step declared valid is in order', () => {
			host.paymentValid.set(true);
			fixture.detectChanges();

			expect(stepper.steps()[2].visited()).toBe(false);
			expect(stepper.isInOrder(2)).toBe(true);
		});

		it('holds a visited step out of order while its stated validity is false', () => {
			host.accountValid.set(false);
			fixture.detectChanges();

			expect(stepper.steps()[0].visited()).toBe(true);
			expect(stepper.isInOrder(0)).toBe(false);
		});

		it('falls back to visited when no validity is stated, so a wizard that says nothing behaves as before', () => {
			expect(stepper.isInOrder(0)).toBe(true);
			expect(stepper.isInOrder(1)).toBe(false);
		});
	});

	describe('reachability', () => {
		it('always allows a jump back to an earlier step', () => {
			stepper.goTo(1);
			fixture.detectChanges();

			expect(stepper.isReachable(0)).toBe(true);
		});

		it('refuses a forward jump while a step in between is not in order', () => {
			host.accountValid.set(true);
			host.addressValid.set(false);
			fixture.detectChanges();

			expect(stepper.isReachable(1)).toBe(true);
			expect(stepper.isReachable(2)).toBe(false);
			expect(stepper.isReachable(3)).toBe(false);
		});

		it('allows the forward jump once every step in between is in order', () => {
			host.accountValid.set(true);
			host.addressValid.set(true);
			host.paymentValid.set(true);
			fixture.detectChanges();

			expect(stepper.isReachable(3)).toBe(true);
		});

		it('never reaches a disabled step, however in order its neighbours are', () => {
			host.accountValid.set(true);
			host.addressValid.set(true);
			host.addressDisabled.set(true);
			fixture.detectChanges();

			expect(stepper.isReachable(1)).toBe(false);
		});
	});

	describe('goTo() honours the same rules as the rail', () => {
		it('refuses a programmatic jump to a disabled step', () => {
			host.addressDisabled.set(true);
			fixture.detectChanges();

			stepper.goTo(1);
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(0);
		});

		it('still refuses it when the disabled step is reached through goToNext()', () => {
			host.addressDisabled.set(true);
			fixture.detectChanges();

			stepper.goToNext();
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(0);
		});
	});

	describe('the change gate runs before the step changes', () => {
		it('sees the stepper still on the step it is leaving', () => {
			let seen: { from: number; to: number; at: number } | null = null;
			host.guard.set((change: StepperStepChange) => {
				seen = { from: change.from, to: change.to, at: stepper.currentIndex() };
				return true;
			});
			fixture.detectChanges();

			stepper.goTo(2);
			fixture.detectChanges();

			expect(seen).toEqual({ from: 0, to: 2, at: 0 });
			expect(stepper.currentIndex()).toBe(2);
		});

		it('cancels the move when the gate returns false', () => {
			host.guard.set(() => false);
			fixture.detectChanges();

			stepper.goTo(2);
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(0);
		});

		it('defers the move until an asynchronous gate resolves, so the consumer can save first', async () => {
			let resolveGate: (allow: boolean) => void = () => {};
			host.guard.set(() => new Promise<boolean>((resolve) => (resolveGate = resolve)));
			fixture.detectChanges();

			stepper.goTo(1);
			fixture.detectChanges();
			expect(stepper.currentIndex()).toBe(0);

			resolveGate(true);
			await Promise.resolve();
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(1);
		});

		it('leaves the stepper where it was when the asynchronous gate rejects', async () => {
			host.guard.set(() => Promise.reject(new Error('save failed')));
			fixture.detectChanges();

			stepper.goTo(1);
			await Promise.resolve();
			await Promise.resolve();
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(0);
		});

		it('does not consult the gate for a move the rules already refuse', () => {
			let calls = 0;
			host.guard.set(() => {
				calls += 1;
				return true;
			});
			host.addressDisabled.set(true);
			fixture.detectChanges();

			stepper.goTo(1);
			fixture.detectChanges();

			expect(calls).toBe(0);
		});
	});

	describe('the inline track rail', () => {
		it('paints the number of every step', () => {
			const numbers = fixture.debugElement
				.queryAll(By.css('.hub-stepper__track-number'))
				.map((el) => (el.nativeElement as HTMLElement).textContent?.trim());

			expect(numbers).toEqual(['1', '2', '3', '4']);
		});

		it('ticks a step that is in order and no other', () => {
			host.accountValid.set(true);
			host.addressValid.set(false);
			fixture.detectChanges();

			const ticked = fixture.debugElement
				.queryAll(By.css('.hub-stepper__track-step'))
				.map((el) => (el.nativeElement as HTMLElement).classList.contains('hub-stepper__track-step--in-order'));

			expect(ticked).toEqual([true, false, false, false]);
			expect(fixture.debugElement.queryAll(By.css('.hub-stepper__track-tick')).length).toBe(1);
		});

		it('disables the trigger of a step it will not let the user jump to', () => {
			host.accountValid.set(true);
			host.addressValid.set(false);
			fixture.detectChanges();

			const triggers = fixture.debugElement
				.queryAll(By.css('.hub-stepper__track-step'))
				.map((el) => (el.nativeElement as HTMLButtonElement).disabled);

			expect(triggers).toEqual([false, false, true, true]);
		});

		it('moves the stepper when a reachable trigger is clicked', () => {
			host.accountValid.set(true);
			fixture.detectChanges();

			const triggers = fixture.debugElement.queryAll(By.css('.hub-stepper__track-step'));
			(triggers[1].nativeElement as HTMLButtonElement).click();
			fixture.detectChanges();

			expect(stepper.currentIndex()).toBe(1);
		});
	});

	describe('the built-in controls follow the stated validity', () => {
		it('disables Continue while the current step is out of order', () => {
			host.accountValid.set(false);
			fixture.detectChanges();

			const next = fixture.debugElement.query(By.css('.hub-stepper__button--next'));
			expect((next.nativeElement as HTMLButtonElement).disabled).toBe(true);
		});

		it('leaves Continue enabled when nothing has been stated', () => {
			const next = fixture.debugElement.query(By.css('.hub-stepper__button--next'));
			expect((next.nativeElement as HTMLButtonElement).disabled).toBe(false);
		});
	});
});

describe('StepperComponent — the default pills rail is untouched', () => {
	let fixture: ComponentFixture<PillsHostComponent>;
	let stepper: StepperComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PillsHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(PillsHostComponent);
		fixture.detectChanges();
		stepper = fixture.componentInstance.stepper();
	});

	it('still renders the pill triggers and no track', () => {
		expect(fixture.debugElement.queryAll(By.css('.hub-stepper__nav-trigger')).length).toBe(3);
		expect(fixture.debugElement.queryAll(By.css('.hub-stepper__track')).length).toBe(0);
	});

	it('still marks a pill completed on position alone, so an existing trigger template reads the same', () => {
		stepper.goTo(2);
		fixture.detectChanges();

		const completed = fixture.debugElement
			.queryAll(By.css('.hub-stepper__nav-trigger'))
			.map((el) => (el.nativeElement as HTMLElement).classList.contains('hub-stepper__nav-trigger--completed'));

		expect(completed).toEqual([true, true, false]);
	});

	it('still lets the user jump anywhere enabled, in order or not', () => {
		expect(stepper.canNavigateTo(2)).toBe(true);

		stepper.goTo(2);
		fixture.detectChanges();

		expect(stepper.currentIndex()).toBe(2);
	});
});

describe('StepperComponent — projected controls answer the same question as the built-in ones', () => {
	let fixture: ComponentFixture<ProjectedHostComponent>;
	let host: ProjectedHostComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ProjectedHostComponent],
			providers: [provideHubTranslation()]
		}).compileComponents();

		fixture = TestBed.createComponent(ProjectedHostComponent);
		host = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('leaves a projected Next enabled while nothing has been stated', () => {
		const next = fixture.debugElement.query(By.css('button[nextButton]'));
		expect((next.nativeElement as HTMLButtonElement).disabled).toBe(false);
	});

	it('disables a projected Next once the current step is stated invalid', () => {
		host.firstValid.set(false);
		fixture.detectChanges();

		const next = fixture.debugElement.query(By.css('button[nextButton]'));
		expect((next.nativeElement as HTMLButtonElement).disabled).toBe(true);
	});

	it('disables a projected Submit once the last step is stated invalid', () => {
		host.stepper().goToNext();
		fixture.detectChanges();

		const submit = fixture.debugElement.query(By.css('button[submitButton]'));
		expect((submit.nativeElement as HTMLButtonElement).disabled).toBe(false);

		host.lastValid.set(false);
		fixture.detectChanges();

		expect((submit.nativeElement as HTMLButtonElement).disabled).toBe(true);
	});
});
