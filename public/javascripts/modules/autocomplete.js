// This function adds the Google Maps autocomplete to 'input'
// And sets latInput and lngInput to the correct lat and lng values
// When a user selects a place

function autocomplete(input, latInput, lngInput) {
  // Skip running if no input on page
  if (!input) return;

  // Make new google maps autocomplete dropdown on field 'input'
  const dropdown = new google.maps.places.Autocomplete(input);

  // Add event listener for 'place_changed' which fires when a new place is selected
  // getPlace() returns object with data about the place
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });

  // If someone hits enter on the address field, prevent submit
  // keyCode 13 == "Enter"
  input.on('keydown', (e) => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

export default autocomplete;
