const { CognitoUser } = require("amazon-cognito-identity-js");
const AwsConfig = require("./awsConfig");

const signUp = (email, password, agent = "none") => {
  return new Promise((resolve) => {
    AwsConfig.initAWS();
    AwsConfig.setCognitoAttributeList(email, agent);
    AwsConfig.getUserPool().signUp(
      email,
      password,
      AwsConfig.getCognitoAttributeList(),
      null,
      function (err, result) {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        const response = {
          username: result.user.username,
          userConfirmed: result.userConfirmed,
          userAgent: result.user.client.userAgent,
        };
        return resolve({ statusCode: 201, response: response });
      }
    );
  });
};

function verify(email, code) {
  return new Promise((resolve) => {
    AwsConfig.getCognitoUser(email).confirmRegistration(
      code,
      true,
      (err, result) => {
        if (err) {
          return resolve({ statusCode: 422, response: err });
        }
        return resolve({ statusCode: 200, response: result });
      }
    );
  });
}

function signIn(email, password) {
  var userData = {}
  return new Promise((resolve) => {
    AwsConfig.getCognitoUser(email).authenticateUser(
      AwsConfig.getAuthDetails(email, password),
      {
        onSuccess: (session) => {
          const token = {
            accessToken: session.getAccessToken().getJwtToken(),
            idToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
          };
          const cognitoUser = new CognitoUser( 
             userData = {
            Username: email,
            Pool: AwsConfig.getUserPool()
          });
          cognitoUser['tokens'] = token; 
          return resolve({
            statusCode: 200,
            response: AwsConfig.decodeJWTToken(token),
          });
        },

        onFailure: (err) => {
          return resolve({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      }
    );
  });
}

module.exports = {
  signUp: signUp,
  verify: verify,
  signIn: signIn,
};
