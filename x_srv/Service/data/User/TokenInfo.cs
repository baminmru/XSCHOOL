/*
TokenInfo.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    /// <summary>
    /// Defines the <see cref="TokenInfo" />
    /// </summary>
    public class TokenInfo
    {
        /// <summary>
        /// Gets or sets the access_token
        /// </summary>
        public string access_token { get; set; }

        /// <summary>
        /// Gets or sets the expires_in
        /// </summary>
        public long expires_in { get; set; }

        /// <summary>
        /// Gets or sets the token_type
        /// </summary>
        public string token_type { get; set; }

        /// <summary>
        /// Gets or sets the refresh_token
        /// </summary>
        public string refresh_token { get; set; }
    }
}
