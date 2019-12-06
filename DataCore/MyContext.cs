using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient ;
using Newtonsoft.Json;

namespace x_srv.models
{
   public class MyContext: DbContext
    {
        public MyContext(DbContextOptions<MyContext> options)
             : base(options)
        {
            //Database.EnsureCreated();
            _serializerSettings = new JsonSerializerSettings()
            {
                TypeNameHandling = TypeNameHandling.None
            };
        }

        private JsonSerializerSettings _serializerSettings;

        public JsonSerializerSettings serializerSettings()
        {

            return _serializerSettings;
        }

        // retrivedata from raw sql select
        public List<Dictionary<string, object>> GetRaw(string SQL)
        {
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> row;
            DataTable dt;
            SqlDataAdapter da;
            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            dt = new DataTable();
            da = new SqlDataAdapter(cmd);
            try
            {

                // retrive data from db
                da.Fill(dt);

                foreach (DataRow dr in dt.Rows)
                {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        if (dr[col] != DBNull.Value)
                            row.Add(col.ColumnName, dr[col]);
                        else
                            row.Add(col.ColumnName, null);
                    }
                    rows.Add(row);
                }


            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
            }
            finally
            {
                dt.Dispose();
                da.Dispose();
                cmd.Dispose();
            }

            return rows;
        }

        public DataTable DoQuery(string SQL)
        {
            DataTable dt;
            SqlDataAdapter da;
            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            dt = new DataTable();
            da = new SqlDataAdapter(cmd);
            try
            {

                // retrive data from db
                da.Fill(dt);

            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
            }
            finally
            {

                da.Dispose();
                cmd.Dispose();
            }

            return dt;
        }


        public string DoExec(string SQL)
        {

            SqlCommand cmd = new SqlCommand(SQL, (SqlConnection)Database.GetDbConnection());
            cmd.CommandType = CommandType.Text;
            System.Diagnostics.Debug.Print("Exec: " + SQL);
            Boolean my_open = false;
            try
            {
                if (cmd.Connection.State != ConnectionState.Open) { cmd.Connection.Open(); my_open = true; }
                cmd.ExecuteNonQuery();

            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print(ex.Message);
                return ex.Message;
            }
            finally
            {
                if (my_open && cmd.Connection.State == ConnectionState.Open) cmd.Connection.Close();
                cmd.Dispose();
            }
            return "";
        }



        public DbSet<x_srv.models.XInstructorInfo> XInstructorInfo { get; set; }
        public DbSet<x_srv.models.XInstructorStatus> XInstructorStatus { get; set; }
        public DbSet<x_srv.models.XCourseDesc> XCourseDesc { get; set; }
        public DbSet<x_srv.models.XCourseModule> XCourseModule { get; set; }
        public DbSet<x_srv.models.XChepter> XChepter { get; set; }
        public DbSet<x_srv.models.XCoursePrice> XCoursePrice { get; set; }
        public DbSet<x_srv.models.XUserInfo> XUserInfo { get; set; }
        public DbSet<x_srv.models.XSubscription> XSubscription { get; set; }
        public DbSet<x_srv.models.XUserPurchase> XUserPurchase { get; set; }
        public DbSet<x_srv.models.XUserProfile> XUserProfile { get; set; }
        public DbSet<x_srv.models.XUserRegistartion> XUserRegistartion { get; set; }
        public DbSet<x_srv.models.XUserCart> XUserCart { get; set; }
        public DbSet<x_srv.models.xeduprog_info> xeduprog_info { get; set; }
        public DbSet<x_srv.models.eduprog_course> eduprog_course { get; set; }
        public DbSet<x_srv.models.XScheduleItem> XScheduleItem { get; set; }
        public DbSet<x_srv.models.XScheduleSubst> XScheduleSubst { get; set; }
        public DbSet<x_srv.models.XLevel> XLevel { get; set; }
        public DbSet<x_srv.models.XSubject> XSubject { get; set; }
        public DbSet<x_srv.models.XVendor> XVendor { get; set; }
        public DbSet<x_srv.models.XStatus> XStatus { get; set; }
        public DbSet<x_srv.models.XSubscriptionType> XSubscriptionType { get; set; }
        public DbSet<x_srv.models.XCert> XCert { get; set; }


    }
}
