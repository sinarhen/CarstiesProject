# Microservices Udemy Course repository
I made this application for studying purposes, with course on Udemy which you can see [here](https://www.udemy.com/course/build-a-microservices-app-with-dotnet-and-nextjs-from-scratch/?couponCode=NEWCOURSEPROM) 

## Project architecture 
![image](https://github.com/sinarhen/CarstiesProject/assets/105736826/7e6f1b3f-d766-4b57-8797-ca99c3567211)

## Stack used
in this project used these technologies:

- .NET
- Identity Server 
- RabbitMq 
- Next.js
- Docker

## Client App
### Main page functionality 
features: 
- all auctions list 
- order by 
- filter by
- items per page(4, 8, 12)
- pagination
  
![mainpage-gif](https://github.com/sinarhen/CarstiesProject/assets/105736826/b517a5ba-2890-4069-86db-e34f547c634b)

### Updating functionality
features:
- form validation made with zod
- ability to upload images or paste url of them
- instant updating of data on client side without refreshing 

![details-edit-gif](https://github.com/sinarhen/CarstiesProject/assets/105736826/9e122f03-410a-4d20-9389-74072d5a6d0f)

### Bidding functionality
features: 
- list of all bids
- websockets for realtime communication with server(SignalR), which allows to instantly receive placed bids from other users 
- zod validation for amount of bid

![bidding-gif](https://github.com/sinarhen/CarstiesProject/assets/105736826/a04f787a-272e-40f6-8758-c60f69b67f4f)

### Creating Auction functionality
features:
- zod validation
- ability to upload images or paste url of them

![creating-gif](https://github.com/sinarhen/CarstiesProject/assets/105736826/640e9949-29ec-448b-a8b0-e91dce9a6bce)

## Services overview
### Auction Service
#### Works with a PostgreSQL database, Performs the functions of the main repository for all auctions
*src/AuctionService/Program.cs:*
```csharp
builder.Services.AddDbContext<AuctionDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
```
#### Responsible only for CRUD operations related to auctions directly.
https://github.com/sinarhen/CarstiesProject/blob/main/src/AuctionService/Controllers/AuctionsController.cs

#### Performs authentication and authorization using IdentityService.

*src/AuctionService/Program.cs:*
```csharp 
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });
```

*src/AuctionService/Controllers/AuctionsController.cs*:
```csharp
...
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Auction>> CreateAuction(CreateAuctionDto auctionDto)
...
```
#### Uses MassTransit.RabbitMq to transmit data about created, deleted, or updated auctions 

*src/AuctionService/Program.cs:*
```csharp
builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
    {
        o.QueryDelay = TimeSpan.FromSeconds(10);

        o.UsePostgres();
        o.UseBusOutbox();
    });
    x.AddConsumersFromNamespaceContaining<BidPlacedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });
        cfg.ConfigureEndpoints(context);
    });
});
```
*src/AuctionService/Controllers/AuctionsController.cs*:
```csharp
        ... 
        await _publishEndpoint.Publish(_mapper.Map<AuctionDeleted>(newAuction));
        ...
```

### Search Service
(will be added)

### Identity Service (external service)
(will be added)

### Bidding Service
(will be added)

### Notification Service
(will be added)

### Gateway service 
(will be added)

### Contracts (Shared models for sending and consuming messages from rabbit mq)
(will be added)

## Get started

You can run this app locally on your computer by following these instructions:

1. Using your terminal or command prompt clone the repo onto your machine in a user folder 

```
git clone https://github.com/sinarhen/CarstiesProject
```
2. Change into the Carsties directory
```
cd Carsties
```
3. Ensure you have Docker Desktop installed on your machine.  If not download and install from Docker and review their installation instructions for your Operating system [here](https://docs.docker.com/desktop/).
4. Build the services locally on your computer by running (NOTE: this may take several minutes to complete):
```
docker compose build
```
5. Once this completes you can use the following to run the services:
```
docker compose up -d
```
6. To see the app working you will need to provide it with an SSL certificate.   To do this please install 'mkcert' onto your computer which you can get from [here](https://github.com/FiloSottile/mkcert).  Once you have this you will need to install the local Certificate Authority by using:
```
mkcert -install
```
7. You will then need to create the certificate and key file on your computer to replace the certificates that I used.   You will need to change into the 'devcerts' directory and then run the following command:
```
cd devcerts
mkcert -key-file carsties-app.com.key -cert-file carsties-app.com.crt app.carsties-app.com api.carsties-app.com id.carsties-app.com
```
8.  You will also need to create an entry in your host file so you can reach the app by its domain name.   Please use this [guide](https://phoenixnap.com/kb/how-to-edit-hosts-file-in-windows-mac-or-linux) if you do not know how to do this.  Create the following entry:
```
127.0.0.1 id.carsties-app.com app.carsties-app.com api.carsties-app.com
```
9. You should now be able to browse to the app on https://app.carsties-app.com




