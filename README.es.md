# ng-hub-ui-stepper

**Español** | [English](./README.md)

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-stepper.svg)](https://www.npmjs.com/package/ng-hub-ui-stepper)
[![license](https://img.shields.io/npm/l/ng-hub-ui-stepper.svg)](https://github.com/hub-env/ng-hub-ui-stepper/blob/main/LICENSE)

Un componente de stepper (pasos) flexible, personalizable y accesible para Angular 21+. Ideal para formularios de varios pasos, asistentes y experiencias de usuario guiadas, con un enfoque en la experiencia del desarrollador y los estándares modernos.

> [!IMPORTANT]
> La versión `22.10.4` está pensada para **Angular 22** y usa la arquitectura de **Signals** común a `ng-hub-ui`.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/stepper/overview/
- Ejemplos en vivo: https://hubui.dev/en/stepper/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI en GitHub (incidencias, roadmap y cómo contribuir): https://github.com/hub-env/hub-ui

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta librería forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleto — usa ng-hub-ui-panels)
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
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper) ← Estás aquí
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## Tabla de Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso (Inicio Rápido)](#uso-inicio-rápido)
- [Ejemplos](#ejemplos)
	- [Stepper Lineal](#stepper-lineal)
	- [Navegación Personalizada](#navegación-personalizada)
	- [Botones Personalizados](#botones-personalizados)
	- [Transiciones entre pasos](#transiciones-entre-pasos)
- [Referencia de la API](#referencia-de-la-api)
	- [StepperComponent](#steppercomponent-hub-stepper)
	- [StepComponent](#stepcomponent-hub-step)
	- [Directivas](#directivas)
	- [Clases de host](#clases-de-host)
	- [Servicios](#servicios)
	- [Proveedores](#proveedores)
	- [Interfaces](#interfaces)
- [Internacionalización](#internacionalización)
- [Estilos](#estilos)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

- 🚀 **Angular 21+ Built-in**: Utiliza Signals y la nueva sintaxis de control de flujo.
- 🎨 **Altamente Personalizable**: Fácil de tematizar mediante variables CSS, el mixin de Sass `hub-stepper-theme()` y plantillas personalizadas.
- ♿ **Accesible**: Riel de pasos WAI-ARIA `tablist` con navegación completa por teclado.
- 🔢 **Multi-layout**: Soporta modos Vertical, Lateral (Sidebar) y RTL.
- 🔄 **Transiciones Suaves**: Animaciones CSS opcionales, activadas con la clase de host `stepper--animated` (ver [Transiciones entre pasos](#transiciones-entre-pasos)). Sin dependencia de `@angular/animations`.
- 🧩 **Controles Flexibles**: Usa botones por defecto o proyecta los tuyos propios.
- ✂️ **Truncado opcional de títulos + tooltip**: activa `truncateTitles` para recortar los títulos largos del riel (limitados por `--hub-stepper-nav-title-max-width`) y mostrar el texto completo al pasar el ratón — tooltip de hub-ui por defecto, sustituible con `provideHubTooltip`. Requiere `ng-hub-ui-utils >= 22.6.0` y `@use 'ng-hub-ui-utils/styles/tooltip';`.

> ℹ️ **Lo que el stepper no hace**: nunca inspecciona tus formularios. `canNavigateTo()` responde solo
> según el input `disabled` del paso, así que la regla de «avanzar solo si este paso es válido» vive en tu
> componente — enlaza `[disabled]` del paso siguiente a lo que diga tu formulario (ver
> [Stepper Lineal](#stepper-lineal)).

> ♿ **Modelo de accesibilidad**: el riel de pasos es un `tablist` WAI-ARIA (cada disparador un `tab`, cada contenido de paso un `tabpanel`) con tabindex itinerante, de modo que es una única parada de tabulación. Las flechas mueven el foco entre los pasos habilitados (saltando los deshabilitados, con envolvimiento), `Home`/`End` saltan al primer/último paso habilitado y `Enter`/`Space` activa el paso enfocado bajo las mismas reglas que hacer clic en él. El nombre accesible del riel proviene del input `railLabel` (por defecto `'Steps'`).

## Instalación

```bash
npm install ng-hub-ui-stepper
```

## Uso (Inicio Rápido)

Importa los bloques standalone que use tu plantilla:

```typescript
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

@Component({
  standalone: true,
  imports: [StepperComponent, StepComponent],
  // ...
})
export class TuComponente { }
```

El resto de la superficie — `StepTriggerDirective`, `StepperNavDirective`, `PreviousButtonDirective`,
`NextButtonDirective` y `SubmitButtonDirective` — se importa igual, uno a uno, según lo necesite cada
plantilla.

Después registra la biblioteca una vez, para que los controles integrados de atrás, continuar y
enviar tengan texto:

```typescript
import { provideHubStepper } from 'ng-hub-ui-stepper';

bootstrapApplication(AppComponent, {
  providers: [provideHubStepper({ language: 'es' })]
});
```

> **`StepperModule` está obsoleto y se retira en la 23.0.0.** Solo reexporta los siete bloques de
> arriba, así que importarlos directamente es toda la migración, y `StepperModule.forRoot()` pasa a
> ser `provideHubStepper()`: los mismos proveedores, sin módulo. Consulta
> [Proveedores](#proveedores) e [Internacionalización](#internacionalización).

En tu plantilla:

```html
<hub-stepper>
  <hub-step title="Configuración de Cuenta">
    <h3>¡Bienvenido!</h3>
    <p>Configura los detalles de tu cuenta aquí.</p>
  </hub-step>

  <hub-step title="Información Personal">
    <h3>Datos del Perfil</h3>
    <p>Cuéntanos más sobre ti.</p>
  </hub-step>

  <hub-step title="Revisión">
    <h3>Guardar y Finalizar</h3>
    <p>¿Todo listo para empezar?</p>
  </hub-step>
</hub-stepper>
```

## Ejemplos

### Stepper Lineal

Controla la navegación habilitando o deshabilitando pasos programáticamente.

```html
<hub-stepper (completed)="onFinish()">
  <hub-step title="Paso 1">
    <!-- Contenido Paso 1 -->
  </hub-step>

  <hub-step title="Paso 2" [disabled]="!esPaso1Valido()">
    <!-- Contenido Paso 2 -->
  </hub-step>
</hub-stepper>
```

### Navegación Personalizada

Marca una `ng-template` con la directiva `hubStepperNav` (o `stepperNav`) y sustituirá por completo el riel
integrado. El contexto te da `steps` — las instancias `StepComponent` proyectadas, de modo que `title` y
`disabled` son señales — y `currentIndex`. Una referencia de plantilla sobre el stepper te da `goTo()`.

```html
<hub-stepper #stepper>
  <ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
    <ol class="mi-navegacion-personalizada">
      @for (step of steps; track step; let i = $index) {
        <li>
          <button
            type="button"
            [class.active]="i === currentIndex"
            [disabled]="!stepper.canNavigateTo(i)"
            (click)="stepper.goTo(i)">
            {{ step.title() || 'Paso ' + (i + 1) }}
          </button>
        </li>
      }
    </ol>
  </ng-template>

  <hub-step title="A">...</hub-step>
  <hub-step title="B">...</hub-step>
</hub-stepper>
```

> Sustituir el riel también sustituye su accesibilidad: el `tablist` WAI-ARIA, el tabindex itinerante y el
> manejo de las flechas pertenecen al riel integrado. Una plantilla propia se hace cargo de su semántica.

### Botones Personalizados

Proyecta tus propios botones para sobrescribir el pie de página por defecto. Cada directiva conecta el clic
y mantiene el botón deshabilitado mientras el movimiento no está disponible.

```html
<hub-stepper>
  <hub-step>...</hub-step>

  <button previousButton class="btn-back">Atrás</button>
  <button nextButton class="btn-next">Siguiente</button>
  <button submitButton class="btn-done">Completar</button>
</hub-stepper>
```

### Transiciones entre pasos

Las transiciones son CSS puro y opcionales: añade `hub-stepper--animated` al host y elige el tipo con
`hub-stepper--anim-slide` (el valor por defecto si no indicas ninguno) o `hub-stepper--anim-fade`. La
duración sale de `--hub-stepper-animation-duration`. Las grafías `stepper--animated`,
`stepper--anim-slide` y `stepper--anim-fade` se siguen leyendo, y desaparecen en la 23.0.0.

```html
<hub-stepper
  class="hub-stepper--animated hub-stepper--anim-fade"
  [style.--hub-stepper-animation-duration.ms]="240"
>
  <hub-step title="Perfil">...</hub-step>
  <hub-step title="Resumen">...</hub-step>
</hub-stepper>
```

### Disparadores de riel a medida

`hubStepperNav` sustituye el riel entero. Cuando lo único que quieres es otro control dentro de cada
elemento del riel — un círculo numerado, un icono, una marca en los pasos ya hechos —
`hubStepTrigger` está un nivel por debajo: el riel conserva su lista, su `role="tablist"`, su
orientación y su etiqueta, y solo el botón de dentro es tuyo.

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

  <hub-step title="Cuenta">...</hub-step>
  <hub-step title="Pago">...</hub-step>
</hub-stepper>
```

El contexto trae el paso como `$implicit` y como `step`, más `title`, `index`, `isCurrent`,
`isCompleted` y `disabled`. Activar un paso sigue siendo cosa tuya, a través de una referencia de
plantilla en el host — por eso el ejemplo nombra al stepper `#wizard`. Ponle `role="tab"` al
disparador si quieres que la navegación por flechas del riel lo siga encontrando.

Un stepper que declare las dos plantillas usa `hubStepperNav` e ignora esta.

## Referencia de la API

### StepperComponent (`hub-stepper`)

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `variant` | `string` | `undefined` (se pinta como primary) | Acento semántico para la píldora del paso activo y los controles de siguiente / enviar. Valores integrados: `primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark`. Cualquier otra cadena también se acepta y se resuelve a través de `--hub-sys-color-<variant>`. |
| `backLabel` | `string \| null` | `null` | Sobrescribe la etiqueta del botón de retroceso. Mientras sea `null` se usa la etiqueta traducida `BACK`. |
| `continueLabel` | `string \| null` | `null` | Sobrescribe la etiqueta del botón de continuar. Mientras sea `null` se usa la etiqueta traducida `CONTINUE`. |
| `submitLabel` | `string \| null` | `null` | Sobrescribe la etiqueta del botón de envío final. Mientras sea `null` se usa la etiqueta traducida `SUBMIT`. |
| `truncateTitles` | `boolean` | `false` | Recorta cada título del riel a `--hub-stepper-nav-title-max-width` (por defecto `12rem`) y muestra el texto completo como tooltip cuando se desborda. |
| `railLabel` | `string` | `'Steps'` | Nombre accesible del `tablist` del riel de pasos. |
| `options` | `StepperOptions` | `{}` | Configuración visual y de diseño. |

| Salida | Tipo | Descripción |
|---|---|---|
| `completed` | `OutputEmitterRef<void>` | Se emite cuando se completa el último paso. |
| `previousStep` | `OutputEmitterRef<number>` | Se emite al retroceder. Pasa el nuevo índice. |
| `nextStep` | `OutputEmitterRef<number>` | Se emite al avanzar. Pasa el nuevo índice. |

Miembros públicos accesibles mediante una referencia de plantilla (`<hub-stepper #stepper>`):

| Miembro | Firma | Descripción |
|---|---|---|
| `currentIndex` | `WritableSignal<number>` | Índice del paso activo. |
| `steps` | `Signal<readonly StepComponent[]>` | Los pasos proyectados, en orden. |
| `currentStep` | `StepComponent \| null` | La instancia del paso activo. |
| `goTo` | `(index: number) => void` | Activa un paso. Solo comprueba los límites — no consulta `canNavigateTo`, así que un salto programático puede aterrizar en un paso `disabled`. |
| `goToPrevious` / `goToNext` | `() => void` | Retrocede o avanza un paso. |
| `canNavigateTo` | `(index: number) => boolean` | `true` cuando el índice existe y su paso no está `disabled`. |
| `complete` | `() => void` | Emite `completed`. |

### StepComponent (`hub-step`)

| Entrada | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `title` | `string \| undefined` | `undefined` | Texto mostrado en el riel. Sin él se muestra `Step N`. |
| `disabled` | `boolean` | `false` | Evita la navegación a este paso desde el riel y desde los controles integrados. |

`index` **no** es un input: lo asigna el stepper padre. Leerlo (`step.index()`) es correcto; enlazarlo, no.

### Directivas

| Directiva | Selectores | Se aplica a | Cometido |
|---|---|---|---|
| `NextButtonDirective` | `button[nextButton]`, `button[continueButton]` | `<button>` | Llama a `goToNext()` y deshabilita el botón cuando no hay un paso siguiente habilitado. |
| `PreviousButtonDirective` | `button[previousButton]`, `button[backButton]` | `<button>` | Llama a `goToPrevious()` y deshabilita el botón cuando no hay un paso anterior habilitado. |
| `SubmitButtonDirective` | `button[submitButton]` | `<button>` | Llama a `complete()` y deshabilita el botón mientras el paso actual está `disabled`. |
| `StepperNavDirective` | `[hubStepperNav]`, `[stepperNav]` | `<ng-template>` | Sustituye el riel integrado. Contexto: `steps`, `currentIndex`. |
| `StepTriggerDirective` | `[hubStepTrigger]`, `[stepTrigger]` | `<ng-template>` | Sustituye el disparador que dibuja el riel integrado, una vez por paso. Contexto: `$implicit` / `step`, `title`, `index`, `isCurrent`, `isCompleted`, `disabled`. Se ignora si hay una plantilla `hubStepperNav`, porque un riel propio dibuja sus disparadores. |

### Clases de host

Se ponen en el propio `<hub-stepper>`; las lee la hoja de estilos, no los inputs.

| Clase | Efecto |
|---|---|
| `hub-stepper--animated` | Activa la transición CSS entre paneles de paso. Sin ella, los paneles se intercambian de golpe. |
| `hub-stepper--anim-slide` | Transición de deslizamiento (también la de por defecto cuando solo está `hub-stepper--animated`). |
| `hub-stepper--anim-fade` | Transición de fundido en lugar del deslizamiento. |

> **Renombradas en la 22.10.0.** Antes eran `stepper--animated`, `stepper--anim-slide` y
> `stepper--anim-fade`, y el propio componente llevaba una clase `stepper` a secas. `stepper` es una
> palabra del espacio de nombres de la aplicación, no de la librería, así que una aplicación con su
> propia regla `.stepper` reestilaba el componente desde fuera. El bloque entero pasa a ser
> `hub-stepper`, como en el resto de la familia. **Las grafías antiguas siguen funcionando y se
> siguen escribiendo en el DOM**; ambas desaparecen en la **23.0.0**. Ver
> [`BREAKING_CHANGES.md`](./BREAKING_CHANGES.md).

### Servicios

#### `StepperThemeService`

Provisto en la raíz. Escribe propiedades personalizadas `--hub-stepper-*` sobre `documentElement`, para
temas que se deciden en tiempo de ejecución (el color de un tenant que llega de una API, por ejemplo). Las
claves se pasan **sin** el prefijo `--hub-stepper-`, que añade el propio servicio:

```typescript
inject(StepperThemeService).setTheme({
  accent: '#7c3aed',
  'nav-link-active-color': '#ffffff',
  gap: '1.5rem'
});
```

Para un tema conocido en tiempo de compilación es preferible el [mixin `hub-stepper-theme()`](#mixin-de-sass):
se acota a un selector en lugar de a la raíz del documento.

### Proveedores

#### `provideHubStepper(config?: StepperConfig)`

El punto de entrada standalone. Registra los diez diccionarios incluidos y el
`HubTranslationService` que inyecta `TranslatePipe` para resolver las etiquetas de los controles
integrados. El servicio no es `providedIn: 'root'`, así que sin esto —o sin otro proveedor suyo— el
primer render lanza `NullInjectorError`.

```typescript
bootstrapApplication(AppComponent, {
  providers: [provideHubStepper({ language: 'es', fallbackLanguage: 'en' })]
});
```

También se puede acotar a la ruta que contiene el asistente, que es lo que debe hacer una aplicación
que ya configure `provideHubTranslation()` en la raíz; el porqué está en
[Internacionalización](#internacionalización).

#### `STEPPER_DICTIONARIES`

Los diccionarios incluidos como objeto plano, indexado por código de idioma, para registrar solo los
idiomas que publicas o mezclar las etiquetas con un diccionario propio:

```typescript
import { STEPPER_DICTIONARIES } from 'ng-hub-ui-stepper';

provideHubTranslation({
  language: 'ca',
  fallbackLanguage: 'en',
  dictionaries: {
    ca: { ...STEPPER_DICTIONARIES['ca'], ...misCadenasEnCatalan },
    en: { ...STEPPER_DICTIONARIES['en'], ...misCadenasEnIngles }
  }
});
```

Las claves son planas —`BACK`, `CONTINUE`, `SUBMIT`—, que es lo que resuelve el componente cuando
falla su espacio de nombres `HUBUI.STEPPER`.

### Interfaces

#### `StepperOptions`
```typescript
interface StepperOptions {
  layout?: 'vertical' | 'sidebar';
  rtl?: boolean;
}
```

#### `StepperConfig`

Lo aceptan `provideHubStepper()` y el obsoleto `StepperModule.forRoot()`:

```typescript
interface StepperConfig {
  language?: string;        // por defecto 'es'
  fallbackLanguage?: string; // por defecto 'en'
}
```

## Internacionalización

Las etiquetas integradas de atrás, continuar y enviar pasan por `TranslatePipe` de `ng-hub-ui-utils`. Hay
dos formas de alimentarlas, y se pueden combinar.

**Los diccionarios incluidos.** `provideHubStepper()` registra traducciones para `en`, `es`, `ca`,
`eu`, `gl`, `ast`, `an`, `de`, `zh` y `ar`, además del `HubTranslationService` que inyecta
`TranslatePipe`:

```typescript
providers: [provideHubStepper({ language: 'es', fallbackLanguage: 'en' })];
```

`StepperModule.forRoot({ language: 'es', fallbackLanguage: 'en' })` hace lo mismo y **se retira en la
23.0.0** junto con el módulo; ahora delega en `provideHubStepper()`, así que el cambio no altera nada
en ejecución.

Un aviso: `provideHubStepper()` escribe `HUB_TRANSLATION_CONFIG`, que es un único token de ámbito de
aplicación. Si ya llamas a `provideHubTranslation()` en la raíz, no registres los dos: gana el último
y el otro se queda sin diccionarios. Mezcla las etiquetas del stepper en tu propia llamada con
[`STEPPER_DICTIONARIES`](#stepper_dictionaries), o acota `provideHubStepper()` a la ruta que contiene
el asistente.

**El diccionario de tu aplicación.** Configura `provideHubTranslationAdapter()` una sola vez en
`app.config.ts`; su diccionario reactivo actualiza la navegación automáticamente. El componente provee
`HUB_TRANSLATION_PREFIX` con el valor `HUBUI.STEPPER`, de modo que las claves con espacio de nombres se
buscan primero y las claves planas siguen valiendo como respaldo:

```typescript
// Preferido — con espacio de nombres, así el stepper no reserva claves genéricas de primer nivel:
//   HUBUI.STEPPER.BACK, HUBUI.STEPPER.CONTINUE, HUBUI.STEPPER.SUBMIT
// Se siguen atendiendo, para diccionarios planos ya existentes:
//   BACK, CONTINUE, SUBMIT
```

Por instancia, `backLabel` / `continueLabel` / `submitLabel` prevalecen sobre ambas.

## Estilos

Personaliza el componente usando variables CSS. Para una lista completa de los tokens disponibles, consulta la [Referencia de Variables CSS](docs/css-variables-reference.md).

```css
.mi-stepper {
  --hub-stepper-primary-color: #0d6efd;
  --hub-stepper-surface-color: #ffffff;
  --hub-stepper-gap: 1.5rem;
}
```

### Acento semántico

El token `--hub-stepper-accent` controla la píldora del paso activo y los controles de siguiente / enviar. Su valor por defecto es `var(--hub-sys-color-primary)`. La forma más sencilla de definirlo es la entrada `variant` (consulta la [Referencia de la API](#steppercomponent-hub-stepper)), pero también puedes sobrescribir el token directamente:

```css
.mi-stepper {
  --hub-stepper-accent: var(--hub-sys-color-success);
}
```

### Mixin de Sass

Para una tematización completa en una sola llamada, el paquete incluye un mixin de Sass `hub-stepper-theme()`. Todos los parámetros son opcionales y su valor por defecto es `null`, por lo que solo se emiten como sobrescrituras `--hub-stepper-*` los que pases:

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

## Contribuir

¡Agradecemos todas las contribuciones! Por favor, sigue nuestras [Guías de Commit](https://github.com/hub-env/hub-ui/blob/main/CONTRIBUTING.md).

1. Haz un Fork del repositorio.
2. Crea tu rama de característica (`git checkout -b feature/nueva-caracteristica`).
3. Haz commit de tus cambios.
4. Empuja la rama.
5. Crea un Pull Request.

## Soporte

Si encuentras útil este proyecto, considera apoyar su desarrollo:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

## Soporte comercial

Mantengo estas librerías yo mismo: soy [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), arquitecto frontend autónomo, y trabajo con equipos que construyen y mantienen aplicaciones Angular.

Si tu equipo depende de Hub-UI y necesita más de lo que se resuelve en un hilo de incidencias, eso es a lo que me dedico: auditorías de arquitectura, sistemas de diseño, migraciones de Angular y mentoría de equipos. Cuando el proyecto pide además diseño y un equipo completo, lo llevo por [Frog Hub](https://froghub.es), mi estudio de desarrollo.

Aquí están [los servicios](https://www.carlosmorcillo.com/servicios/) y aquí puedes [contarme tu proyecto](https://www.carlosmorcillo.com/contacto/).

## Licencia

Este proyecto está bajo la Licencia MIT - mira el archivo [LICENSE](LICENSE) para más detalles.
