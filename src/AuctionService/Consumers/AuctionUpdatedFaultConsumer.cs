using Contracts;
using MassTransit;

namespace AuctionService.Consumers;

public class AuctionUpdatedFaultConsumer : IConsumer<Fault<AuctionUpdated>>
{
    public async Task Consume(ConsumeContext<Fault<AuctionUpdated>> context)
    {
        Console.WriteLine("--> Consuming faulty creation");

        var exception = context.Message.Exceptions.First();

        await context.Publish(context.Message.Message);

        if (!String.IsNullOrEmpty(exception.Message))
        {
            context.Message.Message.Model = $"{context.Message.Message.Model}(Updated)";
            await context.Publish(context.Message.Message);
        }
            
    }

}