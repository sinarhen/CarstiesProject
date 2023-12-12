using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper _mapper)
    {
        this._mapper = _mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.Write("--> Consuming auction updated: " + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);
        
        var result = await DB.Update<Item>()
            .Match(a => a.ID == context.Message.Id)
            .ModifyOnly(x => new
            {
                x.Color,
                x.Make,
                x.Model,
                x.Year,
                x.Mileage,
                x.ImageUrl
            }, item)
            .ExecuteAsync();

        if (!result.IsAcknowledged) 
            throw new MessageException(typeof(AuctionUpdated), "Problem updating mongodb");
    }
}