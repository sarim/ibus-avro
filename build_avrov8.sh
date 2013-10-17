V8_INCLUDE_DIR=../v8-3.22.14/include/
V8_LIB_DIR=../libs/
cd avrov8
clang++ -shared -fPIC -I $V8_INCLUDE_DIR -L $V8_LIB_DIR -lv8 skv8.cpp -o libskv8.so
cp libskv8.so ../libs/
