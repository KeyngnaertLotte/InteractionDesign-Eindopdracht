const apikey = "t4ALhbGNlcVEGVmwY64Y77I5XEGYfZKL"

const getCategorieen = async() =>{
	const data = await getAPI(apikey, "full-overview")
	console.log(data.results.lists)
	for( let cat of data.results.lists){
		console.log(cat.list_name_encoded)
	}
}

const getData =  (endpoint) => {
	return  fetch(endpoint)
		.then((r) => r.json())
		.catch((e) => console.error(e))
}

let getAPI = async (key, search) => {
	const data = await getData(`https://api.nytimes.com/svc/books/v3/lists/${search}.json?api-key=${key}`)
	console.log(data)
	return data
};


document.addEventListener('DOMContentLoaded', function(){
    console.log("📚")
	getCategorieen()
})