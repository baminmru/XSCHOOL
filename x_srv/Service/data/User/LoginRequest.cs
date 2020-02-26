/*
LoginRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    /// <summary>
    /// Defines the <see cref="LoginRequest" />
    /// </summary>
    public class LoginRequest
    {
        /// <summary>
        /// Gets or sets the appsecret
        /// </summary>
        public string appsecret { get; set; }

        /// <summary>
        /// Gets or sets the clientid
        /// </summary>
        public string clientid { get; set; }

        /// <summary>
        /// Gets or sets the email
        /// </summary>
        public string email { get; set; }

        /// <summary>
        /// Gets or sets the password
        /// </summary>
        public string password { get; set; }

        /// <summary>
        /// Gets or sets the Device
        /// </summary>
        public UserDeviceData Device { get; set; }
    }

    /// <summary>
    /// Defines the <see cref="UserDeviceData" />
    /// </summary>
    public class UserDeviceData
    {
        /// <summary>
        /// Gets or sets the DeviceOS
        /// </summary>
        public string DeviceOS { get; set; }

        /// <summary>
        /// Gets or sets the DeviceToken
        /// </summary>
        public string DeviceToken { get; set; }

        /// <summary>
        /// Gets or sets the AppVersion
        /// </summary>
        public string AppVersion { get; set; }
    }
}
