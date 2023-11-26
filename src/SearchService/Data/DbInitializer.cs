using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.Services;

namespace SearchService.Data;

public class DbInitializer
{
    public static async Task InitDb(WebApplication builder)
    {await DB.InitAsync("SearchDb", MongoClientSettings.FromConnectionString(
            builder.Configuration.GetConnectionString("MongoDbConnection")
        ));
    
        await DB.Index<Item>()
            .Key(x => x.Make, KeyType.Text)
            .Key(x => x.Model, KeyType.Text)
            .Key(x => x.Color, KeyType.Text)
            .CreateAsync();
    
        var count = await DB.CountAsync<Item>();

        using var scope = builder.Services.CreateScope();
        
        var httpClient = scope.ServiceProvider.GetRequiredService<AuctionServiceHttpClient>();
        
        var items = await httpClient.GetItemsForSearchDb();
   
        Console.WriteLine(items.Count + " returned from the auction services");
        if (items.Count > 0) await DB.SaveAsync(items);
    }

}