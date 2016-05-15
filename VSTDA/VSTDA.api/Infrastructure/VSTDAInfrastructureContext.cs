using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Web;
using VSTDA.api.Models;

namespace VSTDA.api.Infrastructure
{
    //create class that inherits from DBContext
    public class VSTDAInfrastructureContext : DbContext
    {
        //setup constructor
        public VSTDAInfrastructureContext() : base("VSTDA")
        {
            
        }
        //describe table
        public IDbSet<VSTDAEntry> VSTDAEntries { get; set; }
    }

}