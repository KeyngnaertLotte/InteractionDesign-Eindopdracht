const apikey = 't4ALhbGNlcVEGVmwY64Y77I5XEGYfZKL';
const apikey2 = 'KetVcJ0XtgS1bIzmzumKbNV3bj6VMEYm';
const apikey3 = 'c6XgkGJdU2oEmV2ymCc64ukAP1eLpjn2';

// const lanIP = `${window.location.hostname}:5500`;
const backend_IP = 'http://localhost:5000';
const backend = backend_IP + '/api/v1';
const socketio = io(backend_IP);

var showHide = false;
var chart = '';
var cats = [];
var books = [];

const showCategorieen = async () => {
  const data = await getAPI(apikey, 'full-overview');
  // console.log(data.results.lists);
  let htmlstring_categorie = '';
  for (let cat of data.results.lists) {
    cats.push(`${cat.list_name_encoded}`);
    // console.log(cat);
    htmlstring_categorie += `<button class="c-categorie__button js-button" id="${cat.list_name_encoded}">${cat.display_name}</button>`;
  }
  document.querySelector('.js-categorie').innerHTML = htmlstring_categorie;
  listenToClickCategorie();
  getAllLikes();
  
};

const showBooks = async (cat) => {
  if (cat != 'Home') {
    document.querySelector('.js-boek').classList.remove('o-hide-boeken');
    document.querySelector('.js-grafiek').classList.add('o-hide-boeken');
    const data = await getAPI(apikey2, cat);
    // console.log(data.results.books);
    books = [];
    let htmlstring_boek = '';
    for (let book of data.results.books) {
      books.push(book)
      const isbn = book.primary_isbn13;
      const title = book.title;
      socketio.emit('F2B_get_likes', { isbn_nr: isbn, name: title, categorie: cat });

      htmlstring_boek += `
	<div class="c-boeken__boek">
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
    <span class="c-voting" id="${book.primary_isbn13}">
              <ul class="o-list" ">
              <li> 
                  <input
                    class="o-hide-accessible c-option"
                    type="radio"
                    name="${book.primary_isbn13}"
                    id="${book.primary_isbn13}_1"
                  />
                  <label for="${book.primary_isbn13}_1"  class="c-option__symbol js-likeOrDislike">
                    <svg
                      class="c-option__symbol--svg"
                      version="1.1"
                      id="Layer_2"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 50 50"
                      style="enable-background: new 0 0 50 50"
                      xml:space="preserve"
                    >
                      <path
                        class="c-svg c-thumbs_up"
                        d="M43.8,21.6c0.3,0.3,0.4,1.1,0.4,1.1l0.1,5.1l-6,14.1c0,0-0.8,1.3-1.3,1.6c-0.3,0.2-1.7,0.3-1.7,0.3l-29.8,0
	V21.2h8.8L27.3,7.7c0,0,1.2-1.4,1.4-1.5c0.5-0.3,0.1,2.2,0.1,2.2l-2.7,12.7h16.8C42.9,21.2,43.6,21.3,43.8,21.6z M14.4,43.8V21.2
	V43.8z"
                      />
                    </svg>
                    <!-- <img src="./img/svg/thumb_up.svg" alt=""> -->
                  </label>
                  <p class="js-like" >123</p> 
                </li>
                <li>
                  <input
                    class="o-hide-accessible c-option"
                    type="radio"
                    name="${book.primary_isbn13}"
                    id="${book.primary_isbn13}_2"
                  />
                  <label for="${book.primary_isbn13}_2"  class="c-option__symbol js-likeOrDislike">
                    <svg
                      class="c-option__symbol--svg"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 50 50"
                      style="enable-background: new 0 0 50 50"
                      xml:space="preserve"
                    >
                      <path
                        class="c-svg c-thumbs_down"
                        d="M6.1,28.5c-0.3-0.3-0.4-1.1-0.4-1.1l-0.1-5.1l6-14.1c0,0,0.8-1.3,1.3-1.6c0.2-0.2,1.7-0.3,1.7-0.3h29.8v22.6
	h-8.8L22.7,42.2c0,0-1.2,1.4-1.4,1.5c-0.5,0.3-0.1-2.2-0.1-2.2l2.7-12.7H7.1C7.1,28.9,6.4,28.6,6.1,28.5z M35.6,6.2v22.6V6.2z"
                      />
                    </svg>
                  </label>
                  <p class="js-dislike" >123</p>
                </li>
              </ul>
              <div class="line js-line" ></div>
            </span>
	  </span>
	  </div>`;
      // console.log(
      //   `image: ${book.book_image} \n author: ${book.author} \n title: ${book.title} \n description: ${book.description}`
      // );
    }
    document.querySelector('.js-boek').innerHTML = htmlstring_boek;
    listenToClickDislike();
    
    booksPerCat(cat)
  } else {
    document.querySelector('.js-boek').classList.add('o-hide-boeken');
    document.querySelector('.js-grafiek').classList.remove('o-hide-boeken');
  }
};

socketio.on('B2F_showLikes', function (message) {
  // console.log(message)
  const boek = document.getElementById(message.Id);
  // console.log(boek)
  boek.querySelector('.js-like').innerHTML = message.Likes;
  boek.querySelector('.js-dislike').innerHTML = message.Dislikes;
  // console.log(message.Likes + message.Dislikes)
  const tot = message.Likes + message.Dislikes;
  var percent = Math.round((100 / tot) * message.Likes);
  // console.log(percent)

  const line = boek.querySelector('.line');
  if (isNaN(percent)) {
    line.style.setProperty('--likes-width', `100%`);
    line.style.setProperty('--likes-color', `gray`);
  } else {
    line.style.setProperty('--likes-width', `${percent}%`);
  }
});

const booksPerCat = function(cat){
  console.log(cat)
  console.log(books)  
  // primary_isbn13
  for(let i = 0; i < books.length; i++){
    console.log(books[i].primary_isbn13)
    socketio.emit('F2B_add_categorie', { isbn_nr: books[i].primary_isbn13, categorie: cat});
  }
}

const listenToClickCategorie = () => {
  const buttons = document.querySelectorAll('.js-button');
  for (const btn of buttons) {
    btn.addEventListener('click', function () {
      const cat = btn.id;
      console.log('dit is de button:  ' + btn.innerHTML);
      document.querySelector('.js-open').innerHTML = btn.innerHTML;
      showBooks(cat);
      document.querySelector('.js-hide').classList.add('o-hide');
      showHide = false;
      document.getElementById(cat).style.backgroundColor = '#cb997eed';
      document.getElementById(cat).style.color = '#fff';
      const btns = document.querySelectorAll('.js-button');
      for (let i of btns) {
        if (cat != i.id) {
          document.getElementById(i.id).style.backgroundColor = 'transparent';
          document.getElementById(i.id).style.color = 'black';
        }
      }
    });
  }
};

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('Verbonden met socket webserver');
  });
};

const listenToClickDislike = () => {
  const radiobtn = document.querySelectorAll('.js-likeOrDislike');
  for (const like of radiobtn) {
    like.addEventListener('click', async function () {
      const book = like.getAttribute('for');
      const likeDislike = book.slice(-1);
      const bookisbn13 = book.substring(0, book.length - 2);

      if (likeDislike == 1) {
        socketio.emit('F2B_add_like', { isbn_nr: bookisbn13 });
        socketio.emit('F2B_update_likes', { isbn_nr: bookisbn13 });
      } else if (likeDislike == 2) {
        socketio.emit('F2B_add_dislike', { isbn_nr: bookisbn13 });
        socketio.emit('F2B_update_likes', { isbn_nr: bookisbn13 });
      }
    });
  }
};

const listenToClickTitle = () => {
  const btn = document.querySelector('.js-open');
  btn.addEventListener('click', function () {
    // console.log('helloo');
    if (showHide == false) {
      document.querySelector('.js-hide').classList.remove('o-hide');
      showHide = true;
    } else if (showHide == true) {
      document.querySelector('.js-hide').classList.add('o-hide');
      showHide = false;
    }
  });
};

const getAllLikes = function () {
  handleData(backend + `/top/`, generateGraphData);
};




const generateGraphData = async (jsonobject) => {
  // console.log(jsonobject);
  // console.log(cats);
  
  for (let x = 0; x < 10; x++) {
    // console.log(cats[x])
    // const books = await getAPI(apikey3, cats[x]);
    // console.log(books);
  }
  // console.log(jsonobject.length)
  const labels = [];
  const data = [];
  for (let i = 0; i < 10; i++) {
    labels[i] = jsonobject[i].BookName;
    data[i] = jsonobject[i].Likes;
  }
  // console.log(labels, data)
  init(labels, data);
};

const init = function (labels, data) {
  const ctx = document.querySelector('.js-graph');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: `# visitors per day`,
          data: data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          ticks: {
              display: false
         }
      }
      },
    },
  });

  if (chart) {
    // console.log(chart);
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;

    return chart.update();
  }
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
  // console.log(data);
  return data;
};

let getAPIAll = async (key, isbn) => {
  const data = await getData(
    `https://api.nytimes.com/svc/books/v3/reviews.json?isbn=${isbn}&api-key=${key}`
  );
  // console.log(data);
  return data;
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('📚');
  showCategorieen();
  showBooks('Home');
  listenToClickTitle();
  listenToSocket();
  // getAllLikes();
  // generateGraphData();
});
