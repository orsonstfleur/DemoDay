fetch("https://hotels4.p.rapidapi.com/locations/search?locale=en_US&query=new%20york", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": "5ba83f5692msh93df536b99fca65p1acb42jsnfd59783fd79f"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});
