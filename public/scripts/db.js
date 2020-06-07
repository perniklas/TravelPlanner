var DB = {
    fs: firebase.firestore(),
    createNewTrip: () => {
        DB.fs.collection('trips').doc(
            Authentication.currentUser.uid + "--" + new Date().toISOString()
        ).set({
            userIDs: [Authentication.currentUser.uid],
            ownerID: Authentication.currentUser.uid,
            title: DB.generateTitle(),
            created: new Date().toISOString()
        }).then(trip => {
            return trip;
        });
    },
    updateTripWithDetails: (tripRef, details, callback = null) => {
        DB.fs.collection("trips").doc(tripRef.id).update({
            start: details.start,
            end: details.end,
            title: details.title
        }).then((trip) => {
            if (callback) callback();
        });
    },
    deleteTrip: (trip) => {
        if (trip && trip.ref) {
            trip.ref.delete();
        }
    },
    addCountryToTrip: (data) => {
        if (!data) return;
        DB.fs.collection('countries').doc(
            Authentication.currentUser.uid + "--" + data.country
        ).set({
            userIDs: DB.currentTrip.data.userIDs,
            ownerID: Authentication.currentUser.uid,
            name: data.country,
            created: new Date().toISOString(),
            tripID: DB.currentTrip.ref.id,
            latlng: {
                lat: data.latlng.lat,
                lng: data.latlng.lng
            }
        }).then(country => {
            console.log(country);
        });
    },
    addCityToCountry: (data) => {
        if (!data) return;
        DB.fs.collection('cities').doc(
            Authentication.currentUser.uid + "--" + data.city
        ).set({
            userIDs: DB.currentTrip.data.userIDs,
            ownerID: Authentication.currentUser.uid,
            name: data.city,
            created: new Date().toISOString(),
            tripID: DB.currentTrip.ref.id,
            latlng: {
                lat: data.latlng.lat,
                lng: data.latlng.lng
            }
        }).then(city => {
            console.log(city);
        });
    },
    addPlaceToCity: (data) => {
        if (!data) return;
        DB.fs.collection('places').doc(
            Authentication.currentUser.uid + "--" + data.place
        ).set({
            userIDs: DB.currentTrip.data.userIDs,
            ownerID: Authentication.currentUser.uid,
            name: data.place,
            created: new Date().toISOString(),
            tripID: DB.currentTrip.ref.id,
            latlng: {
                lat: data.latlng.lat,
                lng: data.latlng.lng
            }
        }).then(place => {
            console.log(place);
        });
    },
    updateTripWithGuests: (tripRef, guests) => {
        if (guests.isArray()){
            DB.fs.collection("trips").doc(tripRef.id).update({
                userIDs: guests
            }).then(trip => {
                console.log('Updated trip with guests ' + guests);
            });
        } else {
            console.log('Guests needs to be an array of IDs');
        }
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
                addMarkersToMap();
                if (callback) callback();
            });
    },
    myTrips: [],
    myTripsData: [],
    tripsListener: null,
    currentTrip: null,
    currentCountry: null,
    currentCity: null,
    currentPlace: null,
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
    },
    getTripByID: id => {
        var match;
        $.each(DB.myTrips, function(index, trip) {
            if (trip.id == id) match = trip;
        });
        return match;
    }
}

function isTitleTaken(title) {
    return DB.myTripsData.includes(title);
}

// let countryName = 'Thecountry';
// let subCollection = DB.fs.collection('trips').doc(
//         DB.currentTrip.ref.id
//     ).collection('countries');
// subCollection.doc(
//     Authentication.currentUser.uid + "--" + countryName
// ).set({
//     userIDs: DB.currentTrip.data.userIDs,
//     ownerID: Authentication.currentUser.uid,
//     title: 'Country name',
//     created: new Date().toISOString()
// }).then(country => {
//     console.log(country)
// });