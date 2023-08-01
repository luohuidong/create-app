#!/bin/bash

git submodule update --init --recursive
git submodule update --remote

if [ -z "$(git status --short templates)" ]; then
  echo "The submodule has not been updated"
else
  echo "The submodule has been updated"

  git add templates/*
  git commit -m "Update templates"
  pnpm version patch
  git push

  pnpm install
  pnpm run build
  pnpm publish
fi
