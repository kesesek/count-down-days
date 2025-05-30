using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CountdownApi.Controllers
{
    [ApiController]
    // Route: api/userprofile
    [Route("api/[controller]")]
    public class UserProfileController : ControllerBase
    {
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetUserProfile()
        {
            var userId = User.Identity?.Name;
            return Ok(new { message = "Welcome!", userId });
        }
    }
}