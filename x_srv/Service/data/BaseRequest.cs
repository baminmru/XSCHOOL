/*
BaseRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data
{
    /// <summary>
    /// Defines the <see cref="BaseRequest" />
    /// </summary>
    public class BaseRequest
    {
        /// <summary>
        /// Gets or sets the os
        /// </summary>
        public string os { get; set; } = "android";

        /// <summary>
        /// Gets or sets the version
        /// </summary>
        public int version { get; set; } = 1;
    }
}
