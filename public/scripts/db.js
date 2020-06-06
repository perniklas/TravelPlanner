var DB = {
    fs: firebase.firestore(),
    createNewTrip: () => {
        DB.fs.collection('trips').doc(
            Authentication.currentUser.uid +
            "--" + new Date().toISOString()
        ).set({
            userIDs: [Authentication.currentUser.uid],
            ownerID: Authentication.currentUser.uid,
            title: DB.generateTitle(),
            created: new Date().toISOString()
        });
    },
    updateTripWithDetails: (tripRef, details) => {
        DB.fs.collection("trips").doc(tripRef.id).update({
            start: details.start,
            end: details.end,
            title: details.title
        });
    },
    deleteTrip: (trip) => {
        if (trip && trip.ref) {
            trip.ref.delete();
        }
    },
    addCountryToTrip: () => {

    },
    addCityToCountry: () => {

    },
    addPlaceToCity: () => {

    },
    updateTripWithGuests: (tripRef, guests) => {
        DB.fs.collection("trips").doc(tripRef.id).update({
            userIDs: guests
        });
    },
    getMyTrips: (callback = null) =>  {
        DB.tripsListener = DB.fs.collection("trips")
            .where("ownerID", "==", Authentication.currentUser.uid)
            .onSnapshot(snap =>  {
                DB.myTrips = [];
                DB.myTripsData = [];
                snap.forEach(trip => {
                    DB.myTrips.push(trip);
                    DB.myTripsData.push(trip.data());
                });

                addTripsToSidebar();
                if (callback) callback();
            });
    },
    myTrips: [],
    myTripsData: [],
    tripsListener: null,
    closeTripsListener: () => {
        if (DB.tripsListener) DB.tripsListener();
    },
    generateTitle: () => {
        let title = 'My trip #';
        let length = DB.myTripsData.length + 1;
        while (isTitleTaken(title + length)) {
            length += 1;
        }
        return title + length;
    }
}

function isTitleTaken(title) {
    return DB.myTripsData.includes(title);
}

function getTripByID(id) {
    var match;
    $.each(DB.myTrips, function(index, trip) {
        if (trip.id == id) match = trip;
    });
    return match;
}