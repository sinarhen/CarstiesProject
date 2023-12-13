using MassTransit;
using Contracts;
using BiddingService.Models;
using MongoDB.Entities;

namespace BiddingService.Consumers;


public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.Write("--> Consuming auction created: " + context.Message.Id);
        var auction = new Auction
        {
            ID = context.Message.Id.ToString(),
            AuctionEnd = context.Message.AuctionEnd,
            Seller = context.Message.Seller,
            ReservePrice = context.Message.ReservePrice,
        };

        await auction.SaveAsync();
    }
}