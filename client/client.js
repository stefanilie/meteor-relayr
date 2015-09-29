Sounds = new Mongo.Collection('sounds');
Meteor.subscribe('soundsPublications');

Luminosity = new Mongo.Collection('luminosities')
Color = new Mongo.Collection('colors')
Proximity = new Mongo.Collection('proximities')
Meteor.subscribe('luminosityPublications');
Meteor.subscribe('colorPublications');
Meteor.subscribe('proximitiesPublications');


Temperatures = new Mongo.Collection('temperatures');
Humidity = new Mongo.Collection('humidities');
Meteor.subscribe('tempPublications');
Meteor.subscribe('humidPublications');

GroupID = ""
Created = false;

Template.body.helpers({
  luminosities: function() {
    return Luminosity.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  },
  colors: function() {
    return Color.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  },
  proximities: function() {
    return Proximity.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  },
  sounds: function() {
    return Sounds.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  },
  temperatures: function() {
    return Temperatures.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  },
  humidities: function() {
    return Humidity.find({}, {
      sort: {
        _id: -1
      },
      limit: 1
    })
  }
})


Template.grabData.events({
  'click #ciorba': function(event) {
    // increment the counter when button is clicked
    // var deviceID = document.getElementById("deviceID").value
    // var applicationID = document.getElementById("applicationID").value
    // var applicationToken = document.getElementById("applicationToken").value
    // var readingType = document.getElementById("selectReadingType").value
    var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d"
    var applicationID = "a683462a-9b29-453d-ab58-ef96293c70e4"
      // var deviceID = "85fa69d0-8bb5-4400-94ea-ede7f960ca64"
    var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV"
    var htu = "85fa69d0-8bb5-4400-94ea-ede7f960ca64";
    var snd = "038d8561-5e1e-43ac-b504-48df027a1d9e";
    var lcp = "abe08fa7-c70d-4831-80fb-27fbfb2e1005";
    var queryType = document.getElementById("selectReadingType").value;
    console.log("Ai ales: " + queryType);
    switch (queryType) {
      case "TEMP":
        Meteor.call('authenticate', token, clientID, queryType, htu, function(err, result) {
          console.log(result)
        });
        document.getElementById("div-sounds").style.visibility = "hidden"
        document.getElementById("div-lcp").style.visibility = "hidden"
        document.getElementById("div-temperatures").style.visibility = "visible"
        break;
      case "SND":
        Meteor.call('authenticate', token, clientID, queryType, snd, function(err, result) {
          console.log(result)
        });
        document.getElementById("div-sounds").style.visibility = "visible"
        document.getElementById("div-lcp").style.visibility = "hidden"
        document.getElementById("div-temperatures").style.visibility = "hidden"
        break;
      case "LIGH":
        Meteor.call('authenticate', token, clientID, queryType, lcp, function(err, result) {
          console.log(result)
        });
        document.getElementById("div-sounds").style.visibility = "hidden"
        document.getElementById("div-lcp").style.visibility = "visible"
        document.getElementById("div-temperatures").style.visibility = "hidden"
        break;
      case "ALL":
        var ids = {
          htu: htu,
          snd: snd,
          lcp: lcp
        };
        Meteor.call('authenticate', token, clientID, queryType, ids, function(err, result) {
          console.log(result);
        });
        document.getElementById("div-sounds").style.visibility = "visible"
        document.getElementById("div-lcp").style.visibility = "visible"
        document.getElementById("div-temperatures").style.visibility = "visible"
        break;
    }
  },
  'click .closeConnection': function(event) {
    var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV"
    var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d"
    Meteor.call('close_connection', token, clientID, function(err, result) {
      console.log(result)
    });
  },

  'click #group': function(event) {
    var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d";
    var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV";
    if (!Created) {
      Meteor.call('group', token, clientID, function(err, results) {
        if (!err) {
          console.log(results['data']);
          results = results['data'];
          GroupID = results['id'];
          console.log("ID:" + GroupID);
          alert("Group with credentials created:\n" + "id: " + results['id'] + "\n name: " + results['name'] + "\nowner: " + results['owner']);
        }
      })
      Created = true;
      document.getElementById('group').innerHTML = "Group info";
    } else {
      Meteor.call('getGroup', token, clientID, GroupID, function(err, results) {
        if(!err){
          console.log(results);
        }
      });
    }
  },
  'click #deleteGroups': function(event) {
    try {
      console.log("trying to delete groups");
      var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d";
      var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV";
      Meteor.call('deleteGroups', token, clientID, function(err, results) {
        if (!err) {
          console.log(results);
          alert("Deleted all groups!")
          document.getElementById('group').innerHTML = "1. Create group";
        }
      });
    } catch (e) {
      console.log(e);
    }
  },
  'click #additems': function(event) {
    var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d";
    var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV";
    var deviceIDs = {
      "tempSensor1": "85fa69d0-8bb5-4400-94ea-ede7f960ca64",
      "tempSensor2": "ddd458cd-b6d0-4f2f-a370-a988a3a69e40"
    }
    var wunderbar1 = "1e76f397-c940-4f88-a439-cfb4c950329d";
    var wunderbar2 = "a5f161f5-21fb-4602-99b4-46c9e06a0e02";

    Meteor.call('additems', token, deviceIDs, clientID, GroupID, function(err, results) {
      if (!err) {
        console.log(results);
        alert("devices added successfully");
      }
    })
  },
  'click #history': function(event){
    var clientID = "1e76f397-c940-4f88-a439-cfb4c950329d";
    var token = "1.t.wrb-k1N3hc5AR8uClh0elTZO-5HV";
    Meteor.call('history', token, clientID, GroupID, function(err, results){
      if(!err){
        console.log(results);
      }
    });
  },
  'click #SAPLoad': function(event) {
    console.log("SAP");
    try {
      var xhr = new XMLHttpRequest()
      xhr.open('POST', 'http://10.157.128.43:8000/sap/bc/soap/rfc?sap-client=600', true, encodeURIComponent('RFCMOBILE'), encodeURIComponent('mobile'));
      xhr.withCredentials = true;
      xhr.setRequestHeader("Content-Type", "text/xml");

    } catch (e) {
      console.log(e);
    }
    // Meteor.call('upload_to_sap', function(err, result){
    // });
  }
});
