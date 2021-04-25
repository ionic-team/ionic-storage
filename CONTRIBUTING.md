### Development and release

Temporary release process until #213 is done:

```
cd lib
npm run build
npm run release
cd ../angular
vim package.json #tick the version number manually
npm run build
cd dist
npm publish
```
