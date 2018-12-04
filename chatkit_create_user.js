function (user, context, callback) {
  
    if(context.stats.loginsCount > 1 || context.protocol === 'oauth2-refresh-token') {
      console.log("Ignoring the user creation step");
      return callback(null, user, context);
    }

    const CHATKIT_INSTANCE_ID = configuration.chatkitInstanceLocator.split(':')[2];
    const CHATKIT_KEY_ID = configuration.chatkitSecret.split(':')[0]; 
    const CHATKIT_KEY_SECRET = configuration.chatkitSecret.split(':')[1];
    const CHATKIT_API_BASE = `https://us1.pusherplatform.io/services/chatkit/v2`;
    const USERS_ENDPOINT = `${CHATKIT_API_BASE}/${CHATKIT_INSTANCE_ID}/users`;

  
    const request = require('request');
    const jwt = require('jsonwebtoken');
    
    let chatkitUser = {
      id: user.email,
      name: user.name,
      avatar_url: user.picture
    };
    
    const minute = 60;
    const nowSeconds = Math.floor(Date.now() / 1000);
  
    const jwtPayload = {
      instance: CHATKIT_INSTANCE_ID,
      iss: `api_keys/${configuration.chatkitKeyId}`,
      iat: nowSeconds,
      exp: nowSeconds +  minute,
      su:  true
    };
  
    let token = jwt.sign(jwtPayload, configuration.chatkitKeySecret);
    console.log(token);
    
    const headers = {  
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`
    };
    
    request.post({ 
      uri: USERS_ENDPOINT,
      json: true,
      body: chatkitUser,
      headers: headers
  }, ( error, response, body )  => {
      
      if(error) {
        callback(error, user, context);
      }
  
      console.log(response.statusCode);
      console.log(response.body);
      
      callback(null, user, context);
  });  
  }