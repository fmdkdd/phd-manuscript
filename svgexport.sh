#!/bin/bash

# Batch export of SVG objects to PDF using Inkscape.  SVG objects to be exported
# must match the regexp '^export:(FILENAME)', and FILENAME.pdf will be created
# under the OUTPUT directory.

if [[ $# -ne 3 ]]; then
    echo 'Usage: svgexport png|svg|pdf SVG OUTPUT_DIRECTORY'
    exit 1
fi

TYPE=$1
SVG=$2
OUTPUT=$3

# Get IDs of objects matching '^export:' regexp
filenames=`inkscape --query-all ${SVG} \
           | grep '^export:' \
           | cut --delimiter ',' --fields 1 \
           | cut --delimiter ':' --fields 2`

# echo 'Export object ids:' ${to_export}

# Export each of them to PDF in OUTPUT folder with the specified filename
# for id in $to_export; do
#     filename=`echo ${id} | cut --delimiter ':' --fields 2`
#     echo $filename
#     inkscape --without-gui --file ${SVG}\
#              --export-id=${id}\
#              --export-pdf=${OUTPUT}/${filename}.pdf\
#              --export-area-drawing\
#              --export-margin=2
# done

# Above takes 7 seconds on my test SVG file
# Export using GNU parallel: 4 seconds
# filenames=`echo ${to_export} | cut --delimiter ':' --fields 2`

case $TYPE in
    pdf) parallel inkscape --without-gui \
                           --file ${SVG} \
                           --export-id='export:{}' \
                           --export-id-only \
                           --export-pdf=${OUTPUT}/{}.pdf \
                           --export-area-drawing \
                           --export-margin=2 ::: ${filenames}
         ;;

    png) parallel inkscape --without-gui \
                           --file ${SVG} \
                           --export-id='export:{}' \
                           --export-id-only \
                           --export-png=${OUTPUT}/{}.png \
                           --export-area-snap \
                           --export-area-drawing ::: ${filenames}
         ;;

    svg) parallel inkscape --without-gui \
                           --file ${SVG} \
                           --export-id='export:{}' \
                           --export-id-only \
                           --export-plain-svg=${OUTPUT}/{}.svg ::: ${filenames};
         # Cannot export-area-drawing for SVG, so we have to call the GUI and
         # puppet it with the --verb options.  For each exported SVG.
         for file in $filenames; do
             echo "Resizing file ${OUTPUT}/${file}.svg"
             inkscape --file ${OUTPUT}/${file}.svg --select "export:${file}" \
                      --verb FitCanvasToSelection \
                      --verb FileSave --verb FileQuit
         done
         ;;

esac
