FROM mcr.microsoft.com/dotnet/sdk:8.0 AS test 
WORKDIR /test 

COPY . .
RUN dotnet restore 
RUN dotnet test

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

COPY ./SigmyzeServer/SigmyzeServer.csproj .
RUN dotnet restore
COPY ./SigmyzeServer .
RUN dotnet publish -c release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app .
CMD ["dotnet", "SigmyzeServer.dll"]