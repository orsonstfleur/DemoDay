console.log("loading detail.js");

document.querySelector("#submitComment").addEventListener('click', (e) =>{
  console.log("submitComment");
  e.preventDefault()
  let placeId = document.querySelector('#placeId').getAttribute('data-placeid')
  let userName = document.querySelector('#userName').getAttribute('data-username')
  let comments = document.querySelector('#comments').value
  console.log("comments", placeId,comments);
  fetch('/hotels/posts', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'place_id': placeId,
      'comments': comments,
      'username':userName
    })
  })
  .then(response => {
    console.log(response);
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
 });
//
//
console.log("loading detail.js");

document.querySelector("#addToFav").addEventListener('click', (e) =>{
  console.log("submitComment");
  e.preventDefault()
  let placeId = document.querySelector('#placeId').getAttribute('data-placeid')
  let userName = document.querySelector('#userName').getAttribute('data-username')
  fetch('/addToFav', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'favorites': placeId,
      'username':userName
    })
  })
  .then(response => {
    console.log(response);
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
 });
