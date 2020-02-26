/*
RegisterDeviceRequest.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Services.Data.User
{
    /// <summary>
    /// Defines the <see cref="RegisterDeviceRequest" />
    /// </summary>
    public class RegisterDeviceRequest : BaseRequest
    {
        /// <summary>
        /// Gets or sets the OS
        /// </summary>
        public string OS { get; set; }

        /// <summary>
        /// Gets or sets the DeviceId
        /// </summary>
        public string DeviceId { get; set; }
    }
}
