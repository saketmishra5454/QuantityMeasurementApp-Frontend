# Quantora Angular

This is the Angular version of your Quantity Measurement App. It keeps your original idea, adds real conversion logic, and gives the UI a modern responsive design.

## Where to learn first

- `src/app/app.component.ts`: the TypeScript brain of the app. It stores selected type, selected operation, units, values, and the calculation methods.
- `src/app/app.component.html`: the app shell with navbar links and `<router-outlet />`.
- `src/app/app.routes.ts`: routes for `/converter`, `/login`, and `/signup`.
- `src/app/features/converter`: converter page. Notice `{{ }}` interpolation, `[src]` property binding, `(click)` event binding, `*ngFor` loops, and `[(ngModel)]` two-way form binding.
- `src/app/features/login`: login page using Reactive Forms validation.
- `src/app/features/signup`: signup page using Reactive Forms validation.
- `src/app/services/auth.service.ts`: calls your Spring Boot login/signup endpoints.
- `src/app/services/history.service.ts`: saves conversion history to your Spring Boot backend.
- `src/app/services/api.config.ts`: change the backend base URL here if your Spring Boot app uses another port or path.
- `src/styles.css`: global styles used by the whole app.
- `public/image`: images copied from your original HTML/CSS/JS app.

## Expected Spring Boot endpoints

The Angular services currently expect these endpoints:

```text
POST http://localhost:8080/auth/login
POST http://localhost:8080/auth/register
POST http://localhost:8080/api/quantity/convert
POST http://localhost:8080/api/quantity/add
POST http://localhost:8080/api/quantity/subtract
POST http://localhost:8080/api/quantity/divide
POST http://localhost:8080/api/quantity/compare
GET  http://localhost:8080/api/quantity/getHistory
```

If your backend uses different URLs, update `src/app/services/api.config.ts` or the service methods.

## Development server

To start a local development server, run:

```bash
npx ng serve --host=127.0.0.1 --port=4300
```

Open your browser at `http://127.0.0.1:4300/`. The application reloads whenever you modify source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Next learning steps

1. Match the request body names with your exact Spring Boot DTO classes.
2. Add an HTTP interceptor to send the saved JWT token on protected requests.
3. Create a real history page that lists saved conversion records.
4. Add route guards so only logged-in users can access saved history.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
