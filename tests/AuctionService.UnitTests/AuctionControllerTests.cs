using AuctionService.Controllers;
using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.RequestHelpers;
using AutoFixture;
using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AuctionService.UnitTests;

public class AuctionControllerTests
{
    private readonly Mock<IAuctionRepository> _repo;
    private readonly Mock<IPublishEndpoint> _publishEndpoint;
    private readonly Fixture _fixture;
    private readonly AuctionsController _controller;
    private readonly IMapper _mapper;
    
    public AuctionControllerTests()
    {
        _repo = new Mock<IAuctionRepository>();
        _publishEndpoint = new Mock<IPublishEndpoint>();
        _fixture = new Fixture();

        var mockMapper = new MapperConfiguration(cfg => 
            cfg.AddMaps(typeof(MappingProfiles).Assembly)
        ).CreateMapper().ConfigurationProvider;    
    
        _mapper = new Mapper(mockMapper);
        _controller = new AuctionsController(_repo.Object, _mapper, _publishEndpoint.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext{User = Helpers.GetClaimsPrincipal()}
            }
        };
    }

    [Fact]
    public async Task GetAuctions_WithNoParams_Returns10Auctions()
    {
        // Arrange
        var auctions = _fixture.CreateMany<AuctionDto>(10).ToList();
        _repo.Setup(repo => repo.GetAuctionsAsync(null)).ReturnsAsync(auctions);

        // Act
        var result = await _controller.GetAll(null);

        // Assert
        Assert.Equal(10, result.Value.Count);
        Assert.IsType<ActionResult<List<AuctionDto>>>(result);
    }    
    
    [Fact]
    public async Task GetAuctionById_WithValidGuid_ReturnsAuction()
    {
        // Arrange
        var auction = _fixture.Create<AuctionDto>();
        _repo.Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>())).ReturnsAsync(auction);
        
        
        // Act
        var result = await _controller.GetAuctionById(auction.Id);

        // Assert
        Assert.Equal(auction.Make, result.Value.Make);
        Assert.IsType<ActionResult<AuctionDto>>(result);
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidGuid_ReturnsNotFound()
    {
        // Arrange
        _repo.Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(value: null);
        
        
        // Act
        var result = await _controller.GetAuctionById(Guid.NewGuid());

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }
    [Fact]
    public async Task CreateAuction_WithValidCreateAuctionDto_ReturnsCreatedAtAction()
    {
        // Arrange
        var auction = _fixture.Create<CreateAuctionDto>();

        _repo.Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);
        
        // Act
        var result = await _controller.CreateAuction(auction);
        var createdResult = result.Result as CreatedAtActionResult;


        // Assert
        Assert.NotNull(createdResult);
        Assert.Equal("GetAuctionById", createdResult.ActionName);
        Assert.IsType<AuctionDto>(createdResult.Value);
    }
    [Fact]
    public async Task CreateAuction_WithSaveChangesFalse_ReturnsBadRequest()
    {
        // Arrange 
        var auction = _fixture.Create<CreateAuctionDto>();
        _repo.Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(false);

        // Act 
        var result = await _controller.CreateAuction(auction);
        var createdResult = result.Result as BadRequestObjectResult;

        // Assert
        Assert.NotNull(createdResult);
        Assert.Equal(createdResult.StatusCode, 400);
        Assert.Null(result.Value);
        Assert.Equal(createdResult.Value, "Could not save changes to the DB");

    }
    [Fact]
    public async Task UpdateAuction_WithValidUpdateAuctionDto_ReturnsOk()
    {
        // Arrange 
        var auction = _fixture.Create<UpdateAuctionDto>();
        var auctionEntity = new Auction();
        auctionEntity.Seller = "test";
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

        // Act 
        var result = await _controller.UpdateAuction(Guid.NewGuid(), auction) as OkResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);

    }
    [Fact]
    public async Task UpdateAuction_WithFalseSaveChanges_ReturnsBadRequest()
    {
        // Arrange 
        var auction = _fixture.Create<UpdateAuctionDto>();
        var auctionEntity = new Auction();
        auctionEntity.Seller = "test";
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(false);

        // Act 
        var result = await _controller.UpdateAuction(Guid.NewGuid(), auction) as BadRequestObjectResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(400, result.StatusCode);
    

    }
    [Fact]
    public async Task UpdateAuction_WithUnauthorizedSellerNameInAuctionEntity_ReturnsForbid()
    {
        // Arrange 
        var auction = _fixture.Create<UpdateAuctionDto>();

        var auctionEntity = new Auction();
        auctionEntity.Seller = "i am the seller, promise me"; // Pretened to be someone else
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        // Act 
        var result = await _controller.UpdateAuction(Guid.NewGuid(), auction);
      
        // Assert
        Assert.NotNull(result);
        Assert.IsType<ForbidResult>(result);

    }
    
    [Fact]
    public async Task UpdateAuction_WithInvalidId_ReturnsNotFoun()
    {
        // Arrange 
        var auction = _fixture.Create<UpdateAuctionDto>();
    

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(value: null);


        // Act 
        var result = await _controller.UpdateAuction(Guid.NewGuid(), auction) as NotFoundResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(404, result.StatusCode);

    }    
    [Fact]
    public async Task DeleteAuction_WithValidDeleteAuctionDto_ReturnsOk()
    {
        // Arrange 
        var auctionEntity = new Auction();
        auctionEntity.Seller = "test";
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

        // Act 
        var result = await _controller.DeleteAuction(Guid.NewGuid()) as OkResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);

    }
    [Fact]
    public async Task DeleteAuction_WithFalseSaveChanges_ReturnsBadRequest()
    {
        // Arrange 
        var auctionEntity = new Auction();
        auctionEntity.Seller = "test";
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        _repo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(false);

        // Act 
        var result = await _controller.DeleteAuction(Guid.NewGuid()) as BadRequestObjectResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(400, result.StatusCode);
    

    }
    [Fact]
    public async Task DeleteAuction_WithUnauthorizedSellerNameInAuctionEntity_ReturnsForbid()
    {
        // Arrange 

        var auctionEntity = new Auction();
        auctionEntity.Seller = "i am the seller, promise me"; // Pretened to be someone else
        auctionEntity.Item = new Item();

        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(auctionEntity);

        // Act 
        var result = await _controller.DeleteAuction(Guid.NewGuid());
      
        // Assert
        Assert.NotNull(result);
        Assert.IsType<ForbidResult>(result);

    }
    
    [Fact]
    public async Task DeleteAuction_WithInvalidId_ReturnsNotFoun()
    {
        // Arrange 
        _repo.Setup(repo => repo.GetAuctionEntityById(It.IsAny<Guid>())).ReturnsAsync(value: null);


        // Act 
        var result = await _controller.DeleteAuction(Guid.NewGuid()) as NotFoundResult;
      
        // Assert
        Assert.NotNull(result);
        Assert.Equal(404, result.StatusCode);

    }
}
