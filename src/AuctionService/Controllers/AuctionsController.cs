using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers;


[ApiController]
[Route("api/auctions")]
public class AuctionsController : ControllerBase
{
    private readonly IAuctionRepository _repo;
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;
    public AuctionsController(IAuctionRepository repo, IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _repo = repo;
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [HttpGet]
    public async Task<ActionResult<List<AuctionDto>>> GetAll(string date)
    {
        return await _repo.GetAuctionsAsync(date);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
    {
        var auction = await _repo.GetAuctionByIdAsync(id);          
        
        if (auction == null)
        {
            return NotFound();
        }

        return auction;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Auction>> CreateAuction(CreateAuctionDto auctionDto)
    {
        var auction = _mapper.Map<Auction>(auctionDto);
        
        // TODO 
        auction.Seller = User.Identity.Name;
        
        _repo.AddAuction(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

        var result = await _repo.SaveChangesAsync();
        
        if (!result) return BadRequest("Could not save changes to the DB");
         
        
        return CreatedAtAction(
            nameof(GetAuctionById),
            new {auction.Id},
            _mapper.Map<AuctionDto>(auction));
    }
    
    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAuction(Guid id, UpdateAuctionDto auctionDto)
    {
        var auction = await _repo.GetAuctionEntityById(id);

        if (auction == null) return NotFound();
        
        // TODO: check seller == username 
        if (auction.Seller != User.Identity.Name) return Forbid();
        
        auction.Item.Make = auctionDto.Make ?? auction.Item.Make;
        auction.Item.Model = auctionDto.Model ?? auction.Item.Model;
        auction.Item.Color = auctionDto.Color ?? auction.Item.Color;
        auction.Item.Mileage = auctionDto.Mileage ?? auction.Item.Mileage;
        auction.Item.Year = auctionDto.Year ?? auction.Item.Year;
        auction.Item.ImageUrl = auctionDto.ImageUrl ?? auction.Item.ImageUrl;

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionUpdated>(newAuction));

        var result = await _repo.SaveChangesAsync();

        if (result) return Ok();
        return BadRequest("Problem saving changes");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAuction(Guid id)
    {
        var auction = await _repo.GetAuctionEntityById(id);

        if (auction == null) return NotFound();
        
        if (auction.Seller != User.Identity.Name) return Forbid();
        
        _repo.RemoveAuction(auction);

        var newAuction = _mapper.Map<AuctionDto>(auction);

        await _publishEndpoint.Publish(_mapper.Map<AuctionDeleted>(newAuction));
            
        var result = await _repo.SaveChangesAsync(); 
        if (!result) return BadRequest("Could not update DB.");
        return Ok();

    }
}