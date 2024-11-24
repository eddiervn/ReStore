using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            
            Thread.Sleep(1000);
            _tokenService = tokenService;
            _userManager = userManager;
            _context = context;
        }

         // ----------------------------------------------------------------------------

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if(user==null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket(model.Username);
            var anonymousBasket = await RetrieveBasket(Request.Cookies[Basket.BUYER_ID]);

            if(anonymousBasket!= null)
            {
                // transfer the anonymous basket to the user baskdt
                if(userBasket!=null)  _context.Baskets.Remove(userBasket);
                anonymousBasket.BuyerId = user.UserName;
                Response.Cookies.Delete(Basket.BUYER_ID);
                await _context.SaveChangesAsync();
            }

            return Ok(new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = (anonymousBasket ?? userBasket)?.MapBasketDto()
            });
        }

         // ----------------------------------------------------------------------------

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto model)
        {
           var user = new User{UserName = model.Username, Email = model.Email };
           var result = await _userManager.CreateAsync(user, model.Password);
           if(!result.Succeeded)
           {
               foreach(var error in result.Errors)
                    ModelState.AddModelError(error.Code, error.Description);
               return ValidationProblem();
           }

           await _userManager.AddToRoleAsync(user, "Member");
           return StatusCode(201);
        }

        // ----------------------------------------------------------------------------

        [Authorize]
        [HttpGet("current-user")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);
            return Ok(new UserDto{
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketDto()
            });
        }

        // ----------------------------------------------------------------------------

         private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete(Basket.BUYER_ID );
                return null;
            }

            return await _context.Baskets
            .Include(x => x.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}