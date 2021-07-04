#!/bin/zsh

rm ./dist/*

cp "./src/caldom.js" "./dist/caldom.js"

sed "s/.*export default/export default/" "./dist/caldom.js" >> "./dist/caldom.mjs.js"

npx uglifyjs "./dist/caldom.js" --mangle --mangle-props "keep_quoted" --toplevel --compress --source-map --output "./dist/caldom.min.js"
npx uglifyjs "./dist/caldom.mjs.js" --mangle --mangle-props "keep_quoted" --toplevel --compress --source-map --output "./dist/caldom.min.mjs.js"

echo "Uglified Size:"
wc -c "./dist/caldom.min.js"

echo "GZiped Size:"
gzip < "./dist/caldom.min.js" > "./dist/caldom.min.js.gz"
wc -c "./dist/caldom.min.js.gz"

rm "./dist/caldom.min.js.gz"

# uglifyjs "./dist/caldom.min.js" --beautify --output "./dist/caldom.min.beautiful.js" 