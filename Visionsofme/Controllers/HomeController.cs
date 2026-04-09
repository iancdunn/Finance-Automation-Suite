using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Visionsofme.Data;
using Visionsofme.Models;
namespace Visionsofme.Controllers;

[Authorize]
public class HomeController : Controller{

    private readonly FinanceDbContext _context;

    public HomeController(FinanceDbContext context){
        _context = context;
    }

    [HttpGet("/")]
    public async Task<IActionResult> Index(){
        var username = User.Identity?.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

        if(user == null) return RedirectToAction("Login", "Auth");

        ViewBag.User = user;
        ViewBag.Transactions = await _context.Transactions.Where(t => t.UserId == user.Id).OrderByDescending(t => t.Date)
                                .ToListAsync();
        
        return View();
    }
}