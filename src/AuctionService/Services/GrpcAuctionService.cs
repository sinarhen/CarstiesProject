using AuctionService.Data;
using Grpc.Core;

namespace AuctionService;

public class GrpcAuctionsService : GrpcAuctions.GrpcAuctionsBase
{

    private readonly AuctionDbContext _context;
    
    public GrpcAuctionsService(AuctionDbContext context)
    {
        _context = context;
    }

    public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, 
        ServerCallContext context
    )
    {
        Console.WriteLine("==> Received grpc request for auction");

        var auction = await _context.Auctions.FindAsync(Guid.Parse(request.Id)) ?? throw new RpcException(new Status(StatusCode.NotFound, "Auction not found"));
        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel{
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller,
            }
        };

        

        return response; 
    }
}

