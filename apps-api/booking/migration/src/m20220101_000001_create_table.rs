use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Use `execute_unprepared` if the SQL statement doesn't have value bindings
        db.execute_unprepared(
            "CREATE TABLE public.bookings (
                booking_id text NOT NULL PRIMARY KEY,
                room_id text NOT NULL,
                user_id text NOT NULL,
                check_in TIMESTAMP NOT NULL,
                check_out TIMESTAMP NOT NULL
            );",
        )
        .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared("DROP TABLE public.bookings;")
            .await?;

        Ok(())
    }
}
