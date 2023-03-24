import debounce from 'lodash.debounce';
import createList from './templates/list.hbs';
import createCountry from './templates/country.hbs';
import { Notify } from 'notiflix';
import './css/styles.css';

import {fetchCountries} from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputForm = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const cleanMarkup = el => (el.innerHTML = '');

const inputHandler = e => {
  const inputQuery = e.target.value.trim();

  if (!inputQuery) {
    cleanMarkup(countryList);
    cleanMarkup(countryInfo);
    return;
  }

  fetchCountries(inputQuery)
    .then(data => {
      console.log(data);
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      cleanMarkup(countryList);
      cleanMarkup(countryInfo);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = data => {
  if (data.length === 1) {
    cleanMarkup(countryList);
    const markupInfo = createCountry(data);
    countryInfo.innerHTML = markupInfo;
  } else {
    cleanMarkup(countryInfo);
    const markupList = createList(data);
    countryList.innerHTML = markupList;
  }
};

inputForm.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
