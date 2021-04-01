import PahoMQTT from "paho-mqtt"

let client = {}

export default {
  initConnect(id, topic, callback) {
        /*
    * ========PahoMQTT.Client=======
    *   param1: host
    *   param2: port
    *   param3: path
    *   param3: clientId
    *
    * */
    client = new PahoMQTT.Client('121.40.33.108', 15675, "/ws", "myclientid_" + parseInt(Math.random() * 100, 10))
    // let clientId = "bin"
    // client = new PahoMQTT.Client('121.40.33.108', 15675, "/ws", clientId)

    client.onConnectionLost = function (responseObject) {
      console.log("断开连接 - " + responseObject.errorMessage);
    };
    client.onMessageArrived = function (message) {
      console.log("收到来自主题 " + message.destinationName + "的消息, PAYLOAD:  " + message.payloadString);
      callback(message.topic, message.payloadString)
    };

    /*options:
              timeout:"number",
              userName:"string",
              password:"string",
              willMessage:"object",
              keepAliveInterval:"number",
              cleanSession:"boolean",
              useSSL:"boolean",
              invocationContext:"object",
              onSuccess:"function",
              onFailure:"function",
              hosts:"object",
              ports:"object",
              reconnect:"boolean",
              mqttVersion:"number",
              mqttVersionExplicit:"boolean",
              uris: "object"*/
    var options = {
      timeout: 60,  //seconds
      keepAliveInterval: 30,  //seconds
      userName: "guest",
      password: "xidian",
      reconnect: true,
      onSuccess: function () {
        console.log("连接成功");
        client.subscribe(topic, {qos: 0,
          onSuccess: function (res) {
            console.log("订阅成功!, 订阅主题为: ",topic)
          },
          onFailure: function (err) {
            console.log("订阅失败!, " + err)
          }
        });
      },
      onFailure: function (message) {
        console.log("连接失败 - " + message.errorMessage);
      }
    };
    if (location.protocol == "https:") {
      options.useSSL = true;
    }
    // debug("CONNECT TO " + wsbroker + ":" + wsport);

    client.connect(options)
  },


  /**
   * publish message
   *    (topic,payload,qos,retained)
   *
   */
  publish(topic, message) {
    client.send(topic, JSON.stringify(message), 0)
  }
}


