/*
JwtIssuerOptions.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Settings
{
    using Microsoft.IdentityModel.Tokens;
    using System;
    using System.Threading.Tasks;

    /// <summary>
    /// Defines the <see cref="JwtIssuerOptions" />
    /// </summary>
    public class JwtIssuerOptions
    {
        /// <summary>
        /// Gets or sets the Issuer
        /// "iss" (Issuer) Claim
        /// </summary>
        public string Issuer { get; set; }

        /// <summary>
        /// Gets or sets the Subject
        /// "sub" (Subject) Claim
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets the Audience
        /// "aud" (Audience) Claim
        /// </summary>
        public string Audience { get; set; }

        /// <summary>
        /// Gets the NotBefore
        /// "nbf" (Not Before) Claim (default is UTC NOW)
        /// </summary>
        public DateTime NotBefore => DateTime.UtcNow;

        /// <summary>
        /// Gets the IssuedAt
        /// "iat" (Issued At) Claim (default is UTC NOW)
        /// </summary>
        public DateTime IssuedAt => DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the ValidFor
        /// Set the timespan the token will be valid for (default is 5 min/300 seconds)
        /// </summary>
        public TimeSpan ValidFor { get; set; } = TimeSpan.FromMinutes(8 * 60);

        /// <summary>
        /// Gets the Expiration
        /// "exp" (Expiration Time) Claim (returns IssuedAt + ValidFor)
        /// </summary>
        public DateTime Expiration => IssuedAt.Add(ValidFor);

        /// <summary>
        /// Gets the JtiGenerator
        /// "jti" (JWT ID) Claim (default ID is a GUID)
        /// </summary>
        public Func<Task<string>> JtiGenerator =>
          () => Task.FromResult(Guid.NewGuid().ToString());

        /// <summary>
        /// Gets or sets the SigningCredentials
        /// The signing key to use when generating tokens.
        /// </summary>
        public SigningCredentials SigningCredentials { get; set; }
    }
}
