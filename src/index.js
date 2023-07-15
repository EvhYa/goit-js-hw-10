import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import '../node_modules/slim-select/dist/slimselect.css';
import Notiflix from 'notiflix';

const breedSelector = document.querySelector('.breed-select');
const loadText = document.querySelector('.loader');
const errText = document.querySelector('.error');
const catContainer = document.querySelector('.cat-info');

axios.defaults.headers.common['x-api-key'] =
  'live_1qt2MrwyWIWTORnnMd2g3Wy8voWAab8a75xO2dqYFn65VBYApYvfXTR32ClMClzv';

fetchBreeds()
  .then(resp => (breedSelector.innerHTML = createSelectors(resp.data)))
  .catch(err => {
    console.log(err);
    Notiflix.Report.failure('Title', 'Message', 'Button Text');
  })
  .finally(
    () =>
      new SlimSelect({
        select: breedSelector,
      })
  );

function createSelectors(arr) {
  return arr
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join('');
}

//відмальовування першої картки з котиком до настання події change
fetchCatByBreed(breedSelector.value)
  .then(resp => {
    loadText.hidden = true;
    return resp.data.find(({ id }) => id === breedSelector.value);
  })
  .then(
    ({ name, description, image: { url } }) =>
      (catContainer.innerHTML = createCatCard(url, name, description))
  )
  .catch(err => {
    console.log(err);
    loadText.hidden = false;
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }) //FIX IT TI BE OKAY EVERYWHERE
  .finally();

breedSelector.addEventListener('change', onSelect);

// відмальовування після події change
function onSelect(evt) {
  //   let catName = evt.currentTarget.selectedOptions[0].textContent;
  loadText.hidden = false;
  catContainer.innerHTML = '';
  fetchCatByBreed(evt.target.value)
    .then(resp => {
      loadText.hidden = true;
      return resp.data.find(({ id }) => id === evt.target.value);
    })
    .then(
      ({ name, description, image: { url } }) =>
        (catContainer.innerHTML = createCatCard(url, name, description))
    )
    .catch(err => {
      console.log(err);
      loadText.hidden = false;
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    })
    .finally();
}

function createCatCard(url, catName, description) {
  return `<img src="${url}" alt="${catName}" class="cat-card">
    <div><h2>${catName}</h2>
  <p>${description}</p></div>`;
}
