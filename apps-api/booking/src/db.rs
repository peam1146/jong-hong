use sea_orm::{ConnectionTrait, Database, DatabaseConnection, DbBackend, DbErr, Statement};

use crate::config;

pub async fn init() -> Result<DatabaseConnection, DbErr> {
    let config = &match config::CONFIG.lock() {
        Ok(config) => config,
        Err(poisoned) => poisoned.into_inner(),
    };

    let db = Database::connect(&config.database.url).await?;

    let db = match db.get_database_backend() {
        DbBackend::MySql => {
            db.execute(Statement::from_string(
                db.get_database_backend(),
                format!("CREATE DATABASE IF NOT EXISTS `{}`;", config.database.name),
            ))
            .await?;

            let url = format!("{}/{}", config.database.url, config.database.name);
            Database::connect(&url).await?
        }
        DbBackend::Postgres => {
            let url = format!("{}/{}", config.database.url, config.database.name);
            println!("Connecting to {}", url);
            Database::connect(&url).await?
        }
        DbBackend::Sqlite => db,
    };

    Ok(db)
}
