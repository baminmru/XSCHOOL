/*
ChangePasswordRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;

    /// <summary>
    /// Defines the <see cref="ChangePasswordRequest" />
    /// </summary>
    public class ChangePasswordRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the OldPassword
        /// </summary>
        public string OldPassword { get; set; }

        /// <summary>
        /// Gets or sets the NewPassword
        /// </summary>
        public string NewPassword { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="ChangePasswordResponse" />
    /// </summary>
    public class ChangePasswordResponse
    {
        /// <summary>
        /// Gets or sets the Status
        /// </summary>
        public string Status { get; set; }
    }
}
