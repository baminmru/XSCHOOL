using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace x_srv.Services.Data.User
{
    public class DeleteUserProfileRequest
    {
        public Guid Id { get; set; }
    }
    public class DeleteUserProfileResponse
    {
        public string Status { get; set; }
    }
}
