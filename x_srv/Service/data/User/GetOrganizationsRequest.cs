/*
GetOrganizationsRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Defines the <see cref="GetOrganizationsRequest" />
    /// </summary>
    public class GetOrganizationsRequest
    {
    }

    /// <summary>
    /// Defines the <see cref="GetOrganizationsResponse" />
    /// </summary>
    public class GetOrganizationsResponse
    {
        /// <summary>
        /// Gets or sets the Items
        /// </summary>
        public List<OrganizationItem> Items { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="OrganizationItem" />
    /// </summary>
    public class OrganizationItem
    {
        /// <summary>
        /// Gets or sets the Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the Name
        /// </summary>
        public string Name { get; set; }
    }
}
