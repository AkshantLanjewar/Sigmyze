FROM rust:latest

WORKDIR /app

#copy code into the container
COPY . . 

RUN cargo build --release
CMD ["./target/release/quanta_engine"]