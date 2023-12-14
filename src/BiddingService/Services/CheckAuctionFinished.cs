
using BiddingService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BiddingService.Services;

public class CheckAuctionFinished : BackgroundService
{
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _services;

    public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting Check for Auctions that are finished");
    
        stoppingToken.Register(() => _logger.LogInformation("Check for Auctions that are finished is stopping"));
    
        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuction(stoppingToken);

            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }

    private async Task CheckAuction(CancellationToken stoppingToken)
    {
        var finishedAuctions = await DB.Find<Auction>()
            .Match(a => a.AuctionEnd <= DateTime.UtcNow)
            .Match(a => !a.Finished)
            .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;

        _logger.LogInformation($"Found {finishedAuctions.Count} finished auctions", finishedAuctions.Count);
        
        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var item in finishedAuctions)
        {
            item.Finished = true;
            await item.SaveAsync(null, stoppingToken); 

            var winningBid = await DB.Find<Bid>()
                .Match(b => b.AuctionId == item.ID)
                .Match(b => b.BidStatus == BidStatus.Accepted)
                .Sort(b => b.Descending(s => s.Amount))
                .ExecuteFirstAsync(stoppingToken);
        
            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winningBid != null,
                AuctionId = item.ID,
                Winner = winningBid?.Bidder,
                Seller = item.Seller,
                Amount = winningBid?.Amount
            }, stoppingToken);
        }
    }
}
