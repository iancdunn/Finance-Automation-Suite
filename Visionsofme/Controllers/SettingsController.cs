using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Visionsofme.Data;
using Visionsofme.Models;
using Visionsofme.Services;
namespace Visionsofme.Controllers;

[Authorize]
public class SettingsController : Controller{
    
    private readonly FinanceDbContext _context;
    private readonly FinanceService _financeService;

    public SettingsController(FinanceDbContext context, FinanceService financeService){
        _context = context;
        _financeService = financeService;
    }

    private async Task<User> GetCurrUser(){
        var username = User.Identity?.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);

        return user ?? throw new Exception("User not found.");
    }

    [HttpPost("/update_settings")]
    public async Task<IActionResult> UpdateSettings(double? needsBal, double? savingsBal, double? wantsBal, 
                                                        double? needsPct, double? savingsPct, double? wantsPct){
        try{
            var user = await GetCurrUser();
            _financeService.UpdateSettings(user, needsBal, savingsBal, wantsBal, needsPct, savingsPct, 
                                            wantsPct);
            TempData["message"] = "Successfully updated settings.";
        }
        catch(ArgumentException e){
            TempData["error"] = e.Message;
        }

        return RedirectToAction("Index", "Home");
    }

    [HttpPost("/reset_data")]
    [IgnoreAntiforgeryToken]
    public async Task<IActionResult> ResetData(){
        var user = await GetCurrUser();
        _financeService.ResetData(user);
        
        return RedirectToAction("Index", "Home");
    }
}