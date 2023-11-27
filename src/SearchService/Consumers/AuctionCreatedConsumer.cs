using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;

    public AuctionCreatedConsumer(IMapper _mapper)
    {
        this._mapper = _mapper;
    }
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.Write("--> Consuming auction created: " + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);

        // if (item.Model == "Foo") throw new ArgumentException("Cannot sell cars with name of Foo");    
        
        await item.SaveAsync();
    }
}