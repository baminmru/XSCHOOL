using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace x_srv.Services.Data
{
    public class BaseRequest
    {
        public string os { get; set; } = "android";
        public int version { get; set; } = 1;
    }
}
