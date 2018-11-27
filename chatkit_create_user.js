const configuration = {}
configuration.chatkitInstanceLocator = `v1:us1:7954c374-f491-4c08-b71e-5abfc0a3dc89`
configuration.chatkitKeyId = `495ccceb-017a-4f15-b69e-75c9a5799537`
configuration.chatkitKeySecret = `ykmJl4uSuKbKAzXKZJ5OoBdeYvMYVlJPLqt1GRWSJao=`
configuration.chatkitInstanceId = `7954c374-f491-4c08-b71e-5abfc0a3dc89`

const CHATKIT_API_BASE = `https://us1.pusherplatform.io/services/chatkit/v2`
const USERS_ENDPOINT = `${CHATKIT_API_BASE}/${configuration.chatkitInstanceId}/users`

const request = require('request')
const jwt = require('jsonwebtoken')


const minute = 60;
const nowSeconds = Math.floor(Date.now() / 1000);

const jwtPayload = {
    instance: configuration.chatkitInstanceId,
    iss: `api_keys/${configuration.chatkitKeyId}`,
    iat: nowSeconds,
    exp: nowSeconds +  minute,
    su:  true
}

let token = jwt.sign(jwtPayload, configuration.chatkitKeySecret)
console.log(token)

const headers = {  
    "content-type": "application/json",
    "Authorization": `Bearer ${token}`
};

let chatkitUser = {
    id: user.email,
    name: user.name,
    avatar_url: user.picture
};



request.post({ 
    uri: USERS_ENDPOINT,
    json: true,
    body: chatkitUser,
    headers: headers
}, ( error, response, body )  => {

    if(error) {

        console.log(error)
    }

    console.log(response.statusCode)
    console.log(response.body)

})

