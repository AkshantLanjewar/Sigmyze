project(Sandbox)

set(CMAKE_CXX_STANDARD 17)

if(MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /std:c++17")
endif(MSVC)

add_executable(${PROJECT_NAME} main.cpp)
target_link_libraries(${PROJECT_NAME} polaris)