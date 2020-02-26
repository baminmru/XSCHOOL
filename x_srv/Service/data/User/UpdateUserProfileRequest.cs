/*
UpdateUserProfileRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Users.Data
{
    using System;
    using x_srv.Services.Data;

    /// <summary>
    /// Defines the <see cref="UpdateUserProfileRequest" />
    /// </summary>
    public class UpdateUserProfileRequest : BaseRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }

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
        /// Gets or sets the Phone
        /// </summary>
        public string Phone { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="UpdateUserProfileResponse" />
    /// </summary>
    public class UpdateUserProfileResponse
    {
        /// <summary>
        /// Gets or sets the Status
        /// </summary>
        public string Status { get; set; }
    }
}
