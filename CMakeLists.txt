cmake_minimum_required(VERSION 3.10)
project(KnouxPlayerX)

set(CMAKE_CXX_STANDARD 17)

include_directories(src)

add_executable(knoux_core 
    main.cpp
    src/core/engine/media_engine.cpp
    src/core/system/logging.cpp
)
