## Setting up the server environment

This project was developed using Node version 14.*
To install node on Ubuntu Follow theese instructions

<br>

### Installing NodeJS (Required)

First acquire the nodesource setup
```
$   cd ~
$   curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
```

Run the script with 
```
$    sudo bash nodesource_setup.sh
```

Then install nodejs with 
```
$   sudo apt install nodejs
```

Verify the installation with 
```
$   node -v
```

### Installing the dependencies
By default, node comes with the packager manager NPM, so to install the required packages copy these commands
```
$   cd Lunar
$   npm i
```

<br>

### Building the Frontend UI
To ensure maximum performance, the frontend UI has to be built on each clone. To build the project, simply run
```
$   npm run build
```

<br>

### Running the Server
To run the server, type in the console
```
$   npm run server
```

By default, the server runs on port 8050, so for port forwarding, make sure that you forward 8050 to 80