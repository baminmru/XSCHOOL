/*
UpdateUserProfileRoleRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;

    /// <summary>
    /// Defines the <see cref="UpdateUserProfileRoleRequest" />
    /// </summary>
    public class UpdateUserProfileRoleRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the Role
        /// </summary>
        public string Role { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="UpdateUserProfileRoleResponse" />
    /// </summary>
    public class UpdateUserProfileRoleResponse
    {
        /// <summary>
        /// Gets or sets the Status
        /// </summary>
        public string Status { get; set; }
    }
}
