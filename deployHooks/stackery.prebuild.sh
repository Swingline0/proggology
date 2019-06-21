#!/bin/bash

set -e
for dir in src/*; do
(
  (
    echo $dir
    cd $dir
    yarn
    yarn build
  )
) &
done
wait
