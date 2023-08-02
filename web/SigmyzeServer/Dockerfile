FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY SigmyzeServer.csproj .
COPY . .

RUN dotnet restore
RUN dotnet publish -c release -o app

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /src/app .
CMD ["dotnet", "SigmyzeServer.dll"]