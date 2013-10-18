export CC=`which clang`
export CXX=`which clang++`
export GYP_DEFINES="clang=1"


AVROLIBS="platform utf8 suffixdict autocorrect avrodict levenshtein avrolib avroregexlib dbsearch gi suggestionbuilder"
#AVROLIBS="platform utf8"
cd avrov8/lib
> ../avrolibcombined.js
rm ../avrolib-*
echo global.avro = {} \; > ../../avrolibv8.js
for LIBNAME in $AVROLIBS
do
echo -n \; modulename = \"$LIBNAME\" \; > ../avrolib-$LIBNAME.js
cat $LIBNAME.js >> ../avrolib-$LIBNAME.js
native2ascii -encoding UTF-8 ../avrolib-$LIBNAME.js ../../avrolib-$LIBNAME.js
java -Xms1024m -Xmx1024m -jar ../../yui --nomunge --preserve-semi --disable-optimizations -o ../../avrolib-$LIBNAME.js.min ../../avrolib-$LIBNAME.js
python -c "import json; json.dump(open('../../avrolib-$LIBNAME.js.min').read(),open('../../avrolib-$LIBNAME.json','w'))"
echo -n \; global.avro.$LIBNAME = >> ../../avrolibv8.js
cat ../../avrolib-$LIBNAME.json >> ../../avrolibv8.js
echo \; >> ../../avrolibv8.js
echo global.$LIBNAME
done
rm ../../avrolib-*
cd ../..
cp v8.gyp v8-3.22.14/tools/gyp/v8.gyp
cd v8-3.22.14
make clean
#make dependencies


make native -j 4 library=shared werror=no snapshot=off i18nsupport=off 
mkdir -p ../libs/

if [ `uname -s` == "Darwin" ] ; then
    PRODUCT="out/native/libv8.dylib"
else
    PRODUCT="out/native/lib.target/libv8.so"
fi
cp $PRODUCT ../libs/


