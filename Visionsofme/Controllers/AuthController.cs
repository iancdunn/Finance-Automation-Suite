using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Visionsofme.Data;
using Visionsofme.Models;
namespace Visionsofme.Controllers;

public class AuthController : Controller{

    private readonly FinanceDbContext _context;

    public AuthController(FinanceDbContext context){
        _context = context;
    }

    [HttpGet("/signup")]
    public IActionResult Signup(){
        return View();
    }

    [HttpPost("/signup")]
    public IActionResult Signup(string username, string password){
        if(_context.Users.Any(u => u.Username == username)){
            TempData["error"] = "Username already exists.";
            return RedirectToAction("Signup");
        }

        var newUser = new User{
            Username = username,
            Password = BCrypt.Net.BCrypt.HashPassword(password)
        };

        _context.Users.Add(newUser);
        _context.SaveChanges();

        return RedirectToAction("Login");
    }

    [HttpGet("/login")]
    public IActionResult Login(){
        return View();
    }

    [HttpPost("/login")]
    public async Task<IActionResult> Login(string username, string password){
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        
        if(user != null && BCrypt.Net.BCrypt.Verify(password, user.Password)){
            var claims = new List<Claim>{new Claim(ClaimTypes.Name, user.Username)};
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return RedirectToAction("Index", "Home");
        }

        TempData["error"] = "Invalid username or password.";
        
        return View();
    }

    [HttpGet("/logout")]
    public async Task<IActionResult> Logout(){
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction("Login");
    }
}