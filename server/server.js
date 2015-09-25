//Setting up Collections and publishes
Sounds = new Mongo.Collection('sounds')

Temperatures = new Mongo.Collection('temperatures')
Humidity = new Mongo.Collection('humidities')

Luminosity = new Mongo.Collection('luminosities')
Color = new Mongo.Collection('colors')
Proximity = new Mongo.Collection('proximities')

//These are the methods that syncronise all the data collected in the 'authenticate'
//method to the client.
Meteor.publish('luminosityPublications', function() {
  return Luminosity.find({});
});
Meteor.publish('colorPublications', function() {
  return Color.find({});
});
Meteor.publish('proximitiesPublications', function() {
  return Proximity.find({});
});

Meteor.publish('tempPublications', function() {
  return Temperatures.find({});
});
Meteor.publish('humidPublications', function() {
  return Humidity.find({});
});

Meteor.publish('soundsPublications', function() {
  return Sounds.find({});
})

//Initializing new relayr object
Relayr = Meteor.npmRequire('relayr')
relayr = new Relayr();
stopData = false;

Meteor.methods({
  'authenticate': function(applicationToken, clientID, queryType, deviceID) {
    console.log(stopData);
    if (!stopData) {
      //Authenticating with API Key and ClientID
      relayr.connect(applicationToken, clientID);
      relayr.user(applicationToken, function(err, user) {
        console.log(err || user);
      })

      //If the user wants to get data from all the devices.
      if (queryType == "ALL") {
        relayr.deviceModel(applicationToken, deviceID.htu, function(err, description) {
          console.log("-------------- Temperature & Humidity --------------------");
          console.log(err || description);
          console.log("----------------------------------------------------------");
        });
        relayr.deviceModel(applicationToken, deviceID.snd, function(err, description) {
          console.log("-------------- Sound Level -------------------------------");
          console.log(err || description);
          console.log("----------------------------------------------------------");
        });
        relayr.deviceModel(applicationToken, deviceID.lcp, function(err, description) {
          console.log("-------------- Light, Color & Proximity ------------------");
          console.log(err || description);
          console.log("----------------------------------------------------------");
        });

        relayr.connect(applicationToken, deviceID.htu);
        relayr.connect(applicationToken, deviceID.snd);
        relayr.connect(applicationToken, deviceID.lcp);
        //or just one
      } else {
        relayr.deviceModel(applicationToken, deviceID, function(err, description) {
          console.log("--------------------- Sensor details ---------------------");
          console.log(err || description);
          console.log("----------------------------------------------------------");
        });
        relayr.connect(applicationToken, deviceID);
      }
      var soundsInit = true;
      var lightInit = true;
      var tempInit = true;
      var latestValue;
      relayr.on('connect', function() {});

      //The troubble-maker.
      //I am using Meteor.bindEnvironment() because all data comes async,
      //and if I don't use this, it will crash with this:
      //Meteor code must always run within a fiber.
      relayr.on('data', Meteor.bindEnvironment(function(topic, msg) {
        if (!stopData) {
          //Parsing the data. If it's 1 than it's sound, 2 than temperature, 3 then light
          console.log(msg['readings']);
          switch (msg['readings'].length) {

            //Sound
            case 1:
              if (!Sounds.findOne({})) {
                //if element
                Sounds.insert({
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  findme: 1,
                  recorded: msg['readings'][0]['recorded']
                }, Meteor.bindEnvironment(function(error, result) {
                  console.log("Item inserted in Sounds");
                }));
              } else {
                Sounds.update({
                  findMe: 1
                }, {
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  recorded: msg['readings'][0]['recorded']
                });
                console.log("updated sound");
              }
              latestValue = msg['readings']
              break;

              //Temperature

              //Temperature sensor
            case 2:
              if (!Temperatures.findOne({})) {
                Temperatures.insert({
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  findMe: 0,
                  recorded: msg['readings'][0]['recorded']
                }, Meteor.bindEnvironment(function(error, result) {
                  console.log("Item inserted in Temperatures");
                }));
              } else {
                Temperatures.update({
                  findMe: 0
                }, {
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  findMe: 0,
                  recorded: msg['readings'][0]['recorded']
                }, Meteor.bindEnvironment(function(error, result) {
                  console.log("Item updated in Temperatures");
                }));
                console.log("updated temperature");
              }
              if (!Humidity.findOne({})) {
                Humidity.insert({
                  meaning: msg['readings'][1]['meaning'],
                  value: msg['readings'][1]['value'],
                  recorded: msg['readings'][1]['recorded'],
                  findMe: 1
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item inserted in Humidity");
                }));
              } else {
                Humidity.update({
                  findMe: 1
                }, {
                  meaning: msg['readings'][1]['meaning'],
                  value: msg['readings'][1]['value'],
                  findMe: 1,
                  recorded: msg['readings'][1]['recorded']
                }, Meteor.bindEnvironment(function(error, result) {
                  console.log("Item updated in humidity");
                }));
                console.log("updated humididy");
              }
              latestValue = msg['readings']
              break;

              //Light, color, proximity

              //Light sensor
            case 3:
              if (!Luminosity.findOne({})) {
                Luminosity.insert({
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  recorded: msg['readings'][0]['recorded'],
                  findMe: 0
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item inserted in Lights");
                }));
              } else {
                Luminosity.update({
                  findMe: 0
                }, {
                  meaning: msg['readings'][0]['meaning'],
                  value: msg['readings'][0]['value'],
                  recorded: msg['readings'][0]['recorded'],
                  findMe: 0
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item updated in luminosity");
                }));
                // console.log("\nupdated luminosity");
              }
              if (!Color.findOne({})) {
                Color.insert({
                  meaning: msg['readings'][1]['meaning'],
                  value: JSON.stringify(msg['readings'][1]['value']),
                  recorded: msg['readings'][1]['recorded'],
                  findMe: 1
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item inserted in Lights");
                }));
                // console.log(JSON.parse(msg['readings'][1]['value']));
              } else {
                Color.update({
                  findMe: 1
                }, {
                  meaning: msg['readings'][1]['meaning'],
                  value: JSON.stringify(msg['readings'][1]['value']),
                  recorded: msg['readings'][1]['recorded'],
                  findMe: 1
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item updated in color");
                }));
                // console.log(JSON.parse(msg['readings'][1]['value']));
                console.log("\nupdated color");
              }
              if (!Proximity.findOne({})) {
                Proximity.insert({
                  meaning: msg['readings'][2]['meaning'],
                  value: msg['readings'][2]['value'],
                  recorded: msg['readings'][2]['recorded'],
                  findMe: 2
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item inserted in Lights");
                }));
              } else {
                Proximity.update({
                  findMe: 2
                }, {
                  meaning: msg['readings'][2]['meaning'],
                  value: msg['readings'][2]['value'],
                  recorded: msg['readings'][2]['recorded'],
                  findMe: 2
                }, Meteor.bindEnvironment(function(error, result) {
                  // console.log("Item updated in proximity");
                }));
                // console.log("\nupdated proximity");
              }
              latestValue = msg['readings']
              break;
            default:
              console.log(msg);
          }
          return latestValue;
        }
      }));
    } else {
      stopData = false;
    }
  },

  'close_connection': function(token, clientID) {
    // var Relayr = Meteor.npmRequire('relayr')
    // var relayr = new Relayr();
    //
    // //Authenticating with API Key and ClientID
    // relayr.connect(token, clientID);
    stopData = true;
    return "Connection successfully closed. Bye bye!";
  },
  'group': function(token, clientID) {
    var toReturn;
    HTTP.call('POST', 'https://api.relayr.io/groups', {
      headers: {
        "Authorization": "Bearer 1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV",
        "Content-Type": 'application/json'
      },
      data: {
        "name": "MyGroup 01",
      }
    }, function(err, result) {
      if (!err) {
        // console.log(result);
        console.log(result['data']);
        toReturn = result['data'];
      }
    });
    return toReturn;
  },
  'additems': function(token, deviceIDs, GroupID) {
    var results={};
    HTTP.call('POST', 'https://api.relayr.io/groups/'+GroupID+'/devices/'+deviceIDs['tempSensor1'], {
      headers: {
        "Authorization": "Bearer 1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV",
        "Content-Type": 'application/json'
      },
    }, function(err, result) {
      if (!err) {
        console.log(result);
        results['temp1'] = result;
      } else {
        console.log(err);
        return err;
      }
    })
    HTTP.call('POST', 'https://api.relayr.io/groups/'+GroupID+'/devices/'+deviceIDs['tempSensor2'], {
      headers: {
        "Authorization": "Bearer 1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV",
        "Content-Type": 'application/json'
      },
    }, function(err, result) {
      if (!err) {
        console.log(result);
        results['temp2'] = result;
      } else {
        console.log(err);
        return err;
      }
    })
    return results;
  },
  'upload_to_sap': function() {
    // HTTP.call('POST', 'http://10.157.128.43:8000/sap/bc/soap/rfc?sap-client=600', {
    //   headers: {
    //     "Content-Type": "text/xml"
    //   },
    //   params: {
    //     "withCredentials": true,
    //   },
    //   auth: encodeURIComponent('RFCMOBILE')+':'+encodeURIComponent('mobile')
    // }, function(error, result){
    //   if(!error){
    //     console.log(result);
    //   }
    //   else{
    //     console.log(error);
    //   }
    // })
  }
});

function loginSAP() {}
