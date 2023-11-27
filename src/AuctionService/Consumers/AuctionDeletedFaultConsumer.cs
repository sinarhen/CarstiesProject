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
        
    }
}