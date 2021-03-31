### Development and release

Temporary release process until #213 is done:

lerna run build
cd lib
npm run release
cd ../angular
npm run release
