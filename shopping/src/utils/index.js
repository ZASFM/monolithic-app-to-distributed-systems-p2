const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios=require('axios');
const amqplib=require('amqplib');
const { v4: uuid4 } = require('uuid');


const { APP_SECRET,MESSAGE_BROKER_URL,EXCHANGE_NAME, SHOPPING_BINDING_KEY, QUEUE_NAME } = require("../config");

let amqplibConnection = null;
//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get("Authorization");
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//we wont longer be using proxy with app-events to communicate within services, since we switch to the message broker rabbitMQ provides:
/* module.exports.PublishCustomerEvent=async(payload)=>{
  await axios.post('http://localhost:8000/customer/app-events',{payload});
} */

//message broker:
//messsage broker:
//creating a channel

const getChannel = async () => {
  if (amqplibConnection === null) {
     amqplibConnection = await amqplib.connect(MESSAGE_BROKER_URL);
  }
  return await amqplibConnection.createChannel();
}

module.exports.CreateChannel=async()=>{
  try{
     const channel=await getChannel();
     await channel.assertExchange(EXCHANGE_NAME,'direct',false);
     return channel;
  }catch(err){
   console.log(err);
  }
}

//publish message
module.exports.PublishMessage=async(channel,binding_key,message)=>{
 try{  
   await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
 }catch(err){
   console.log(err);
 }
}

//subscribe message:
module.exports.SubscribeMessage=async(channel,service)=>{
 try{ 
   const appQueue=await channel.assertQueue(QUEUE_NAME);
   channel.bindQueue(appQueue.queue,EXCHANGE_NAME,SHOPPING_BINDING_KEY);
   channel.consume(appQueue.queue,data=>{
     console.log('data recieved');
     service.SubscribeEvents(data.content.toString());
     console.log(data.content.toString());
     channel.ack(data);
   })
 }catch(err){
   console.log(err);
 }
}

//not required since this service is only gonna make rpc requests to the products service and wont respond to an calls
//if we recieved any rpc call it will monitor it and send back some data
/* const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
  const channel = await getChannel();
  //once its delivered it will go away
  await channel.assertQueue(RPC_QUEUE_NAME, {
     durable: false
  });
  //number of unawknowledged messages
  channel.prefetch(1);
  //any message that comes by the queue name, it will trigger the async function
  channel.consume(RPC_QUEUE_NAME, async (msg) => {
     if (msg.content) {
        //DB operation
        const payload = JSON.parse(msg.content.toString());
        const response = { fakeResponse, payload }//call fake db operation
        //sending back some response, to a specific call and queue that gets defined by the correlation id
        channel.sendToQueue(
           msg.properties.replayTo,
           Buffer.from(JSON.stringify(response)),
           {
              correlation: msg.properties.correlationId
           }
        )
        channel.ack(msg)
     }
  },
     {
        noAck: false
     }
  )
} */

const requestData = async (queue_name, payload, id) => {
  const channel = getChannel();
  //I want exclusivly this channel to recieve the incoming data:
  const q = await channel.assertQueue('', { exclusive: false });

  //sending it to the queue name
  channel.sentToQueue(queue_name, JSON.stringify(payload), {
     replayTo: q.queue,
     correlationId: id
  });

  //checking if we are able to reviebe the response
  return new Promise((resolve, reject) => {
     //closing channel after 8 seconds:
     const timeout = setTimeout(() => {
        channel.close();
     }, 8000)
     //we have already sent to request, now we are waiting for the response with .consume
     channel.consume(q.queue, (msg) => {
        if (msg.correlationId === id) {
           resolve(JSON.parse(msg.content.toString()));
           //clearing timeout if im getting back a response
           clearTimeout(timeout);
        } else {
           reject('Message not found');
        }
     }, {
        noAck: true
     })
  })
}

//send request to other services:
module.exports.RPCRequest = async (RPC_QUEUE_NAME, payload) => {
  const uuid = uuid4()//correlationId, every request has a unique one
  return requestData(RPC_QUEUE_NAME, payload, uuid)
}

module.exports = {
  getChannel,
  RPCObserver,
  RPCRequest
}