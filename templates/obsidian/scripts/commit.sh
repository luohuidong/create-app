#!/bin/bash

git add .
MESSAGE=$(LANG=en_US date +"%b %d, %Y, %I:%M %p")
git commit -m "$MESSAGE"
git push
