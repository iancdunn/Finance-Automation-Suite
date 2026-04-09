using System.ComponentModel.DataAnnotations;
namespace Visionsofme.Models;

public class User{
    [Key]
    public int Id {get; set;}
    [Required]
    public string Username {get; set;} = string.Empty;
    [Required]
    public string Password {get; set;} = string.Empty;

    public double NeedsBal {get; set;} = 0.0;
    public double SavingsBal {get; set;} = 0.0;
    public double WantsBal {get; set;} = 0.0;
    public double NeedsPct {get; set;} = 50.0;
    public double SavingsPct {get; set;} = 30.0;
    public double WantsPct {get; set;} = 20.0;

    public ICollection<Transaction> Transactions {get; set;} = new List<Transaction>();
}