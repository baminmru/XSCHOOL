/*
CreateUserProfileRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;

    /// <summary>
    /// Defines the <see cref="CreateUserProfileRequest" />
    /// </summary>
    public class CreateUserProfileRequest
    {
        /// <summary>
        /// Gets or sets the FirstName
        /// </summary>
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets the LastName
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the MiddleName
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// Gets or sets the Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// Gets or sets the Phone
        /// </summary>
        public string Phone { get; set; }

        /// <summary>
        /// Gets or sets the Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the OrganizationId
        /// </summary>
        public Guid OrganizationId { get; set; }

        /// <summary>
        /// Gets or sets the Role
        /// </summary>
        public string Role { get; set; }

        /// <summary>
        /// Gets or sets the Passcode
        /// </summary>
        public string Passcode { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="CreateUserProfileResponse" />
    /// </summary>
    public class CreateUserProfileResponse
    {
        /// <summary>
        /// Gets or sets the Status
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }
    }
}
