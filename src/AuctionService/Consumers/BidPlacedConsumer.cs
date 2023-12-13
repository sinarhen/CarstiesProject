using AuctionService.Data;
using Contracts;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private readonly AuctionDbContext _db;

    public BidPlacedConsumer(AuctionDbContext db)
    {
        _db = db;
    }
    
    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming bid placed");
        
        var auction = await _db.Auctions.FirstOrDefaultAsync(x => x.Id.ToString() == context.Message.AuctionId);
        if (auction.CurrentHighBid == null
            || context.Message.BidStatus.Contains("Accepted")
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await _db.SaveChangesAsync();
        }
    }
}