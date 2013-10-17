ibus-avro v8+cpp branch
==

#### Nothing to see here, go away.

If you still insist read on:

Note: Everyting is compliled with llvm-clang now, mainly for faster compilation and my own mental satisfaction, if you 
experience crashes, edit the build*.sh files to switch back to gcc.

0. first download https://github.com/v8/v8/archive/v8-3.22.14.tar.gz and extract it to `v8-3.22.14`
0. fetch submodule. Or manually clone v8builtin branch of avrov8 in ./avrov8
0. Run `build_lib.sh` to compile avro library included.
0. Run `build_avrov8.sh` to compile the v8-avro bindings.
0. Finally run build.sh to compile the ibus engine.
0. With ibus daemon running, run `run.sh` to start the engine.
