using Microsoft.EntityFrameworkCore;
using Visionsofme.Models;
namespace Visionsofme.Data;

public class FinanceDbContext : DbContext{
    public FinanceDbContext(DbContextOptions<FinanceDbContext> options) : base(options){}
    public DbSet<User> Users {get; set;}
    public DbSet<Transaction> Transactions {get; set;}
}