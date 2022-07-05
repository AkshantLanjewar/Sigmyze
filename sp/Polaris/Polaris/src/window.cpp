#include "Polaris/Polaris.h"

namespace Polaris
{
    void PolarisGraphics::initWindow()
    {
        glfwInit();
        glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
        glfwWindowHint(GLFW_RESIZABLE, GLFW_FALSE);

        window = glfwCreateWindow(800, 600, "Polaris Graphics", nullptr, nullptr);
    }
}