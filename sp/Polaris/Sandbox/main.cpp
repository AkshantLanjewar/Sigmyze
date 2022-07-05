#include <iostream>
#include <Polaris/Polaris.h>

int main() 
{
    std::cout << "Hello" << std::endl;

    Polaris::PolarisGraphics _graphicsEngine;
    _graphicsEngine.Init();
    _graphicsEngine.Run();
}