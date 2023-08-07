use std::{sync::Arc, str::from_utf8};
use tokio::{sync::Mutex, fs::{File, self}, io::{AsyncWriteExt, AsyncReadExt}};

use hashbrown::HashMap;

pub const DATA_PATH: &str = "./data";

pub async fn set_store_value(key: String, value: String, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    if value.len() > 1_000_000 {
        // we need to store a file
        let file_key = key.replace("::", "_");
        let file_path = format!("{}/{}.bin", DATA_PATH, file_key);
        let mut file = File::create(file_path).await.unwrap();

        file.write_all(value.as_bytes()).await.unwrap();
        store_val.store.insert(key, "file".into());
    } else {
        store_val.store.insert(key, value);
    }
}

pub async fn get_store_value(key: String, store: &Arc<Mutex<QuantaDataStore>>) -> Option<String> {
    let store = Arc::clone(store);
    let store_val = store.lock().await;

    let store_value = store_val.store.get(&key);
    let store_value = store_value.cloned();

    //check if we are retreiving a file
    let store_value_ref = store_value.as_ref();
    if store_value_ref.is_some() && store_value_ref.unwrap().as_str() == "file" {
        let key = key.replace("::", "_");
        let file_path = format!("{}/{}.bin", DATA_PATH, key);
        let mut file = File::open(file_path).await.unwrap();

        let mut buf = Vec::<u8>::new();
        file.read_to_end(&mut buf).await.unwrap();
        return Some(from_utf8(&buf).unwrap().to_string());
    }

    return store_value
}

pub async fn delete_store_values(keys: Vec<String>, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let mut val = store_val.clone();
    for key in keys.iter() {
        let store_val = val.store.remove(key);
        if store_val.is_none() {
            continue;
        }

        let store_val = store_val.unwrap();
        if store_val == "file" {
            let file_key = key.replace("::", "_");
            let file_path = format!("{}/{}.bin", DATA_PATH, file_key);
            fs::remove_file(file_path).await.unwrap();
        }
    }

    val.store.shrink_to_fit();
    *store_val = val;
}

pub async fn _delete_store_value(key: String, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let mut val = store_val.clone();
    let store_value = val.store.remove(&key);
    
    if store_value.is_some() && store_value.unwrap() == "file" {
        let file_path = format!("{}/{}.bin", DATA_PATH, key);
        fs::remove_file(file_path).await.unwrap();
    }

    val.store.shrink_to_fit();
    *store_val = val;
}

pub async fn store_keys(store: &Arc<Mutex<QuantaDataStore>>) -> Vec<String> {
    let store = Arc::clone(store);
    let store_val = store.lock().await;
    let val = store_val.clone();

    let keys: Vec<&String> = val.store.keys().collect();
    let mut ret_keys: Vec<String> = Vec::new();

    for key in keys.iter() {
        ret_keys.push(key.as_str().into());
    }

    ret_keys
}

pub async fn init_cache(key: String, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let new_cache: Vec<String> = Vec::new();
    let mut val = store_val.clone();
    val.cache.insert(key, new_cache);
    *store_val = val;
}

pub async fn set_cache(key: String, value: Vec<String>, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let mut val = store_val.clone();
    val.cache.insert(key, value);
    *store_val = val;
}

pub async fn append_cache(key: String, value: String, store: &Arc<Mutex<QuantaDataStore>>) {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let mut val = store_val.clone();
    let mut cache = match val.cache.get(&key) {
        Some(v) => v.clone(),
        None => return 
    };

    cache.push(value);
    val.cache.insert(key, cache);
    *store_val = val;
}

pub async fn get_cache(key: String, store: &Arc<Mutex<QuantaDataStore>>) -> Option<Vec<String>> {
    let store = Arc::clone(store);
    let store_val = store.lock().await;

    let val = store_val.clone();
    return val.cache.get(&key).cloned();
}

pub async fn pop_cache(key: String, store: &Arc<Mutex<QuantaDataStore>>) -> Option<Vec<String>> {
    let store = Arc::clone(store);
    let mut store_val = store.lock().await;

    let mut val = store_val.clone();
    let cache = val.cache.remove(&key);

    val.cache.shrink_to_fit();
    *store_val = val;
    return cache
}

#[derive(Clone)]
pub struct QuantaDataStore {
    store: HashMap<String, String>,
    cache: HashMap<String, Vec<String>>
}

impl QuantaDataStore {
    pub fn init() -> Self {
        Self {
            store: HashMap::new(),
            cache: HashMap::new()
        }
    }
}