/*
GetOrganizationUsersRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Defines the <see cref="GetOrganizationUsersRequest" />
    /// </summary>
    public class GetOrganizationUsersRequest
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="GetOrganizationUsersResponse" />
    /// </summary>
    public class GetOrganizationUsersResponse
    {
        /// <summary>
        /// Gets or sets the Items
        /// </summary>
        public List<OrganizationUserItem> Items { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="OrganizationUserItem" />
    /// </summary>
    public class OrganizationUserItem
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
        /// Gets or sets the MiddleName
        /// </summary>
        public string MiddleName { get; set; }

        /// <summary>
        /// Gets or sets the LastName
        /// </summary>
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets the Email
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Gets or sets the Role
        /// </summary>
        public string Role { get; set; }
    }
}
