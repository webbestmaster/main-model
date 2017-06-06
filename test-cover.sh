#!/usr/bin/env bash

reportsFolder=reports-cover

clear

istanbul cover --root ./ --dir $reportsFolder _mocha ./test/**/*.js

unamestr=`uname`
reportPath="$reportsFolder/lcov-report/index.html"
if [[ "$unamestr" == 'Darwin' ]]; then # detect MacOS
   open $reportPath
elif [[ "$unamestr" == 'Linux' ]]; then # detect Linux
   xdg-open $reportPath
fi
