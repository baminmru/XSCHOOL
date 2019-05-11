using x_srv.Services.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace x_srv.Services.Users.Data
{
    public class UpdateUserProfileRequest : BaseRequest
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public string Phone { get; set; }
    }

    public class UpdateUserProfileResponse
    {
        public string Status { get; set; }
    }
}
