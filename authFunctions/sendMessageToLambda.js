var AwsConfig = require("./awsConfig");
var {
  CognitoRefreshToken,
  CognitoIdToken,
  CognitoAccessToken,
  CognitoUserSession
} = require('amazon-cognito-identity-js')



// const AccessToken = new CognitoAccessToken({ AccessToken: tokens.accessToken });
//  const IdToken = new CognitoIdToken({ IdToken: tokens.idToken });
//  const RefreshToken = new CognitoRefreshToken({ RefreshToken: tokens.refreshToken });
//console.log(AccessToken , IdToken , RefreshToken)


//  const sessionData = {
//   IdToken: IdToken,
//    AccessToken: AccessToken,
//   RefreshToken: RefreshToken
//  };

//const userSession = new CognitoUserSession(sessionData);

const sendToLambda = () => {
  console.log(userSession)
};

module.exports = sendToLambda;
