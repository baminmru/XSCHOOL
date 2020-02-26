/*
Utils.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.models
{
    using System;

    /// <summary>
    /// Defines the <see cref="Utils" />
    /// </summary>
    public static class Utils
    {
        /// <summary>
        /// The Right
        /// </summary>
        /// <param name="str">The str<see cref="string"/></param>
        /// <param name="length">The length<see cref="int"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string Right(string str, int length)
        {
            if (str.Length > length)
                return str.Substring((str.Length - length), length);
            else
            {
                return str;
            }
        }

        /// <summary>
        /// The Left
        /// </summary>
        /// <param name="param">The param<see cref="string"/></param>
        /// <param name="length">The length<see cref="int"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string Left(string param, int length)
        {
            string result = param.Substring(0, length);
            return result;
        }

        /// <summary>
        /// The Mid
        /// </summary>
        /// <param name="param">The param<see cref="string"/></param>
        /// <param name="startIndex">The startIndex<see cref="int"/></param>
        /// <param name="length">The length<see cref="int"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string Mid(string param, int startIndex, int length)
        {
            string result = param.Substring(startIndex, length);
            return result;
        }

        /// <summary>
        /// The MSSQLDate
        /// </summary>
        /// <param name="d">The d<see cref="DateTime"/></param>
        /// <param name="FullDate">The FullDate<see cref="bool"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string MSSQLDate(DateTime d, bool FullDate = true)
        {
            if (Convert.IsDBNull(d))
                return "NULL";

            else if (FullDate)
                return "convert(datetime,'" + MakeODBCDate(d) + "',120)";
            else
            {
                d = new DateTime(d.Year, d.Month, d.Day);
                return "convert(datetime,'" + MakeODBCDate(d) + "',120)";
            }
        }

        /// <summary>
        /// The MakeODBCDate
        /// </summary>
        /// <param name="d">The d<see cref="DateTime"/></param>
        /// <returns>The <see cref="string"/></returns>
        public static string MakeODBCDate(DateTime d)
        {
            // yyyy-mm-dd hh:mi:ss(24h)
            if (Convert.IsDBNull(d))
                return "NULL";
            else
                return Right("0000" + d.Year.ToString(), 4) + "-" + Right("00" + d.Month.ToString(), 2) + "-" + Right("00" + d.Day.ToString(), 2)
                    + " " + Right("00" + d.Hour, 2) + ":" + Right("00" + d.Minute.ToString(), 2) + ":" + Right("00" + d.Second.ToString(), 2);
        }
    }
}

