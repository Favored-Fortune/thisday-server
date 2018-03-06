'use strict';

var app = app || {};
// TO DO: const __NOAA_TOKEN__= SET TOKEN IN HEROKU

(function(module){
  let weather = {};
  weather.handle= data =>{
    console.log('success', data.results[0].datatype);
    weather.type = data.results[0].datatype;
  };

  weather.fetch = date => {
    let dateIncrease = day => {
      let array = day.split('-');
      let months = {
        '01': 31,
        '02': (array[0]%4 === 0) ? 29 : 28,
        '03': 31,
        '04': 30,
        '05': 31,
        '06': 30,
        '07': 31,
        '08': 31,
        '09': 30,
        '10': 31,
        '11': 30,
        '12': 31
      };
      if(parseInt(array[2]) !== months[array[1]]){
        array[2]++;
      }
      else if(array[1] === '12'){
        array[0]++; array[1] = '01'; array[2] = '01';
      }
      else{ array[1]++; array[2] = '01';
      }
      return array.map(y => y.toString()).map(x => (x.length === 1)? '0'+ x : x).join('-');
    };

    $.getJSON({
      url:`https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=CITY:US530018&startdate=${date}&enddate=${dateIncrease(date)}`,
      headers: {token:__NOAA_TOKEN__}}, data=> {
      weather.data = data.results
        .filter (x => x.station === data.results[0].station)
        .map(x => {
          let out = {};
          out[x.datatype] = x.value;
          return out;
        });
    });
  };
  module.weather = weather;
})(app);
