using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context){
            try{
                await _next(context);
            }
            catch(Exception e){
               _logger.LogError(e, e.Message);
               context.Response.ContentType = "application/json";
               context.Response.StatusCode = 500;

               var response = new ProblemDetails{
                    Status = 500,
                    Title = _env.IsDevelopment()? e.Message : "Server Error",
                    Detail = _env.IsDevelopment() ? e.StackTrace?.ToString() : null
               };

               var json = JsonSerializer.Serialize(response, new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase});

               await context.Response.WriteAsync(json);
            }
        }
    }
}