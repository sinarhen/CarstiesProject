using AuctionService;
using BiddingService.Models;
using Grpc.Net.Client;

namespace BiddingService;

public class GrpcAuctionClient
{
    private readonly ILogger<GrpcAuctionClient> _logger;
    private readonly IConfiguration _config;

    public GrpcAuctionClient(ILogger<GrpcAuctionClient> _logger, IConfiguration config)
    {
        this._logger = _logger;
        this._config = config;
    }

    public Auction GetAuction(string id)
    {
        _logger.LogInformation("==> Calling GRPC Service");
        var channel = GrpcChannel.ForAddress(_config["GrpcAuction"]);
        var client = new GrpcAuctions.GrpcAuctionsClient(channel);
        var request = new GetAuctionRequest
        {
            Id = id
        };

        try
        {
            var reply = client.GetAuction(request);
            var auction = new Auction
            {
                ID = reply.Auction.Id,
                AuctionEnd = DateTime.Parse(reply.Auction.AuctionEnd),
                ReservePrice = reply.Auction.ReservePrice,
                Seller = reply.Auction.Seller
            };
            return auction;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Could not call grpc server");
            return null;
        }
    }


}
