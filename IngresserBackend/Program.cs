using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Ingresser API",
        Description = "API do Ingresser para fazer envios ao Frete"
    });

    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "api";

    var swaggerEndpoint = app.Environment.IsDevelopment() ? "/swagger/v1/swagger.json" :
    "./swagger/v1/swagger.json";

    options.SwaggerEndpoint(swaggerEndpoint, "v1");
});

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors(option => option.AllowAnyOrigin().AllowAnyHeader());

app.UseAuthorization();

app.MapControllers();

app.Run();
