// const apikey = 't4ALhbGNlcVEGVmwY64Y77I5XEGYfZKL';
const apikey = 'KetVcJ0XtgS1bIzmzumKbNV3bj6VMEYm';

var showHide = false;

const showCategorieen = async () => {
  const data = await getAPI(apikey, 'full-overview');
  console.log(data.results.lists);
  let htmlstring_categorie = '';
  for (let cat of data.results.lists) {
    // console.log(cat.list_name_encoded);
    htmlstring_categorie += `<button class="c-categorie__button js-button" id="${cat.list_name_encoded}">${cat.display_name}</button>`;
  }
  document.querySelector('.js-categorie').innerHTML = htmlstring_categorie;
  listenToClickCategorie();
};

const showBooks = async (cat) => {
  const data = await getAPI(apikey, cat);
  console.log(data.results.books);
  let htmlstring_boek = '';
  for (let book of data.results.books) {
    htmlstring_boek += `
	<div class="c-boeken__boek ">
		<span class="c-info">
		  <img
			class="c-cover"
			src="${book.book_image}"
			alt="${book.title}"
		  />
		  <h4>${book.title}</h4>
		  <p class="c-auteur">${book.author}</p>
		  <p>${book.description}</p>
		</span>
		<span>
		  <button class="c-boeken__boek-review js-like">like</button>
		  <button class="c-boeken__boek-review js-dislike">
			dislike
		  </button>
	  </span>
	  </div>`;
    // console.log(
    //   `image: ${book.book_image} \n author: ${book.author} \n title: ${book.title} \n description: ${book.description}`
    // );
  }
  document.querySelector('.js-boek').innerHTML = htmlstring_boek;
};

const listenToClickCategorie = () => {
  const buttons = document.querySelectorAll('.js-button');
  for (const btn of buttons) {
    btn.addEventListener('click', function () {
      const cat = btn.id;
      //   console.log(cat);
      showBooks(cat);
      document.querySelector('.js-categorie').classList.add('o-hide');
      showHide = false;
    });
  }
};

const listenToClickTitle = () => {
  const btn = document.querySelector('.js-open');
  btn.addEventListener('click', function () {
    console.log('helloo');
    if (showHide == false) {
      document.querySelector('.js-categorie').classList.remove('o-hide');
      showHide = true;
    } else if (showHide == true) {
      document.querySelector('.js-categorie').classList.add('o-hide');
      showHide = false;
    }
  });
};

const getData = (endpoint) => {
  return fetch(endpoint)
    .then((r) => r.json())
    .catch((e) => console.error(e));
};

let getAPI = async (key, search) => {
  const data = await getData(
    `https://api.nytimes.com/svc/books/v3/lists/${search}.json?api-key=${key}`
  );
  console.log(data);
  return data;
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('📚');
  showCategorieen();
  showBooks('combined-print-and-e-book-fiction');
  listenToClickTitle();
});
