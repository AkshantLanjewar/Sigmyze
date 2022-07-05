project(Polaris)

set(CMAKE_CXX_STANDARD 17)

if(MSVC)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /std:c++17")
endif(MSVC)

add_library(${PROJECT_NAME} src/Polaris.cpp
                            src/window.cpp
                            src/device.cpp)
add_library(polaris ALIAS ${PROJECT_NAME})

target_link_directories(${PROJECT_NAME} PUBLIC ../lib/vulkan/lib)
target_include_directories(${PROJECT_NAME} PUBLIC ${PROJECT_SOURCE_DIR}/include ../lib/vulkan/include ../lib/glfw/include)
target_link_libraries(${PROJECT_NAME} glfw ${GLFW_LIBRARIES} vulkan-1.lib)