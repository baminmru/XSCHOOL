/*
GetUserProfileResponse.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Users.Data
{
    using System;
    using x_srv.models;

    /// <summary>
    /// Defines the <see cref="GetUserProfileRequest" />
    /// </summary>
    public class GetUserProfileRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="GetUserProfileResponse" />
    /// </summary>
    public class GetUserProfileResponse
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

        /// <summary>
        /// Gets or sets the OrganizationId
        /// </summary>
        public Guid? OrganizationId { get; set; }

        /// <summary>
        /// Gets the FullName
        /// </summary>
        public string FullName
        {
            get
            {
                return $"{FirstName} {MiddleName} {LastName}";
            }
        }

        /// <summary>
        /// Gets or sets the LoginId
        /// </summary>
        public Guid LoginId { get; set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetUserProfileResponse"/> class.
        /// </summary>
        public GetUserProfileResponse()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GetUserProfileResponse"/> class.
        /// </summary>
        /// <param name="user">The user<see cref="XUserInfo"/></param>
        public GetUserProfileResponse(XUserInfo user)
        {
            Id = user.XUserInfoId;
            FirstName = user.name;
            MiddleName = user.middleName;
            LastName = user.family;
            Phone = user.phone;
            LoginId = new Guid(user.login);
        }
    }
}
