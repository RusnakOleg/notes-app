ARG DOTNET_VERSION=10.0

FROM mcr.microsoft.com/dotnet/sdk:${DOTNET_VERSION} AS build
WORKDIR /src
COPY src/Notes.DAL/Notes.DAL.csproj src/Notes.DAL/
COPY src/Notes.BLL/Notes.BLL.csproj src/Notes.BLL/
COPY src/Notes.Api/Notes.Api.csproj src/Notes.Api/
RUN dotnet restore src/Notes.Api/Notes.Api.csproj
COPY src/ src/
RUN dotnet publish src/Notes.Api/Notes.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:${DOTNET_VERSION}
WORKDIR /app
COPY --from=build /app .
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "Notes.Api.dll"]