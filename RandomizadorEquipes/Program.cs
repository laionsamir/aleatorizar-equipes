using RandomizadorEquipes.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<SorteioService>();

// Configuracao do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

app.UseHttpsRedirection();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();
