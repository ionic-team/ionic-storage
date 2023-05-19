# Releasing a new version

## `@ionic/core`

1. Update the version in `lerna.json` and `lib/package.json`
2. Update the `CHANGELOG.md` file with the new version and date.
3. Install dependencies from `lib/` to ensure the `package-lock.json` is updated with the latest version.
4. Run `npm publish` to publish the new version of `@ionic/core` (this will build and publish the package).
5. Commit the changes.

## `@ionic/angular`

1. Update the version in `angular/package.json`
2. Update the `dependencies` of `angular/package.json` to reference the new version of `@ionic/core`.
3. Install the new version of `@ionic/core` by running `npm install` in the `angular` directory.
4. Build `@ionic/angular` by running `npm run build` in the `angular` directory.
5. Set the current working directory to `angular/dist`.
6. Run `npm publish` to publish the new version of `@ionic/angular`.
7. Commit the changes.
