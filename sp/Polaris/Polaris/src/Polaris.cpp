#include "Polaris/Polaris.h"

namespace Polaris
{
    PolarisGraphics::PolarisGraphics()
    {

    }

    PolarisGraphics::~PolarisGraphics()
    {

    }

    void PolarisGraphics::Init()
    {
        initWindow();

        createInstance();
        setupDebugMessenger();
        pickPhysicalDevice();
    }

    void PolarisGraphics::Run()
    {
        while(!glfwWindowShouldClose(window)) {
            glfwPollEvents();
        }
    }

    void DestroyDebugUtilsMessengerEXT(
        VkInstance instance,
        VkDebugUtilsMessengerEXT debugMessenger,
        const VkAllocationCallbacks* pAllocator
    )
    {
        auto func = (PFN_vkDestroyDebugUtilsMessengerEXT) vkGetInstanceProcAddr(instance, "vkDestroyDebugUtilsMessengerEXT");
        if(func != nullptr)
            func(instance, debugMessenger, pAllocator);
    }

    void PolarisGraphics::destroy()
    {
        if(enableValidationLayers)
            DestroyDebugUtilsMessengerEXT(instance, debugMessenger, nullptr);

        vkDestroyInstance(instance, nullptr);

        glfwDestroyWindow(window);
        glfwTerminate();
    }
}