/*
RefreshTokenRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    /// <summary>
    /// Defines the <see cref="RefreshTokenRequest" />
    /// </summary>
    public class RefreshTokenRequest : BaseRequest
    {
        /// <summary>
        /// Gets or sets the RefreshToken
        /// </summary>
        public string RefreshToken { get; set; }
    }
}
