# Schimbări Playwright (15 mai 2026) — ghid detaliat

Acest document descrie, în limba română, reorganizarea suitei end-to-end Playwright: **Page Object Models (POM)**, **fixture-uri personalizate**, **teste noi**, **configurare** și **adaptări în aplicația Angular** pentru testabilitate stabilă.

---

## 1. Rezumat executiv

- **Testele** nu mai stau toate într-un singur fișier la rădăcina `tests/`; acum sunt sub `tests/playwright/specs/`, iar configurația Playwright indică explicit acest director.
- **Page Object Model**: componente TypeScript care încapsulează locatorii și acțiunile pe formulare (Basic, Using the Grid) plus navigarea către rute.
- **Fixture-uri**: extind `test` din Playwright astfel încât fiecare test primește automat instanțe gata făcute (`onBasicForm`, `onGridForm`, `onApplicationURLs`).
- **Aplicația** primește `data-testid` pe carduri, câmpuri, checkbox-uri, radio-uri și butoane de submit relevante, astfel încât testele să nu depindă de text vizibil sau structură fragilă.
- **Testele vechi** (`firstTest.spec.ts`) sunt mutate în `legacy/` și **nu mai rulează** implicit (`testIgnore`), dar rămân în repo ca referință.

---

## 2. Structura de fișiere (nouă / relevantă)

```
tests/playwright/
├── fixtures/
│   └── base_fixture.ts          # extensie test + fixture-uri POM
├── specs/
│   ├── formLayouts/
│   │   └── formLayouts.spec.ts # teste funcționale Form Layouts
│   └── legacy/
│       └── firstTest.spec.ts   # vechiul stil (exclus din rulare)
└── support/
    └── components/
        ├── forms/
        │   ├── BaseFormComponent.ts
        │   ├── BasicFormComponent.ts
        │   └── UsingGridComponent.ts
        └── main/
            └── applicationURLs.ts
```

`playwright.config.ts` (la rădăcina repo-ului) leagă totul: `testDir`, ignorarea `legacy`, `baseURL`, `testIdAttribute`, serverul web Angular etc.

---

## 3. Modificări în `playwright.config.ts`

| Setare | Rol |
|--------|-----|
| `testDir: './tests/playwright/specs'` | Playwright caută spec-uri doar în acest arbore. |
| `testIgnore: '**/legacy/**'` | Fișierele din `specs/legacy/` (ex. vechiul `firstTest`) nu intră în rularea standardă. |
| `timeout: 20000` | Timeout global mai explicit pentru teste (20 s). |
| `use.testIdAttribute: 'data-testid'` | Toți locatorii `getByTestId(...)` se mapează pe atributul HTML `data-testid` din Angular. |
| `use.baseURL: 'http://localhost:4200'` | `page.goto('/pages/...')` folosește baza corectă. |
| `webServer` | Pornește `npm start` înainte de teste; în local poate reutiliza serverul deja pornit (`reuseExistingServer`). |

---

## 4. Modificări în aplicație (`form-layouts.component.html`)

Pentru ca POM-urile să fie **stabile** și **rezistente la schimbări de copy** (texte, traduceri), s-au adăugat identificatori `data-testid` pe:

- **Card „Using the Grid”**: `grid-form-card`; email/parolă; radio `option1-radio`, `option2-radio`, `disabledOption-radio`; buton submit.
- **Card „Basic form”** (și zone adiacente după caz): `basic-form-card`, `email-input`, `password-input`, `check-me-out-checkbox`, `submit-button`.

Playwright folosește `page.getByTestId('...')`, deci contractul între UI și test este **atributul `data-testid`**, nu textul „Email” sau „Option 2”.

---

## 5. Page Object Model — detaliu pe clase

### 5.1. `BaseFormComponent` (abstract)

- Primește `page` și un `cardTestId` (identificatorul cardului).
- Definește:
  - `card` — rădăcina secțiunii formularului (`getByTestId(cardTestId)`).
  - `submitButton` — butonul de submit **în interiorul** cardului (`card.getByTestId('submit-button')`), astfel încât fiecare formular să lovească butonul corect chiar dacă există mai multe submit-uri pe pagină.
- Metode comune:
  - `assertVisibility(boolean)` — verifică vizibilitatea cardului cu `expect`.
  - `submit()` — click pe submit-ul din card.

### 5.2. `BasicFormComponent`

- Extinde `BaseFormComponent` cu `cardTestId = 'basic-form-card'`.
- Locatori: email, parolă, checkbox „Check me out” (input real din interiorul `nb-checkbox`).
- Metode:
  - `fillEmail` / `fillPassword` — `fill()` pe câmpuri.
  - `toggleCheckMeOut` — pattern **verificare înainte → acțiune → verificare după**: nu e bifat → `check({ force: true })` → e bifat.
  - `unToggleCheckMeOut` — invers, pentru scenarii viitoare.

### 5.3. `UsingGridComponent`

- Extinde `BaseFormComponent` cu `cardTestId = 'grid-form-card'`.
- Tip `GridRadioOptions`: `'option1' | 'option2' | 'disabledOption'` — aliniat la `data-testid` din template (`${key}-radio`).
- `selectOption(key)` — același pattern ca la checkbox: stare inițială → `check` → stare finală verificată.

### 5.4. `ApplicationURLs`

- Nu este un „form POM”, ci un **helper de navigare**.
- `navigateToFormsLayouts()`:
  - `page.goto('/pages/forms/layouts', { waitUntil: 'domcontentloaded' })`.
  - Instanțiază `BasicFormComponent` și apelează `assertVisibility(true)` ca **ancoră** că pagina Form Layouts s-a încărcat și secțiunea de bază e prezentă (mai robust decât doar `goto`).

---

## 6. Fixture-uri — `base_fixture.ts`

Playwright permite `test.extend<MyFixtures>({ ... })`. Aici:

| Fixture | Tip furnizat | Scop |
|---------|----------------|------|
| `onBasicForm` | `BasicFormComponent` | Interacțiune cu formularul Basic. |
| `onGridForm` | `UsingGridComponent` | Interacțiune cu „Using the Grid”. |
| `onApplicationURLs` | `ApplicationURLs` | Navigare + validare încărcare pagină. |

**Factory reutilizabil** `createFixture(Component)`:

- Primește un constructor `new (page: Page) => T`.
- În lifecycle-ul fixture-ului Playwright: creează `new Component(page)` și îl pasează testului prin `use(...)`.

**`scope: 'test'`** — fiecare test primește propria instanță; nu se partajează stare între teste paralele din același worker (comportament așteptat pentru POM-uri legate de `page`).

Exporturi: `test` (extins) și `expect` din `@playwright/test` (re-export pentru import unic din spec-uri).

---

## 7. Teste — `formLayouts.spec.ts`

- Importă `test` din `../../fixtures/base_fixture` (nu direct din `playwright/test`).
- `test.describe('Form Layouts page', ...)` grupează scenariile.
- Nume de teste orientate spre comportament: **„user should be able to …”** (utilizatorul ar trebui să poată …).

### Scenarii

1. **Formular basic** — navigare → vizibilitate → completare email/parolă → bifare checkbox → submit.
2. **Formular grid** — navigare → vizibilitate → completare → selectare radio `option2` → submit.

Pașii sunt împărțiți cu `test.step('...', async () => { ... })` pentru rapoarte HTML/trace mai lizibile.

---

## 8. Folder `legacy` și `firstTest.spec.ts`

- Fișierul original a fost **eliminat** din locația veche (`tests/firstTest.spec.ts`) și **recreiat** sub `tests/playwright/specs/legacy/firstTest.spec.ts`.
- Stil vechi: `beforeEach` cu click pe meniu („Forms” → „Form Layouts”), locatori pe `nb-card` + text, `getByRole` pentru radio etc.
- **Nu rulează** în setul standard din cauza `testIgnore: '**/legacy/**'`.
- Utilitate: compară vechiul stil cu noul stack (POM + `data-testid` + fixture-uri) fără a polua CI sau rulările locale obișnuite.

---

## 9. Cum rulezi testele

Din rădăcina proiectului (după `npm install`):

```bash
npx playwright test
```

- Rulează doar spec-urile din `tests/playwright/specs/` care **nu** sunt în `legacy/`.
- Pentru a include intenționat legacy (dacă scoți temporar `testIgnore` sau rulezi cu cale explicită), consultă documentația Playwright pentru filtre/căi.

Raport HTML implicit: configurat cu `reporter: 'html'`.

---

## 10. Principii care rezultă din această refactorizare

1. **Separare**: spec-urile descriu *scenariul*; POM-urile ascund *cum* se găsesc elementele și *cum* se validează stările.
2. **Contract UI**: `data-testid` în template ↔ `getByTestId` în teste.
3. **Fixture-uri**: injectare curată a dependențelor (`onBasicForm` etc.) fără `new Component(page)` repetat în fiecare test.
4. **Asertări în jurul acțiunilor**: checkbox/radio verifică starea înainte și după, reducând fals pozitive și documentând intenția.
5. **Legacy izolat**: istoric păstrat, dar rulare controlată.

---

## 11. Posibile următoare pași (opțional)

- Adăugare `testDescription.md` lângă `formLayouts.spec.ts` (conform standardelor repo-ului pentru documentarea suitei).
- Extindere POM pentru alte carduri de pe aceeași pagină (inline, block etc.) folosind același pattern `BaseFormComponent` + `data-testid` dedicate pe card.

---

*Document generat pentru a reflecta structura și convențiile introduse în sesiunea de lucru din 15 mai 2026.*
