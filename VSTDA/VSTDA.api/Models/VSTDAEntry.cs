using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace VSTDA.api.Models
{
    public class VSTDAEntry
    {

        // primary key
        public int VSTDAEntryId { get ; set;}
        // or public Guid 
    //foreign key - options
        

        //User Data
        public string Description { get; set; }
        public DateTime CreatedTime { get; set; }
        public int Priority { get; set; }
    }
}