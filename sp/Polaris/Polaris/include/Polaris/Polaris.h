#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>

#include <iostream>
#include <stdexcept>
#include <cstdlib>
#include <vector>

namespace Polaris
{
    class PolarisGraphics
    {
    public:
        PolarisGraphics();
        ~PolarisGraphics();

        void Init();
        void Run();

    //window functions
    private:
        void initWindow();
        GLFWwindow* window = nullptr;

    //device functions
    private:
        //instance
        void createInstance();
        VkInstance instance;

        //validation layers
        const std::vector<const char*> validationLayers = {
            "VK_LAYER_KHRONOS_validation"
        };

        #ifdef NDEBUG
            const bool enableValidationLayers = false;
        #else
            const bool enableValidationLayers = true;
        #endif

        bool checkValidationLayerSupport();
        std::vector<const char*> getRequiredExtensions();

        VkDebugUtilsMessengerEXT debugMessenger;
        void setupDebugMessenger();
        void populateDebugMessengerCreateInfo(VkDebugUtilsMessengerCreateInfoEXT& createInfo);

        //device
        void pickPhysicalDevice();
        bool isDeviceSuitable(VkPhysicalDevice device);
        VkPhysicalDevice physicalDevice = VK_NULL_HANDLE;

    private:
        void destroy();
    };
}