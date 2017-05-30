#!/bin/bash

ARG_DEFS=(
  #"--version-name=(.*)"
)

echo "##### "
echo "##### docs/deploy.sh"
echo "#####"

function init {
  cd ..
  SITE_PATH=$(readJsonProp "config.json" "sitePath")
  SITE_DIR=$SITE_PATH
  DOCS_DEST=$(readJsonProp "config.json" "docsDest")
}

function run {
  cd ..
  VERSION=$(readJsonProp "package.json" "version")

  # process new docs
  if [ -d "$DOCS_DEST" ]; then
    rm -R $DOCS_DEST
  fi
  ./node_modules/.bin/gulp docs

  # CD in to the site dir to commit updated docs
  cd $SITE_DIR

  CHANGES=$(git status --porcelain)

  # if no changes, don't commit
  if [[ "$CHANGES" == "" ]]; then
    echo "-- No changes detected for the following commit, docs not updated."
    echo "https://github.com/ionic-team/$CIRCLE_PROJECT_REPONAME/commit/$CIRCLE_SHA1"
  else
    git config --global user.email "hi@ionicframework.com"
    git config --global user.name "Ionitron"

    git add -A
    git commit -am "Automated build of ionic-storage v$VERSION ionic-team/$CIRCLE_PROJECT_REPONAME@$CIRCLE_SHA1"
    # in case a different commit was pushed to ionic-site during doc/demo gen,
    # try to rebase around it before pushing
    git fetch
    git rebase

    git push origin master

    echo "-- Updated docs for $VERSION_NAME succesfully!"
  fi

}

source $(dirname $0)/../utils.sh.inc
