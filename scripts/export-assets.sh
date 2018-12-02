Aseprite.exe -b --split-layers ./assets/mockup.aseprite --trim --save-as "./assets/export-{layer}.png"
for f in $(ls -l ./assets/ | grep export | cut -d":" -f2 | cut -d" " -f2); do
    fn=$(echo $f | cut -d"-" -f2 | cut -d"." -f1)
    echo 'this.load.image("'$fn'", "/assets/'$f'");'
done