CREATE TABLE users (
    username VARCHAR(50) NOT NULL,
    password TEXT NOT NULL,
    displayName TEXT NOT NULL,
    salt TEXT NOT NULL,
    PRIMARY KEY(username)
);

CREATE TABLE apps(
    appid INT NOT NULL AUTO_INCREMENT,
    name TEXT NOT NULL,
    token text NOT NULL,
    PRIMARY KEY(appid)
);

CREATE TABLE ranks (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    life INT,
    PRIMARY KEY(id),
    FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE
);