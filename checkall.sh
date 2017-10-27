#!/bin/bash

# vérifie que tout fonctionne
for d in *
do
    if test -f "$d/main.html"
    then
        pushd "$d"
        firefox main.html
        popd
    fi
done

