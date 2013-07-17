export CC=`which clang`
export CXX=`which clang++`
export GYP_DEFINES="clang=1"


AVROLIBS="platform utf8 suffixdict autocorrect avrodict levenshtein avrolib avroregexlib dbsearch gi suggestionbuilder"

cd avrov8/lib
> ../avrolibcombined.js
for LIBNAME in $AVROLIBS
do
echo \; modulename = \"$LIBNAME\" \; >> ../avrolibcombined.js
cat $LIBNAME.js >> ../avrolibcombined.js
done
cd ..
native2ascii avrolibcombined.js ../avrolibv8.js
cd ..

cd v8-3.18.1
make dependencies


make native -j 4 library=shared werror=no
cp out/native/lib.target/libv8.so ../libs/


