using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using VSTDA.api.Infrastructure;
using VSTDA.api.Models;

namespace VSTDA.api.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    public class VSTDAEntriesController : ApiController
    {
        private VSTDAInfrastructureContext db = new VSTDAInfrastructureContext();

        // GET: api/VSTDAEntries
        public IQueryable<VSTDAEntry> GetVSTDAEntries()
        {
            return db.VSTDAEntries;
        }

        // GET: api/VSTDAEntries/5
        [ResponseType(typeof(VSTDAEntry))]
        public IHttpActionResult GetVSTDAEntry(int id)
        {
            VSTDAEntry vSTDAEntry = db.VSTDAEntries.Find(id);
            if (vSTDAEntry == null)
            {
                return NotFound();
            }

            return Ok(vSTDAEntry);
        }

        // PUT: api/VSTDAEntries/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVSTDAEntry(int id, VSTDAEntry vSTDAEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vSTDAEntry.VSTDAEntryId)
            {
                return BadRequest();
            }

            db.Entry(vSTDAEntry).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VSTDAEntryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/VSTDAEntries
        [ResponseType(typeof(VSTDAEntry))]
        public IHttpActionResult PostVSTDAEntry(VSTDAEntry vstdaEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.VSTDAEntries.Add(vstdaEntry);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = vstdaEntry.VSTDAEntryId }, vstdaEntry);
        }

        // DELETE: api/VSTDAEntries/5
        [ResponseType(typeof(VSTDAEntry))]
        public IHttpActionResult DeleteVSTDAEntry(int id)
        {
            VSTDAEntry vSTDAEntry = db.VSTDAEntries.Find(id);
            if (vSTDAEntry == null)
            {
                return NotFound();
            }

            db.VSTDAEntries.Remove(vSTDAEntry);
            db.SaveChanges();

            return Ok(vSTDAEntry);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VSTDAEntryExists(int id)
        {
            return db.VSTDAEntries.Count(e => e.VSTDAEntryId == id) > 0;
        }
    }
}