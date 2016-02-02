#!/bin/bash

# Batch export of SVG objects to PDF using Inkscape.  SVG objects to be exported
# must match the regexp '^export:(FILENAME)', and FILENAME.pdf will be created
# under the OUTPUT directory.

if [[ $# -ne 2 ]]; then
    echo 'Usage: svgexport SVG OUTPUT_DIRECTORY'
    exit 1
fi

SVG=$1
OUTPUT=$2

# Get IDs of objects matching '^export:' regexp
to_export=`inkscape --query-all ${SVG}\
           | grep '^export:'\
           | cut --delimiter ',' --fields 1`

echo $to_export

# Export each of them to PDF in OUTPUT folder with the specified filename
for id in $to_export; do
    filename=`echo ${id} | cut --delimiter ':' --fields 2`
    echo $filename
    inkscape --without-gui --file ${SVG}\
             --export-id=${id}\
             --export-pdf=${OUTPUT}/${filename}.pdf\
             --export-area-drawing\
             --export-margin=2
done
