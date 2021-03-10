### Development and release

When you're ready to release a new version, run the following commands:

1.  npm version (patch|minor|major)
2.  npm run build
3.  commit and push: `git push origin master --tags`
4.  cd dist
5.  npm publish
