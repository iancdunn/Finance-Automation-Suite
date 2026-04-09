namespace Visionsofme.Models;

public class Dashboard{
    public User User {get; set;} = new();
    public List<Transaction> Transactions {get; set;} = new();
}