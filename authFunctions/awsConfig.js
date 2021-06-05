const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let CognitoUserPool = require('amazon-cognito-identity-js').CognitoUserPool
let CognitoUser = require('amazon-cognito-identity-js').CognitoUser
let cognitoAttributeList = [];
const jwkToPem = require('jwk-to-pem'); 
const request = require('request');
const jwt = require('jsonwebtoken');

const poolData = { 
    UserPoolId :"us-east-2_WpRYsmZBf",
    ClientId : "6c8qda9ob0arin497us27t2gib"
};
//us-east-2:dcc85072-4b68-4697-b4f7-aa9647527ca5
const attributes = (key, value) => { 
  return {
    Name : key,
    Value : value
  }
};

const userPool = new CognitoUserPool(poolData);

function setCognitoAttributeList(email, agent) {
  let attributeList = [];
  attributeList.push(attributes('email',email));
  attributeList.forEach(element => {
    cognitoAttributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(element));
  });
}

function getCognitoAttributeList() {
  return cognitoAttributeList;
}



function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool()
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

function getUserPool(){
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}

function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
   };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

function getAuthenticatedUser() {
  return userPool.getCurrentUser();
}

function initAWS (region = "us-east-2", identityPoolId ="us-east-2:dcc85072-4b68-4697-b4f7-aa9647527ca5") {
  AWS.config.region = region; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

function decodeJWTToken(token) {
  const {  email, exp, auth_time , token_use, sub} = jwt_decode(token.idToken);
  return {  token, email, exp, uid: sub, auth_time, token_use };
}

function ValidateToken(token) {
  request({
      url: `https://cognito-idp.us-east-2.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
      json: true
  }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
          pems = {};
          var keys = body['keys'];
          for(var i = 0; i < keys.length; i++) {
              //Convert each key to PEM
              var key_id = keys[i].kid;
              var modulus = keys[i].n;
              var exponent = keys[i].e;
              var key_type = keys[i].kty;
              var jwk = { kty: key_type, n: modulus, e: exponent};
              var pem = jwkToPem(jwk);
              pems[key_id] = pem;
          }
          //validate the token
          var decodedJwt = jwt.decode(token, {complete: true});
          if (!decodedJwt) {
              console.log("Not a valid JWT token");
              return;
          }

          var kid = decodedJwt.header.kid;
          var pem = pems[kid];
          if (!pem) {
              console.log('Invalid token');
              return;
          }

          jwt.verify(token, pem, function(err, payload) {
              if(err) {
                  console.log("Invalid Token ");
              } else {
                  console.log("Valid Token." );
                  console.log(payload)
                 
              }
              return ({"your payload" : payload })
          });
      } else {
          console.log("Error! Unable to download JWKs");
      }
  });

}




module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
  getAuthenticatedUser,
  ValidateToken,
}