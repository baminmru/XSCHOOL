namespace survey_api
{
    using Microsoft.Net.Http.Headers;
    using System;
    using System.IO;

    /// <summary>
    /// Defines the <see cref="MultipartRequestHelper" />
    /// </summary>
    public static class MultipartRequestHelper
    {
        // Content-Type: multipart/form-data; boundary="----WebKitFormBoundarymx2fSWqWSd0OxQqq"
        // The spec says 70 characters is a reasonable limit.
        /// <summary>
        /// The GetBoundary
        /// </summary>
        /// <param name="contentType">The contentType<see cref="MediaTypeHeaderValue"/></param>
        /// <param name="lengthLimit">The lengthLimit<see cref="int"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string GetBoundary(MediaTypeHeaderValue contentType, int lengthLimit)
        {
            var boundary = HeaderUtilities.RemoveQuotes(contentType.Boundary);
            if (string.IsNullOrWhiteSpace(boundary.Value))
            {
                throw new InvalidDataException("Missing content-type boundary.");
            }

            if (boundary.Length > lengthLimit)
            {
                throw new InvalidDataException(
                    $"Multipart boundary length limit {lengthLimit} exceeded.");
            }

            return boundary.Value;
        }

        /// <summary>
        /// The IsMultipartContentType
        /// </summary>
        /// <param name="contentType">The contentType<see cref="string"/></param>
        /// <returns>The <see cref="bool"/></returns>
        public static bool IsMultipartContentType(string contentType)
        {
            return !string.IsNullOrEmpty(contentType)
                   && contentType.IndexOf("multipart/", StringComparison.OrdinalIgnoreCase) >= 0;
        }

        /// <summary>
        /// The HasFormDataContentDisposition
        /// </summary>
        /// <param name="contentDisposition">The contentDisposition<see cref="ContentDispositionHeaderValue"/></param>
        /// <returns>The <see cref="bool"/></returns>
        public static bool HasFormDataContentDisposition(ContentDispositionHeaderValue contentDisposition)
        {
            // Content-Disposition: form-data; name="key";
            return contentDisposition != null
                   && contentDisposition.DispositionType.Equals("form-data")
                   && string.IsNullOrEmpty(contentDisposition.FileName.Value)
                   && string.IsNullOrEmpty(contentDisposition.FileNameStar.Value);
        }

        /// <summary>
        /// The HasFileContentDisposition
        /// </summary>
        /// <param name="contentDisposition">The contentDisposition<see cref="ContentDispositionHeaderValue"/></param>
        /// <returns>The <see cref="bool"/></returns>
        public static bool HasFileContentDisposition(ContentDispositionHeaderValue contentDisposition)
        {
            // Content-Disposition: form-data; name="myfile1"; filename="Misc 002.jpg"
            return contentDisposition != null
                   && contentDisposition.DispositionType.Equals("form-data")
                   && (!string.IsNullOrEmpty(contentDisposition.FileName.Value)
                       || !string.IsNullOrEmpty(contentDisposition.FileNameStar.Value));
        }
    }
}
