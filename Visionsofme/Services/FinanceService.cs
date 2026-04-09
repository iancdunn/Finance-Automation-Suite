using Visionsofme.Data;
using Visionsofme.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Visionsofme.Services{
    public class FinanceService{

        private readonly FinanceDbContext _context;

        public FinanceService(FinanceDbContext context){
            _context = context;
        }

        public void UpdateSettings(User user, double? needsBal, double? savingsBal, double? wantsBal, 
                                        double? needsPct, double? savingsPct, double? wantsPct){
            if(needsBal.HasValue) user.NeedsBal = needsBal.Value;
            if(savingsBal.HasValue) user.SavingsBal = savingsBal.Value;
            if(wantsBal.HasValue) user.WantsBal = wantsBal.Value;
            if(needsPct.HasValue) user.NeedsPct = needsPct.Value;
            if(savingsPct.HasValue) user.SavingsPct = savingsPct.Value;
            if(wantsPct.HasValue) user.WantsPct = wantsPct.Value;

            if(user.NeedsBal < 0.0 || user.SavingsBal < 0.0 || user.WantsBal < 0.0){
                throw new ArgumentException("Balances must not be negative.");
            }

            if(user.NeedsPct < 0.0 || user.NeedsPct > 100.0 || user.SavingsPct < 0.0 || user.SavingsPct > 100.0 ||
                user.WantsPct < 0.0 || user.WantsPct > 100.0){
                throw new ArgumentException("Percentages must be between 0% and 100%.");
            }

            if(user.NeedsPct + user.SavingsPct + user.WantsPct != 100.0){
                throw new ArgumentException("Percentages must add up to 100%.");
            }

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void AddDeposit(User user, double amount){
            if(amount <= 0.0){
                throw new ArgumentException("Transaction amounts must be positive.");
            }

            double n = Math.Round(amount * user.NeedsPct / 100.0, 2, MidpointRounding.AwayFromZero);
            double s = Math.Round(amount * user.SavingsPct / 100.0, 2, MidpointRounding.AwayFromZero);
            double w = amount - n - s;

            user.NeedsBal += n;
            user.SavingsBal += s;
            user.WantsBal += w;

            var tx = new Transaction(user.Id, "Deposit", "", amount);

            _context.Users.Update(user);
            _context.Transactions.Add(tx);
            _context.SaveChanges();
        }

        public void AddWithdrawal(User user, string category, double amount){
            if(amount <= 0.0){
                throw new ArgumentException("Transaction amounts must be positive.");
            }

            if(category == "Needs") user.NeedsBal -= amount;
            else if(category == "Savings") user.SavingsBal -= amount;
            else if(category == "Wants") user.WantsBal -= amount;

            var tx = new Transaction(user.Id, "Withdrawal", category, amount);

            _context.Users.Update(user);
            _context.Transactions.Add(tx);
            _context.SaveChanges();
        }

        public void DeleteTransaction(int txId, User user){
            var tx = _context.Transactions.Find(txId);
            if(tx == null){
                throw new Exception("Transaction not found.");
            }

            if(tx.UserId != user.Id){
                throw new Exception("Unauthorized delete attempt.");
            }

            if(tx.Type == "Deposit"){
                double n = Math.Round(tx.Amount * user.NeedsPct / 100.0, 2, MidpointRounding.AwayFromZero);
                double s = Math.Round(tx.Amount * user.SavingsPct / 100.0, 2, MidpointRounding.AwayFromZero);
                double w = tx.Amount - n - s;

                user.NeedsBal -= n;
                user.SavingsBal -= s;
                user.WantsBal -= w;
            }
            else if(tx.Type == "Withdrawal"){
                if(tx.Category == "Needs"){
                    user.NeedsBal += tx.Amount;
                }
                else if(tx.Category == "Savings"){
                    user.SavingsBal += tx.Amount;
                }
                else if(tx.Category == "Wants"){
                    user.WantsBal += tx.Amount;
                }
            }

            _context.Users.Update(user);
            _context.Transactions.Remove(tx);
            _context.SaveChanges();
        }

        public void ResetData(User user){
            var transactions = _context.Transactions.Where(t => t.UserId == user.Id);
            _context.Transactions.RemoveRange(transactions);

            user.NeedsBal = 0.0;
            user.SavingsBal = 0.0;
            user.WantsBal = 0.0;
            user.NeedsPct = 50.0;
            user.SavingsPct = 30.0;
            user.WantsPct = 20.0;

            _context.Users.Update(user);
            _context.SaveChanges();
        }
    }
}