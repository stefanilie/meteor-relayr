// TODO: delete the following groups:
//72cca882-77a8-4061-b3ca-df68b72643af
//1e71f90c-fff3-4ebc-9ca0-2db81d6158d9
//4d7f7985-1826-4697-ae43-88c7554c4a8b
//ea554fec-600b-4919-9547-59d940ebb0fc
//51f54a87-1552-4321-b741-6aa859d15d5b
//7fa44dc4-e75b-4b15-8e10-15cfe7b50688
//85f33a7c-2c14-4713-8d54-8ed7538d3c6e
//9436a03b-e50a-4bbb-a2b8-f0cdbebed96c
//805467f3-0b93-4ce0-a67f-05122b642c9f
//e33d6e81-1d9c-4ec0-9895-e22ce4befe7b
//fcf5c4a4-b09b-4f28-b50c-0892626fe07a

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
    console.log('incercam sa group');
    Meteor.call('group', token, clientID, function(err, result) {
      if (!err) {
        console.log(result);
        // GroupID = JSON.parse(result)['id'];
        console.log("Group with credentials created:\n" + "id: " + result['id'] + "\n name: " + result['name'] + "\nowner: " + result['owner']);
      }
    })
  },

  'click #additems': function(event) {
    var deviceIDs = {
      "tempSensor1": "85fa69d0-8bb5-4400-94ea-ede7f960ca64",
      "tempSensor2": "ddd458cd-b6d0-4f2f-a370-a988a3a69e40"
    }
    var wunderbar1 = "1e76f397-c940-4f88-a439-cfb4c950329d";
    var wunderbar2 = "a5f161f5-21fb-4602-99b4-46c9e06a0e02";

    Meteor.call('additems', token, deviceIDs, GroupID, function(err, result) {
      if (!err) {
        console.log(result);
        alert("devices added successfully");
      }
    })
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
