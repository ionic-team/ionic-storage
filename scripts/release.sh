set -e
cd lib
npm run build
npm run release
cd ../angular
vim package.json
npm run build
cd dist
npm publish --tag next
