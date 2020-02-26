/*
DeleteUserProfileRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;

    /// <summary>
    /// Defines the <see cref="DeleteUserProfileRequest" />
    /// </summary>
    public class DeleteUserProfileRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="DeleteUserProfileResponse" />
    /// </summary>
    public class DeleteUserProfileResponse
    {
        /// <summary>
        /// Gets or sets the Status
        /// </summary>
        public string Status { get; set; }
    }
}
