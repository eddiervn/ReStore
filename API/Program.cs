using API.Data;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<StoreContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// CORRS
builder.Services.AddCors(options => {
    options.AddPolicy("CorsPolicy", policy => {
        policy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials() // for cookies over different domains
        .WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

//                                     migration and seeding
// --------------------------------------------------------------------------------------

var scope = app.Services.CreateAsyncScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try{
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch(Exception e){
   logger.LogError(e, "An error occurred during migration");
}

// --------------------------------------------------------------------------------------

app.Run();
