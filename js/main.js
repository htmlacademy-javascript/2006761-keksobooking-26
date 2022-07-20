import './popup.js';
import './form.js';
import './map.js';
import './api.js';

import {setEnabledForm, letSubmitForm} from './form.js';
import {drawMarkers, loadMap} from './map.js';
import {getData} from './api.js';

setEnabledForm();
letSubmitForm();
loadMap();
getData(drawMarkers);
