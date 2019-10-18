window.addEventListener('load', () => {

  let long;
  let lat;
  let temperatureEl = document.querySelector('.temperature-degree');
  let tempSummaryEl = document.querySelector('.temperature-description');
  let cityChoiceEl = document.querySelector('.city-choice');
  let timeZoneEl = document.querySelector('.timezone');
  let tempSection = document.querySelector('.temperature-section');
  let tempMark = document.querySelector('.deg');
  let globalFar;
  const weatherApiKey = config.WEATHER_API;
  const googleApiKey = config.GOOGLE_API;
  const cors = 'https://cors-anywhere.herokuapp.com/';


  navigator.geolocation.getCurrentPosition((pos) => {
    long = pos.coords.longitude;
    lat = pos.coords.latitude;


    const cors = 'https://cors-anywhere.herokuapp.com/';
    const weatherApi = `${cors}https://api.darksky.net/forecast/${weatherApiKey}/${lat},${long}`;
    const reverseLocation = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleApiKey}`;

    fetch(reverseLocation)
      .then(location => {
        return location.json()
      }).then(result => {
        const locationCity = result.results[4].formatted_address;
        cityChoiceEl.textContent = locationCity;

      })

    fetch(weatherApi)
      .then(data => {
        return data.json()
      })
      .then(result => {
        const temp = result.currently.temperature;
        const tempDec = Math.round(temp * 10) / 10;
        const summary = result.currently.summary;
        const timeZone = result.timezone;
        const icons = result.currently.icon;
        globalFar = result.currently.temperature;

        //Set Dom Elements
        temperatureEl.textContent = tempDec;
        tempSummaryEl.textContent = summary;
        timeZoneEl.textContent = timeZone;
        // Set Icons 
        setIcons(icons, document.querySelector('.icon'));

      });



    //Listen For Change Location Change
    document.getElementById('getWeather').addEventListener('click', (event) => {

      event.preventDefault();


      const inputEl = document.getElementById('city-search').value;
      const summary = document.querySelector('.temperature-description');
      const location = document.querySelector('.city-choice');
      const timeZone = document.querySelector('.timezone');
      const temp = document.querySelector('.temperature-degree');
      const degSign = document.querySelector('.deg');
      let tempSection = document.querySelector('.temperature-section');



      const geoLocationCall = `https://maps.googleapis.com/maps/api/geocode/json?address=${inputEl}&key=${googleApiKey}`;



      fetch(geoLocationCall)
        .then(data => {
          console.log(data)
          return data.json()
        })
        .then(result => {
          const lat = result.results[0].geometry.location.lat;
          const lng = result.results[0].geometry.location.lng;
          const cors = 'https://cors-anywhere.herokuapp.com/';
          const weatherApi = `${cors}https://api.darksky.net/forecast/${weatherApiKey}/${lat},${lng}`;

          //Set City Name
          location.textContent = result.results[0].formatted_address;

          fetch(weatherApi)
            .then(data => {
              console.log(data);
              return data.json();
            })
            .then(result => {
              console.log(result);
              const tempData = result.currently.temperature;
              const iconData = result.currently.icon;
              const summaryData = result.currently.summary;
              const timeZoneData = result.timezone;
              globalFar = result.currently.temperature



              //Set Attributes
              timeZone.textContent = timeZoneData;
              summary.textContent = summaryData;
              temp.textContent = tempData;

              //Set Icon 
              setIcons(iconData, document.querySelector('.icon'));

            })
        })

    });

    //Listen for Click on celcius/fareheit

    tempSection.addEventListener('click', (event) => {

      event.preventDefault();

      console.log(globalFar)

      if (tempMark.textContent === "F") {
        console.log(globalFar);
        const cel = toggleFarenheit(globalFar);
        temperatureEl.textContent = cel;
        tempMark.textContent = "C";

      } else {

        tempMark.textContent = "F"
        temperatureEl.textContent = globalFar;


      }

    })


  });



}); //end of window.load

//Functions
const setIcons = (icons, iconId) => {
  const skycons = new Skycons({
    "color": "white"
  });

  const currentIcon = icons.replace(/-/g, "_").toUpperCase();
  skycons.play()
  console.log(Skycons)

  return skycons.add(iconId, Skycons[currentIcon]);
}

const toggleFarenheit = (currentFar) => {

  const cel = (currentFar - 32) * 5 / 9;
  const rounded = Math.round(cel * 10) / 10;
  return rounded;

}