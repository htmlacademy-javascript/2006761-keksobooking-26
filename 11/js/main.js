import './popup.js';
import './form.js';
import './map.js';
import './api.js';
import './utils.js';

import {setEnabledForm, setDisabledForm, letSubmitForm, mapFilterUpdate, letMapFilter} from './form.js';
import {loadMap} from './map.js';

setDisabledForm();
loadMap(() => {
  setEnabledForm();
  letSubmitForm();
  letMapFilter();
  mapFilterUpdate();
});
