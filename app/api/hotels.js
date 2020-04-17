// const fetch = require('node-fetch')
// function search(location){
//   fetch(`https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=${encodeURI(location)}`, {
//     "method": "GET",
//     "headers": {
//       "x-rapidapi-host": "hotels4.p.rapidapi.com",
//       "x-rapidapi-key": "5ba83f5692msh93df536b99fca65p1acb42jsnfd59783fd79f"
//     }
//   })
//   .then(response => {
//     // console.log(response.json());
//     return response.json()
//   }).then(json => {
//     console.log("HOTELS",json.suggestions[3].entities);
//     return json
//   })
//   .catch(err => {
//     console.log(err);
//   });
// }
//
// module.exports = {
//   'search' : search
// }
// let results = search('boston')
// console.log("results",results);
