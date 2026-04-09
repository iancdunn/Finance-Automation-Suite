using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Visionsofme.Data;
using Visionsofme.Models;
using Visionsofme.Services;
namespace Visionsofme.Controllers;

[Authorize]
public class TransactionController : Controller{
    
    private readonly FinanceDbContext _context;
    private readonly FinanceService _financeService;

    public TransactionController(FinanceDbContext context, FinanceService financeService){
        _context = context;
        _financeService = financeService;
    }

    private async Task<User> GetCurrUser(){
        var username = User.Identity?.Name;
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        
        return user ?? throw new Exception("User not found.");
    }

    [HttpPost("/add_transaction")]
    public async Task<IActionResult> AddTransaction(string type, string category, double amount){
        try{
            var user = await GetCurrUser();

            if(type == "Deposit"){
                _financeService.AddDeposit(user, amount);
            }
            else if(type == "Withdrawal"){
                _financeService.AddWithdrawal(user, category, amount);
            }
        }
        catch(ArgumentException e){
            TempData["error"] = e.Message;
        }

        return RedirectToAction("Index", "Home");
    }

    [HttpGet("/delete_transaction/{id}")]
    public async Task<IActionResult> DeleteTransaction(int id){
        var user = await GetCurrUser();
        _financeService.DeleteTransaction(id, user);

        return RedirectToAction("Index", "Home");
    }
}