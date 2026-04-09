FROM mcr.microsoft.com/dotnet/sdk:10.0 AS development
WORKDIR /src

COPY . .

WORKDIR /src/Visionsofme

EXPOSE 8080

ENTRYPOINT ["dotnet", "run", "--no-launch-profile"]