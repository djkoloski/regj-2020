#[async_std::main]
async fn main() -> tide::Result<()> {
    let mut app = tide::new();
    app.at("/").serve_dir("public")?;
    app.listen("127.0.0.1:8080").await?;
    Ok(())
}
