FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /App

COPY web/SigmyzeServer ./

RUN dotnet restore
RUN dotnet publish -c Release -o build

#runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /App

COPY --from=build-env /App/build .
ENTRYPOINT ["dotnet", "SigmyzeServer.dll"]