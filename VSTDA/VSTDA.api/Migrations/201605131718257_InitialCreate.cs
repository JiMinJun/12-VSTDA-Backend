namespace VSTDA.api.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.VSTDAEntries",
                c => new
                    {
                        VSTDAEntryId = c.Int(nullable: false, identity: true),
                        Description = c.String(),
                        CreatedTime = c.DateTime(nullable: false),
                        Priority = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.VSTDAEntryId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.VSTDAEntries");
        }
    }
}
