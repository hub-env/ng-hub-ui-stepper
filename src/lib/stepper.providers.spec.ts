import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepComponent } from './step/step.component';
import { StepperComponent } from './stepper/stepper.component';
import { StepperModule } from './stepper.module';
import { STEPPER_DICTIONARIES, provideHubStepper } from './stepper.providers';

@Component({
	standalone: true,
	imports: [StepperComponent, StepComponent],
	template: `
		<hub-stepper>
			<hub-step title="Step 1">Content 1</hub-step>
			<hub-step title="Step 2">Content 2</hub-step>
		</hub-stepper>
	`
})
class StandaloneHostComponent {}

/**
 * Text of the built-in Continue control, which resolves through the `translate` pipe.
 * Only the button's own text nodes count — the arrow beside it lives in a decorative span.
 */
function continueLabel(fixture: ComponentFixture<StandaloneHostComponent>): string {
	fixture.detectChanges();
	const button: HTMLElement = fixture.nativeElement.querySelector('.stepper__button--next');
	return [...button.childNodes]
		.filter((node) => node.nodeType === Node.TEXT_NODE)
		.map((node) => node.textContent ?? '')
		.join('')
		.trim();
}

/**
 * `StepperModule.forRoot()` used to be the only thing that registered the ten bundled
 * dictionaries and the `HubTranslationService` the `translate` pipe injects. The module is
 * removed in 23.0.0, so a standalone application needs an equivalent that does not go through
 * one — otherwise dropping the module costs it the ten languages, or a `NullInjectorError`.
 */
describe('provideHubStepper', () => {
	it('serves a standalone consumer without importing the module', () => {
		TestBed.configureTestingModule({
			imports: [StandaloneHostComponent],
			providers: [provideHubStepper()]
		});

		expect(continueLabel(TestBed.createComponent(StandaloneHostComponent))).toBe('Continuar');
	});

	it('honours the language and reaches every bundled dictionary', () => {
		const spoken: Record<string, string> = {
			en: 'Continue',
			es: 'Continuar',
			ca: 'Continua',
			eu: 'Jarraitu',
			gl: 'Continuar',
			ast: 'Siguir',
			an: 'Continar',
			de: 'Weiter',
			zh: '继续',
			ar: 'متابعة'
		};

		for (const [language, label] of Object.entries(spoken)) {
			TestBed.resetTestingModule();
			TestBed.configureTestingModule({
				imports: [StandaloneHostComponent],
				providers: [provideHubStepper({ language })]
			});

			expect(continueLabel(TestBed.createComponent(StandaloneHostComponent)), `${language} label`).toBe(label);
		}
	});

	it('falls back to the configured fallback language for an unknown one', () => {
		TestBed.configureTestingModule({
			imports: [StandaloneHostComponent],
			providers: [provideHubStepper({ language: 'sv', fallbackLanguage: 'de' })]
		});

		expect(continueLabel(TestBed.createComponent(StandaloneHostComponent))).toBe('Weiter');
	});

	it('leaves the deprecated forRoot() answering exactly the same', () => {
		TestBed.configureTestingModule({
			imports: [StandaloneHostComponent, StepperModule.forRoot({ language: 'de' })]
		});
		const throughModule = continueLabel(TestBed.createComponent(StandaloneHostComponent));

		TestBed.resetTestingModule();
		TestBed.configureTestingModule({
			imports: [StandaloneHostComponent],
			providers: [provideHubStepper({ language: 'de' })]
		});

		expect(continueLabel(TestBed.createComponent(StandaloneHostComponent))).toBe(throughModule);
	});
});

describe('STEPPER_DICTIONARIES', () => {
	it('exports the ten bundled languages, so they survive the module', () => {
		expect(Object.keys(STEPPER_DICTIONARIES).sort()).toEqual(
			['an', 'ar', 'ast', 'ca', 'de', 'en', 'es', 'eu', 'gl', 'zh'].sort()
		);
	});

	it('keeps the flat keys the component resolves after its namespace misses', () => {
		for (const [language, dictionary] of Object.entries(STEPPER_DICTIONARIES)) {
			expect(Object.keys(dictionary).sort(), `keys of ${language}`).toEqual(['BACK', 'CONTINUE', 'IN_ORDER', 'SUBMIT']);
		}
	});
});
