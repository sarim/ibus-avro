ibus-avro v8+cpp branch
==

#### Nothing to see here, go away.

If you still insist read on:

Note: Everyting is compliled with llvm-clang now, mainly for faster compilation and my own mental satisfaction, if you 
experience crashes, edit the build*.sh files to switch back to gcc.

0. first download https://github.com/v8/v8/archive/3.18.1.tar.gz and extract it to `v8-3.18.1`
0. Run `build_v8.sh` to compile v8.
0. Run `build_avrov8.sh` to compile the v8-avro bindings. (Make sure you have the `avrov8` submodule fetched)
0. Finally run build.sh to compile the ibus engine.
0. With ibus daemon running, run `run.sh` to start the engine.
