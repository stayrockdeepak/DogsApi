const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const res = await checkStatus(response);
    return res.json();
  } catch (error) {
    return console.error('Looks like there was a problem!', error);
  }
}

Promise.all([
  fetchData('https://dog.ceo/api/breeds/list'),
  fetchData('https://dog.ceo/api/breeds/image/random')  
])
.then(([breedsData, randomImageData]) => {
  const breedList = breedsData.message;
  const randomImage = randomImageData.message;
  
  generateOptions(breedList);
  generateImage(randomImage);
})
.catch(error => console.error('Error fetching data:', error));

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function generateOptions(data) {
  const options = data.map(item => `<option value='${item}'>${item}</option>`).join('');
  select.innerHTML = options;
}

function generateImage(data) {
  card.innerHTML = `
    <img src='${data}'>
    <button>Click to view images of ${select.value}s</button>
  `;
}

function fetchBreedImage() {
  const breed = select.value;
  fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(data => {
      const img = card.querySelector('img');
      const p = card.querySelector('p');
      img.src = data.message;
      img.alt = breed;
      button.textContent = `Click to view more ${breed}s`;
    })
    .catch(error => console.error('Error fetching breed image:', error));
}

select.addEventListener('change', fetchBreedImage);
card.addEventListener('click', fetchBreedImage);