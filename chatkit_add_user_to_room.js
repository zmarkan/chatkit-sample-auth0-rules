function (user, context, callback) {
  
    if(context.stats.loginsCount > 1 || context.protocol === 'oauth2-refresh-token') {
      console.log("Ignoring the user creation step");
      return callback(null, user, context);
    }
    
    const PUSHER_OFFICE_ROOM_ID = configuration.chatkitRoomId;
    const CHATKIT_API_BASE = 'https://us1.pusherplatform.io/services/chatkit/v2';
    const ADD_USERS_TO_ROOM_ENDPOINT = `${CHATKIT_API_BASE}/${configuration.chatkitInstanceId}/rooms/${PUSHER_OFFICE_ROOM_ID}/users/add`;
  
    const request = require('request');
    const jwt = require('jsonwebtoken');
    
    const minute = 60;
    const nowSeconds = Math.floor(Date.now() / 1000);
  
    const jwtPayload = {
      instance: configuration.chatkitInstanceId,
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
    
    const payload = {
      "user_ids": [user.email]
    };
    
    request.put({ 
      uri: ADD_USERS_TO_ROOM_ENDPOINT,
      json: true,
      body: payload,
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