using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionDeletedConsumer : IConsumer<AuctionDeleted>
{
    private readonly IMapper _mapper;

    public AuctionDeletedConsumer(IMapper _mapper)
    {
        this._mapper = _mapper;
    }
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        Console.Write("--> Consuming auction deleted: " + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);
        
        await item.DeleteAsync();
    }
}