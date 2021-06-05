#!/bin/zsh

if [ -z $1 ]; then
    echo 'Please provide the library version. Eg: npm run build "1.0.5"'
    echo 'npm run build "1.0.5" ".mjs" to generate ES6 module' 
    exit 1
fi

extension="$2"
es_six=""

if [ -z "$extension" ]; then
    extension=".js"
else
    es_six="export default "
fi

npx uglifyjs <<< $es_six <<< $(cat "./src/$1/caldom_$1.js") --mangle --mangle-props "keep_quoted" --toplevel --compress --output "./dist/caldom-$1.min$extension"

echo "Uglified Size:"
wc -c "./dist/caldom-$1.min$extension"

echo "GZiped Size:"
gzip < "./dist/caldom-$1.min$extension" > "./dist/caldom-$1.min$extension.gz"
wc -c "./dist/caldom-$1.min$extension.gz"

rm "./dist/caldom-$1.min$extension.gz"

#uglifyjs --beautify --output "./dist/caldom-$1.min.beautiful$extension" "./dist/caldom-$1.min$extension"