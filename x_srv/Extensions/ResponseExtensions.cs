/*
ResponseExtensions.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Extensions
{
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Defines the <see cref="ResponseExtensions" />
    /// </summary>
    public static class ResponseExtensions
    {
        /// <summary>
        /// The AddApplicationError
        /// </summary>
        /// <param name="response">The response<see cref="HttpResponse"/></param>
        /// <param name="message">The message<see cref="string"/></param>
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            // CORS
            response.Headers.Add("access-control-expose-headers", "Application-Error");
        }
    }
}
