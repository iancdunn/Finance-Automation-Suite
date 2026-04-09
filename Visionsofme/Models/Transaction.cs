using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Visionsofme.Models;

public class Transaction{
    [Key]
    public int Id {get; set;}
    [Required]
    public int UserId {get; set;}
    public string Type {get; set;}
    public string Category {get; set;}
    public double Amount {get; set;}
    public DateTime Date {get; set;} = DateTime.UtcNow;

    public Transaction(int userId, string type, string category, double amount){
        UserId = userId;
        Type = type;
        Category = category;
        Amount = amount;
    }
}