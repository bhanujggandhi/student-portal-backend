# Student Dashboard Portal

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

1. **Node** as well as **npm**
2. **MongoDB** install in your system or **Atlas URI**
3. Google Developer Account
4. Make sure in your google account you have ***Allow less secure apps: ON***

#### Create a key.js file in src/config folder

```
const mongoUri = ''; //MongoDB URI either atlas or localhost;
const gmailId = ''; //Google mail (GMAIL) from which you want to send forgot password mail;
const gmailPassword = ''; //Password of that email (Real password). Allow less secure apps in gmail account;
const GoogleClientSecret = ''; //For google oAuth;
const GoogleClientID = ''; //Secret for googleOAuth ;
//https://www.balbooa.com/gridbox-documentation/how-to-get-google-client-id-and-client-secret
//Refer link to get those ids.
//Please put localhost:3000 and local:3000/auth/google/redirect
const SecretKey = ''; //Any random key for hashing password

module.exports = {
  mongoUri,
  gmailId,
  gmailPassword,
  GoogleClientID,
  GoogleClientSecret,
  SecretKey,
};

```


### Installing

You can run this project in development mode using npm or yarn

Run the following command in the project directory

```
npm install && npm run dev
```

OR

```
yarn && yarn dev
```
