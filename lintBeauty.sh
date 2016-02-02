#!/bin/sh

eslint -c .eslintrc --fix app/

for f in $(find app/ -name '*.js'); do
  js-beautify -r -k -n -s 2 $f
done
