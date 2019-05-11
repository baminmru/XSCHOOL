using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace x_srv.Services.Data.User
{
    public class TokenInfo
    {
        public string access_token { get; set; }
        public long expires_in { get; set; }
        public string token_type { get; set; }
        public string refresh_token { get; set; }
    }
}
