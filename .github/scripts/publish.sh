#!/bin/bash

git submodule update --init --recursive
git submodule update --remote

if [ -z "$(git status --short templates)" ]; then
  echo "The submodule has not been updated"
else
  echo "The submodule has been updated"

  git add templates/*
  git commit -m "Update templates"
  npm version patch
  git push

  npm install
  npm run build
  npm run publish
fi
