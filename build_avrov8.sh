V8_INCLUDE_DIR=../v8-3.18.1/include/
V8_LIB_DIR=../v8-3.18.1/out/native/lib.target/
cd avrov8
clang++ -shared -I $V8_INCLUDE_DIR -L $V8_LIB_DIR -lv8 skv8.cpp -o libskv8.so
cp libskv8.so ../libs/