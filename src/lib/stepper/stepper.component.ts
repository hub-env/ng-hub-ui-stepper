import {
	AfterContentInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	ElementRef,
	OnDestroy,
	effect,
	inject,
	signal,
	TemplateRef,
	input,
	output,
	contentChild,
	contentChildren
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
	HUB_TRANSLATION_PREFIX,
	HubOverflowTooltipDirective,
	resolveHubAccent,
	TranslatePipe,
	UcfirstPipe
} from 'ng-hub-ui-utils';
import { NextButtonDirective } from '../next-button.directive';
import { PreviousButtonDirective } from '../previous-button.directive';
import { StepComponent } from '../step/step.component';
import { StepTriggerDirective } from '../step-trigger.directive';
import { StepperNavDirective } from '../stepper-nav.directive';
import { SubmitButtonDirective } from '../submit-button.directive';
import {
	StepperAnimationDirection,
	StepperLayout,
	StepperNavVariant,
	StepperOptions,
	StepperStepChangeGuard
} from './stepper-options';

/**
 * Renders and controls a multi-step workflow.
 * It coordinates navigation, state transitions and projected templates for steps and controls.
 */
/** Variants with exact design-system token coverage via the SCSS `@each` loop. */
const STEPPER_BUILT_IN_VARIANTS = new Set<string>([
	'primary',
	'secondary',
	'success',
	'danger',
	'warning',
	'info',
	'neutral',
	'light',
	'dark'
]);

/** Monotonic counter used to build unique, stable per-instance ARIA ids. */
let nextStepperInstanceId = 0;

@Component({
	selector: 'hub-stepper, hub-ui-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgTemplateOutlet, TranslatePipe, UcfirstPipe, HubOverflowTooltipDirective],
	providers: [{ provide: HUB_TRANSLATION_PREFIX, useValue: 'HUBUI.STEPPER' }],
	host: {
		// `hub-stepper` is the block from 22.10.0 on. The bare `stepper` beside it is the name it
		// replaces — a word in the application's namespace, not the library's — kept working until
		// it is removed in 23.0.0. Same story for every modifier below.
		class: 'hub-stepper stepper',
		'[class.hub-stepper--layout-vertical]': 'layout() === StepperLayout.Vertical',
		'[class.stepper--layout-vertical]': 'layout() === StepperLayout.Vertical',
		'[class.hub-stepper--layout-sidebar]': 'layout() === StepperLayout.Sidebar',
		'[class.stepper--layout-sidebar]': 'layout() === StepperLayout.Sidebar',
		'[class.hub-stepper--rtl]': 'isRtl()',
		'[class.stepper--rtl]': 'isRtl()',
		'[class.hub-stepper--truncate-titles]': 'truncateTitles()',
		'[class.stepper--truncate-titles]': 'truncateTitles()',
		'[class.hub-stepper--nav-track]': "nav() === 'track'",
		'[attr.data-variant]': 'variant() ?? null',
		'[style.--hub-stepper-accent]': 'customAccent()'
	}
})
export class StepperComponent implements AfterContentInit, OnDestroy {
	#cdr = inject(ChangeDetectorRef);
	#hostRef = inject(ElementRef<HTMLElement>);
	#animationFrameId: number | null = null;

	/** Unique per-instance token used to build stable ARIA ids for tabs and panels. */
	readonly #instanceId = nextStepperInstanceId++;

	/** Exposes layout enum values to the template. */
	readonly StepperLayout = StepperLayout;

	/** Stores the index of the currently active step. */
	readonly currentIndex = signal(0);

	/** Stores whether content transition animation is currently running. */
	readonly contentAnimating = signal(false);

	/** Stores transition direction used by the CSS animation classes. */
	readonly animationDirection = signal<StepperAnimationDirection>(StepperAnimationDirection.Forward);

	/**
	 * Index of the rail tab holding the roving tabindex while the user moves
	 * focus with the keyboard without activating a step, or `null` when the
	 * tab stop follows the active step.
	 */
	protected readonly focusedIndex = signal<number | null>(null);

	/**
	 * Semantic accent of the stepper: `'primary'` · `'secondary'` · `'success'` ·
	 * `'danger'` · `'warning'` · `'info'` · `'neutral'` · `'light'` · `'dark'`, or
	 * any custom string (read as `--hub-sys-color-<variant>`).
	 * Re-bases `--hub-stepper-accent`, which drives the active step pill and the
	 * next / submit controls. Defaults to primary.
	 */
	readonly variant = input<string>();

	/**
	 * Inline accent for custom (non-built-in) variants — the built-in nine are
	 * resolved by the SCSS `@each` loop, so this returns `null` for them.
	 *
	 * Any custom value is accepted: a bareword (semantic name / registered accent /
	 * CSS named colour) resolves to `var(--hub-sys-color-<v>, <v>)` — the design-system
	 * token with the raw word as fallback — while a literal `#hex` / `rgb()` /
	 * `oklch()` / `var()` is passed through unchanged.
	 */
	protected readonly customAccent = computed(() => {
		const v = this.variant()?.trim();
		if (!v) {
			return null;
		}
		return STEPPER_BUILT_IN_VARIANTS.has(v) ? null : resolveHubAccent(v);
	});

	/** Optional custom label for the back button. */
	readonly backLabel = input<string | null>(null);

	/** Optional custom label for the continue button. */
	readonly continueLabel = input<string | null>(null);

	/** Optional custom label for the submit button. */
	readonly submitLabel = input<string | null>(null);

	/**
	 * Opt-in truncation of the nav step titles. When `true`, each title is clipped
	 * to `--hub-stepper-nav-title-max-width` (default `12rem`) with an ellipsis and,
	 * if it overflows, exposes its full text as a tooltip (the hub-ui tooltip by
	 * default; swappable with `provideHubTooltip`). Off by default, so the standard
	 * nav layout is unchanged.
	 */
	readonly truncateTitles = input(false);

	/**
	 * Accessible name of the step rail tablist, announced by assistive
	 * technologies. Defaults to `'Steps'`.
	 */
	readonly railLabel = input('Steps');

	/**
	 * Which rail the component draws: `'pills'`, the text buttons it has always drawn, or
	 * `'track'`, the inline variant with a numbered marker, a connector and a tick per step in
	 * order.
	 *
	 * The two differ in more than paint. The pills rail lets the user jump to any step that is
	 * not `disabled`, which is what it has always done; the track additionally refuses a forward
	 * jump while a step in between is out of order, which is the rule a wizard that saves on the
	 * jump actually needs (`isReachable`).
	 */
	readonly nav = input<StepperNavVariant>('pills');

	/**
	 * Label announced on a track marker that is in order, alongside the step title.
	 * Falls back to the translated `IN_ORDER` key.
	 */
	readonly inOrderLabel = input<string | null>(null);

	/**
	 * Gate consulted before the active step changes — the hook a wizard hangs its "save what the
	 * user typed before leaving" on.
	 *
	 * It runs while the stepper is still on the step being left, and cancels the move by
	 * returning `false`, a promise resolving to `false`, or a promise that rejects. An output
	 * cannot do this job: by the time it fires the step has already changed, so there is nothing
	 * left to refuse. It is the same contract `ng-hub-ui-portal` gives `beforeDismiss`.
	 *
	 * @example
	 * ```html
	 * <hub-stepper nav="track" [beforeStepChange]="saveBeforeLeaving">…</hub-stepper>
	 * ```
	 * ```ts
	 * saveBeforeLeaving = async ({ from }: StepperStepChange) => this.save(from);
	 * ```
	 */
	readonly beforeStepChange = input<StepperStepChangeGuard | null>(null);

	/** Emits once the user completes the last step. */
	readonly completed = output<void>();

	/** Emits the new index when moving to the previous step. */
	readonly previousStep = output<number>();

	/** Emits the new index when moving to the next step. */
	readonly nextStep = output<number>();

	/** Content-projected step definitions. */
	readonly steps = contentChildren(StepComponent);

	/** Automatically assigns each step its zero-based position when the steps collection changes. */
	protected readonly assignStepIndexes = effect(() => {
		this.steps().forEach((step, i) => step.index.set(i));
	});

	/** Optional content-projected template for custom navigation. */
	readonly stepperNavTpt = contentChild(StepperNavDirective, { read: TemplateRef });

	/**
	 * Optional content-projected template rendered in place of the built-in rail trigger, once
	 * per step. Only the default rail uses it: a `hubStepperNav` template draws its own triggers.
	 *
	 * The context carries the step itself as `$implicit`, plus `title`, `index`, `isCurrent`,
	 * `isCompleted`, `disabled` and — from 22.12.0 — `visited`, `valid`, `inOrder` and
	 * `reachable`. `isCompleted` still answers on position alone, so a template written against
	 * the old context reads exactly the same. Activation stays with the consumer, which is what a
	 * template reference on the host is for: `<hub-stepper #wizard>` … `(click)="wizard.goTo(index)"`.
	 */
	readonly stepTriggerTpt = contentChild(StepTriggerDirective, { read: TemplateRef });

	/**
	 * Optional custom projected previous button.
	 *
	 * `descendants: false` on the three control queries is not a detail. Content projection with
	 * a `select` only ever matches a direct child of the host, so a `button previousButton`
	 * nested deeper — inside a `hub-step`, inside a form — can never reach the controls row. With
	 * the default `descendants: true` the query found it anyway, the component concluded a custom
	 * control had been supplied, and rendered no button at all: the stepper lost its own control
	 * to a button it could not display.
	 */
	readonly previousButton = contentChild(PreviousButtonDirective, { descendants: false });

	/** Optional custom projected next button. See `previousButton` for why the query is shallow. */
	readonly nextButton = contentChild(NextButtonDirective, { descendants: false });

	/** Optional custom projected submit button. See `previousButton` for why the query is shallow. */
	readonly submitButton = contentChild(SubmitButtonDirective, { descendants: false });

	/**
	 * Optional visual and layout configuration for the stepper container.
	 */
	readonly options = input<StepperOptions>({});

	/**
	 * Returns the active layout mode.
	 *
	 * @returns The configured layout or the vertical default.
	 */
	layout(): StepperLayout {
		return this.options()?.layout ?? StepperLayout.Vertical;
	}

	/**
	 * Returns whether right-to-left mode is enabled.
	 *
	 * @returns `true` when RTL mode is active.
	 */
	isRtl(): boolean {
		return this.options()?.rtl ?? false;
	}

	/**
	 * Returns the ARIA orientation of the step rail tablist. The rail lays out
	 * horizontally in the default (vertical) layout and vertically in the
	 * sidebar layout.
	 *
	 * @returns `'vertical'` for the sidebar layout, `'horizontal'` otherwise.
	 */
	protected railOrientation(): 'horizontal' | 'vertical' {
		return this.layout() === StepperLayout.Sidebar ? 'vertical' : 'horizontal';
	}

	/**
	 * Returns the stable DOM id of the rail tab for the given step index.
	 *
	 * @param index Step index.
	 * @returns Unique, per-instance tab id.
	 */
	protected tabId(index: number): string {
		return `hub-stepper-${this.#instanceId}-tab-${index}`;
	}

	/**
	 * Returns the stable DOM id of the content panel for the given step index.
	 *
	 * @param index Step index.
	 * @returns Unique, per-instance panel id.
	 */
	protected panelId(index: number): string {
		return `hub-stepper-${this.#instanceId}-panel-${index}`;
	}

	/**
	 * Roving `tabindex` for the rail tab at `index`: `0` for the focused tab
	 * (or the active step when no tab holds transient keyboard focus), `-1`
	 * for the rest — so the rail is a single Tab stop and the arrow keys move
	 * within it.
	 *
	 * @param index Step index of the tab.
	 * @returns `0` for the current tab stop, `-1` otherwise.
	 */
	protected tabIndexFor(index: number): number {
		return (this.focusedIndex() ?? this.currentIndex()) === index ? 0 : -1;
	}

	/**
	 * Keyboard navigation for the step rail (WAI-ARIA tabs pattern, manual
	 * activation): ArrowRight/ArrowDown and ArrowLeft/ArrowUp move focus
	 * between enabled step tabs (wrapping, skipping disabled steps), Home/End
	 * jump to the first/last enabled tab, and Enter/Space activates the
	 * focused step under the same permission model as clicking its trigger
	 * (`canActivate`). Moving focus never changes the active step.
	 *
	 * @param event Keyboard event fired on a rail tab.
	 * @param index Step index of the tab that received the event.
	 */
	protected onRailKeydown(event: KeyboardEvent, index: number): void {
		let target: number;
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
				target = this.#stepEnabledIndex(index, 1);
				break;
			case 'ArrowLeft':
			case 'ArrowUp':
				target = this.#stepEnabledIndex(index, -1);
				break;
			case 'Home':
				target = this.#firstEnabledIndex();
				break;
			case 'End':
				target = this.#lastEnabledIndex();
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (this.canActivate(index)) {
					this.goTo(index);
				}
				return;
			default:
				return;
		}
		if (target < 0) {
			return;
		}
		event.preventDefault();
		this.#focusTab(target);
	}

	/**
	 * Returns the next enabled step index from `index` in `direction`,
	 * wrapping around the rail.
	 *
	 * @param index Starting step index.
	 * @param direction `1` to search forward, `-1` to search backward.
	 * @returns The nearest enabled index, or `-1` when there are no steps.
	 */
	#stepEnabledIndex(index: number, direction: 1 | -1): number {
		const steps = this.steps();
		const count = steps.length;
		if (!count) {
			return -1;
		}
		for (let step = 1; step <= count; step += 1) {
			const candidate = (((index + direction * step) % count) + count) % count;
			if (!steps[candidate].disabled()) {
				return candidate;
			}
		}
		return index;
	}

	/**
	 * Returns the index of the first enabled step.
	 *
	 * @returns First enabled index, or `-1` when every step is disabled.
	 */
	#firstEnabledIndex(): number {
		return this.steps().findIndex((step) => !step.disabled());
	}

	/**
	 * Returns the index of the last enabled step.
	 *
	 * @returns Last enabled index, or `-1` when every step is disabled.
	 */
	#lastEnabledIndex(): number {
		const steps = this.steps();
		for (let i = steps.length - 1; i >= 0; i -= 1) {
			if (!steps[i].disabled()) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Moves the roving tabindex and DOM focus to the rail tab at `index`.
	 *
	 * @param index Step index of the tab to focus.
	 */
	#focusTab(index: number): void {
		this.focusedIndex.set(index);
		this.#cdr.detectChanges();
		const host: HTMLElement = this.#hostRef.nativeElement;
		// Scoped to the rail so a nested stepper inside a step panel cannot contribute tabs, and
		// widened to `[role="tab"]` so a `hubStepTrigger` template that carries the role but not
		// the class still receives focus. A comma selector yields each element once.
		const rail = host.querySelector('.hub-stepper__nav') ?? host;
		const triggers = rail.querySelectorAll<HTMLElement>('.hub-stepper__nav-trigger, .stepper__nav-trigger, [role="tab"]');
		triggers[index]?.focus();
	}

	/** Returns the active step component instance or `null` when unavailable. */
	get currentStep(): StepComponent | null {
		return this.steps()?.[this.currentIndex()] ?? null;
	}

	/**
	 * Returns whether host classes enable animated transitions. Both spellings count while the
	 * unprefixed one is supported: `hub-stepper--animated` from 22.10.0, `stepper--animated`
	 * until 23.0.0 removes it.
	 */
	hasAnimationClass(): boolean {
		const classes: DOMTokenList = this.#hostRef.nativeElement.classList;
		return classes.contains('hub-stepper--animated') || classes.contains('stepper--animated');
	}

	/** Returns whether transition direction is forward. */
	isForwardAnimation(): boolean {
		return this.animationDirection() === StepperAnimationDirection.Forward;
	}

	/** Returns whether transition direction is backward. */
	isBackwardAnimation(): boolean {
		return this.animationDirection() === StepperAnimationDirection.Backward;
	}

	/**
	 * Initializes projected step metadata after content projection, and records the step the
	 * stepper starts on as visited — the one step no navigation ever passes through.
	 */
	ngAfterContentInit(): void {
		this.initializeSteps();
		this.steps()[this.currentIndex()]?.visited.set(true);
	}

	/** Clears pending animation frame callbacks on component destroy. */
	ngOnDestroy(): void {
		this.clearAnimationFrame();
	}

	/**
	 * Triggers initial change detection for projected steps.
	 */
	private initializeSteps(): void {
		this.#cdr.detectChanges();
	}

	/**
	 * Navigates to the previous step index.
	 */
	goToPrevious(): void {
		this.goTo(this.currentIndex() - 1);
	}

	/**
	 * Navigates to the next step index.
	 */
	goToNext(): void {
		this.goTo(this.currentIndex() + 1);
	}

	/**
	 * Navigates to a specific step index, when the step allows it and `beforeStepChange` lets the
	 * move through.
	 *
	 * Stays `void` and synchronous in the ungated case, so nothing that already called it has to
	 * change; an asynchronous gate simply lands the move later, the way `HubPortalRef.dismiss()`
	 * does.
	 *
	 * @param index Target step index.
	 */
	goTo(index: number): void {
		if (!this.canNavigateTo(index) || index === this.currentIndex()) {
			return;
		}
		const gate = this.beforeStepChange();
		if (!gate) {
			this.#applyStepChange(index);
			return;
		}
		const answer = gate({ from: this.currentIndex(), to: index });
		if (answer instanceof Promise) {
			answer.then(
				(allowed) => {
					if (allowed !== false) {
						this.#applyStepChange(index);
					}
				},
				() => {}
			);
		} else if (answer !== false) {
			this.#applyStepChange(index);
		}
	}

	/**
	 * Moves the active step and emits the direction output.
	 *
	 * Re-reads `currentIndex` instead of trusting the value captured before the gate: an
	 * asynchronous guard can resolve long after another move has landed.
	 *
	 * @param index Target step index.
	 */
	#applyStepChange(index: number): void {
		const previousIndex = this.currentIndex();
		if (index === previousIndex || !this.canNavigateTo(index)) {
			return;
		}
		this.animationDirection.set(
			index > previousIndex ? StepperAnimationDirection.Forward : StepperAnimationDirection.Backward
		);
		this.currentIndex.set(index);
		// Marked here rather than in an effect: consecutive moves inside one change-detection
		// pass would coalesce, and only the step the user ended on would count as visited.
		this.steps()[index]?.visited.set(true);
		this.focusedIndex.set(null);
		this.playContentTransition();
		this.#cdr.detectChanges();
		if (index > previousIndex) {
			this.nextStep.emit(index);
		} else {
			this.previousStep.emit(index);
		}
	}

	/**
	 * Returns whether the target step can be activated.
	 *
	 * @param index Target step index.
	 * @returns `true` when index is in bounds and the step is not disabled.
	 */
	canNavigateTo(index: number): boolean {
		return this.isStepIndexInBounds(index) && this.isValidStepIndex(index);
	}

	/**
	 * Returns whether the step counts as done and sound — its `valid` input when the consumer
	 * states one, otherwise whether the user has been through it.
	 *
	 * Not the same question as `isCompleted` in the trigger template context, which answers on
	 * position alone and is left as it was.
	 *
	 * @param index Step index to inspect.
	 * @returns `true` when the step is in order.
	 */
	isInOrder(index: number): boolean {
		return this.steps()[index]?.inOrder() ?? false;
	}

	/**
	 * Returns whether the track rail will let the user jump to the step: backwards always,
	 * forwards only once every step from the current one up to the one before the target is in
	 * order. A `disabled` step is closed off either way.
	 *
	 * The current step counts as one of the steps in between, so a wizard that marks it
	 * `[valid]="false"` blocks the move out of it rather than only the ones past it.
	 *
	 * @param index Target step index.
	 * @returns `true` when the step is reachable from where the stepper stands.
	 */
	isReachable(index: number): boolean {
		if (!this.canNavigateTo(index)) {
			return false;
		}
		const current = this.currentIndex();
		for (let i = current; i < index; i += 1) {
			if (!this.isInOrder(i)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Returns whether the rail in use will activate the step on a click or an Enter.
	 * The pills rail asks only about `disabled`, which is what it has always done; the track
	 * asks about order as well.
	 *
	 * @param index Target step index.
	 * @returns `true` when the active rail allows the step to be activated.
	 */
	protected canActivate(index: number): boolean {
		return this.nav() === 'track' ? this.isReachable(index) : this.canNavigateTo(index);
	}

	/**
	 * Completes the stepper workflow and emits the completion event.
	 */
	complete(): void {
		this.completed.emit();
	}

	/**
	 * Returns whether a step at the provided index is enabled.
	 *
	 * @param index Step index to validate.
	 * @returns `true` when the step exists and is enabled.
	 */
	isValidStepIndex(index: number): boolean {
		return !this.steps()?.[index]?.disabled();
	}

	/**
	 * Returns whether the provided index is within the steps collection bounds.
	 *
	 * @param index Step index to validate.
	 * @returns `true` when the index points to an existing step.
	 */
	isStepIndexInBounds(index: number): boolean {
		return index >= 0 && index < this.steps().length;
	}

	/**
	 * Starts and schedules the content transition animation lifecycle.
	 */
	private playContentTransition(): void {
		this.clearAnimationFrame();
		this.contentAnimating.set(false);
		if (!this.hasAnimationClass()) {
			return;
		}
		this.#animationFrameId = globalThis.requestAnimationFrame(() => {
			this.contentAnimating.set(true);
			this.#cdr.detectChanges();
		});
	}

	/**
	 * Clears the pending animation frame used to trigger content transitions.
	 */
	private clearAnimationFrame(): void {
		if (this.#animationFrameId !== null) {
			globalThis.cancelAnimationFrame(this.#animationFrameId);
			this.#animationFrameId = null;
		}
	}

	/**
	 * Handles animation end events and resets the active transition state.
	 *
	 * @param event DOM animation end event.
	 */
	onContentAnimationEnd(event: AnimationEvent): void {
		if (event.target !== event.currentTarget) {
			return;
		}
		this.contentAnimating.set(false);
		this.#cdr.detectChanges();
	}
}
