#!/bin/bash

ROOT=$(pwd)
QUARTZ=$ROOT/quartz
echo "ROOT: $ROOT"
echo "QUARTZ: $QUARTZ"

echo "clear old file"
rm -rf publish
rm -rf quartz

echo "cloning quartz"
git clone --depth 1 https://github.com/jackyzha0/quartz.git

echo "copy content to quartz"
rm -rf quartz/content
mkdir quartz/content
cp -r content/* quartz/content
if [ -d "content/.obsidian" ]; then
    cp -r content/.obsidian quartz/content/.obsidian
fi

echo "modify quartz config"
node ./scripts/replaceQuartzConfig.cjs

cd $QUARTZ

echo "installing dependencies and building quartz"
npm i 
npx quartz build

echo "move public to root folder"
mv public $ROOT 