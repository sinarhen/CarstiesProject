using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionDeletedFaultConsumer : IConsumer<Fault<AuctionDeleted>>
{
    private readonly IMapper _mapper;

    public AuctionDeletedFaultConsumer(IMapper _mapper)
    {
        this._mapper = _mapper;
    }

    public async Task Consume(ConsumeContext<Fault<AuctionDeleted>> context)
    {
        // var message = context.Message;
        // var auction = _mapper.Map<Auction>(message.Message);

        // await context.Publish(new AuctionDeletedFaulted
        // {
        //     Auction = auction,
        //     Message = message.Exceptions.FirstOrDefault()?.Message
        // });
        await Task.CompletedTask;
    }
}