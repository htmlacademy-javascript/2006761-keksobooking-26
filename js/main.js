import './popup.js';
import './form.js';
import './map.js';
import './api.js';
import './utils.js';

import {setEnabledForm, setDisabledForm, letSubmitForm, mapFilterUpdate, letMapFilter} from './form.js';
import {loadMap} from './map.js';
import {getData} from './api.js';

setDisabledForm();
getData((ads) => {
  loadMap(() => {
    setEnabledForm();
    letSubmitForm();
    letMapFilter(ads);
    mapFilterUpdate(ads);
  });
});
