using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Visionsofme.Data;
using Visionsofme.Models;
using Visionsofme.Services;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<FinanceDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<FinanceService>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options => {
    options.LoginPath = "/login";
    options.LogoutPath = "/logout";
});
builder.Services.AddControllersWithViews();
builder.Services.AddHealthChecks();

var cultureInfo = new System.Globalization.CultureInfo("en-US");
System.Globalization.CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

var app = builder.Build();

using(var scope = app.Services.CreateScope()){
    var context = scope.ServiceProvider.GetRequiredService<FinanceDbContext>();
    
    context.Database.EnsureCreated();

    if(!context.Users.Any(u => u.Username == "demo1")){
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword("password123");

        context.Users.Add(new User{Username = "demo1", Password = hashedPassword});
        context.Users.Add(new User{Username = "demo2", Password = hashedPassword});
        context.Users.Add(new User{Username = "demo3", Password = hashedPassword});
        context.Users.Add(new User{Username = "demo4", Password = hashedPassword});
        context.SaveChanges();
    }
}

app.MapHealthChecks("/health");
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();