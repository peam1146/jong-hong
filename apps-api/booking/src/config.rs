use lazy_static::lazy_static;
use serde::Deserialize;

use std::sync::Mutex;

use figment::{
    providers::{Format, Yaml},
    Figment,
};

#[derive(Deserialize, Debug, Clone)]
pub struct Database {
    pub url: String,
    pub name: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub database: Database,
}

lazy_static! {
    pub static ref CONFIG: Mutex<Config> = Mutex::new(
        Figment::new()
            .join(Yaml::file("config.yaml"))
            .extract()
            .unwrap()
    );
}
