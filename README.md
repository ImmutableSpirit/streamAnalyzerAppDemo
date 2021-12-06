# StreamAnalyzerApp

This application was written in ASP.NET Core and ReactJS using Visual Studio Code.

After downloading the repository, type `dotnet run` in the terminal at the project root.  The application should be running on https://localhost:5001/.  <span style="color:blue;">You may also need to run `npm install` in the ClientApp directory where the ReactJS application resides.</span>

When you see the homepage, additional instructions are provided for interacting with the application.

For a smooth experience, I've made it simple to update the bearer token if you choose to.
The field is `twitterBearerToken` in appsettings.json. <span style="color:gray;"> Ordinarily I would store this as an environment variable or use a cloud-based vault.</span>
