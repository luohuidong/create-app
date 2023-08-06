#!/bin/bash

if [ ! -d "tmp" ]; then
  mkdir tmp
else
  rm -rf tmp
  mkdir tmp
fi

cd templates

for dir in $(ls); do
  echo $dir
  tar -czf ../tmp/$dir.tar.gz $dir
done
