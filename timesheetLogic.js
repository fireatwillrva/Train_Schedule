// Initialize Firebase
var config = {
  apiKey: "AIzaSyC9RPDBZDnBtbFnpDFzp4gCv6t_65ndfl4",
  authDomain: "train-times-212dd.firebaseapp.com",
  databaseURL: "https://train-times-212dd.firebaseio.com",
  projectId: "train-times-212dd",
  storageBucket: "",
  messagingSenderId: "130386372834"
};
firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // Initial Values
    var name = "";
    var destination = "";
    var frequency = "";
    var arrivalTime = "";
    var minutesAway = "";

    // Capture Button Click
    $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      // Grabbed values from text boxes
      name = $("#train-name-input").val().trim();
      destination = $("#destination-input").val().trim();
      arrivalTime = $("#time-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      // Code for handling the push
      database.ref().push({
        name: name,
        destination: destination,
        arrivalTime: arrivalTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    });

    // Firebase watcher + initial loader + order/limit HINT: .on("child_added"
    database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();
        // Console.loging the last user's data
        console.log(sv.name);
        console.log(sv.destination);
        console.log(sv.arrivalTime);
        console.log(sv.frequency);

        // TIME
        // ------------------------------------------------------------------------

          // Assumptions
        var tFrequency = sv.frequency;

        // Time is 3:30 AM
        var firstTime = sv.arrivalTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));
        var nextTrainArrival = (moment(nextTrain).format("hh:mm A"));
        // -----------------------------------------------------------------------

        // Generate data in table
        var tableRow =
             `
             <tr>
                 <th scope="row">${sv.name}</th>
                 <td>${sv.destination}</td>
                 <td>${sv.frequency}</td>
                 <td>${nextTrainArrival}</td>
                <td>${tMinutesTillTrain}</td>
             </tr>
             `
             $('tbody').append(tableRow);

        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

      