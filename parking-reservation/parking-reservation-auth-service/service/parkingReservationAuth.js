const grpc = require('@grpc/grpc-js');
const crypto = require('crypto');
const { connection } = require('../model/database.js');
const { validPassword, genPassword, issueJWT } = require('../lib/utils.js');

const Redis = require('ioredis');
const redis = new Redis(6379, "redis-publisher");

// Define the Redis channel to subscribe to
const redisChannel = 'email-notifications';

// redis.publish(redisChannel, JSON.stringify({ message: "Hey Pub/Sub stuff" }));
async function register(call, callback){
  const { request: { user_name, email, password, first_name, last_name } } = call;
  const { salt, hash } = genPassword(password);
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "INSERT INTO User (user_email, user_hash, user_salt, user_name, user_first_name, user_last_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())";
      const queryValues = [email, hash, salt, user_name, first_name, last_name];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, { message: "User registered successfully" });
      });
    });
    redis.publish(redisChannel, JSON.stringify({ message: "Welcome", event_type: "welcome", email: user_email, name: first_name }));
  } catch (error) {
    console.error('Error Registering User:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to register user' });
  }
}

async function getUserByEmail(email){
  let getUserPromise = new Promise((resolve, reject) => {
    return connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM User WHERE User.user_email = ? LIMIT 1";
      const queryValues = [email];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  });

  return getUserPromise.then((result) => {
    return result[0];
  }).then((error) => {
    return error;
  });
}

async function getResetTokenByEmail(email){
  let getResetTokenPromise = new Promise((resolve, reject) => {
    return connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM ResetPasswordToken WHERE ResetPasswordToken.user_email = ?";
      const queryValues = [email];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  });

  return getResetTokenPromise.then((result) => {
    return result[0];
  }).then((error) => {
    return error;
  });
}

function removeToken(user_email){
  connection.connect((err) => {
    if (err) throw err;
    const sqlQuery = "DELETE FROM ResetPasswordToken WHERE ResetPasswordToken.user_email = ?";
    const queryValues = [user_email];
    connection.query(sqlQuery, queryValues, (err, result, fields) => {
      if (err) throw err;
      // callback(null, { message: "Password reset successfully" });
    });
  });
}

async function forgotPassword(call, callback){
  const { request: { email } } = call;
  try {
    const result = await getUserByEmail(email);
    const { user_id, user_email, user_name, user_first_name, user_last_name } = result;

    console.log(result, "meth");
    callback(null, { message: "Email sent" });

    const token = crypto.randomBytes(32).toString('hex');
    const expireDate = new Date(new Date().getTime() + (60 * 60 * 1000));

    // add token to the token table
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "INSERT INTO ResetPasswordToken (user_email, url_token, expiration, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
      const queryValues = [email, token, expireDate];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
      });
    });

    let urlToken = `http://127.0.0.1:3000/api/auth/reset/password?token=${token}&email=${user_email}`;
    console.log(urlToken, "token");
    redis.publish(redisChannel, JSON.stringify({ message: "Forgot Password", event_type: "forgot_password", email: user_email, link: urlToken, name: user_first_name }));
    // console.log(result, "inside forgot password method");
     // create the link
     // send email

  } catch (error) {
    console.error('Error sending email:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to user email' });
  }
}

async function resetPassword(call, callback){
  const { request: { user_email, new_password, confirm_password, url_token } } = call;
   // verify token
   // then insert
  const { salt, hash } = genPassword(new_password);
  try {
    console.log(user_email, "inside reset");
    const result = await getResetTokenByEmail(user_email);
    console.log(result, "reset password");
    // const { url_token, expiration } = result;
    const currentDate = new Date();
    // callback(null, { message: "Password reset successfully" });

    // token invalid
    if (result.url_token !== url_token ){
      throw "Invalid token";
      // callback(null, { message: "Password reset successfully" });
    }

    // token expired
    if (result.expiration.getTime() < currentDate.getTime()){
      // delete record
      removeToken(user_email);
      throw "Token expired";
    } 
    removeToken(user_email);
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "UPDATE User SET User.user_hash = ?, User.user_salt = ? WHERE User.user_email = ?";
      const queryValues = [hash, salt, user_email];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, { message: "Password reset successfully" });
      });
    });
  } catch (error) {
    console.error('Error Reseting User Password:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to reset user password' });
  }
}

async function login(call, callback){
  const { request: { user_name, password } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM User WHERE User.user_name = ? LIMIT 1";
      const queryValues = [user_name];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        const isValid = validPassword(password, result[0].user_hash, result[0].user_salt);
        if (isValid){
          const jwt = issueJWT(result.user_id);
          callback(null, { message: "Login succefully", token: jwt.token, expires: jwt.expires });    
        } else {
          callback(null, { message: "Invalid password" })
        }
      });
    });
  } catch (error) {
    console.error('Error Logging User:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to login user' });
  }
}

async function getUser(call, callback){
  const { request: { user_id } } = call;
  try {
    await connection.connect((err) => {
      if (err) throw err;
      const sqlQuery = "SELECT * FROM User WHERE User.user_id = ?";
      const queryValues = [user_id];
      connection.query(sqlQuery, queryValues, (err, result, fields) => {
        if (err) throw err;
        callback(null, result);
      });
    });
  } catch (error) {
    console.error('Error Logging User:', error);
    callback({ code: grpc.status.INTERNAL, details: 'Unable to login user' });
  }
}

module.exports = {
  register,
  forgotPassword,
  resetPassword,
  login,
  getUser
};
