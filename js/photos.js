const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const DEFAULT_PHOTO = 'img/muffin-grey.svg';

const fileAddAvatar = document.querySelector('.ad-form__field input[type=file]');
const fileAddPreview = document.querySelector('.ad-form__upload input[type=file]');
const previewAvatar = document.querySelector('.ad-form-header__preview img');
const previewPhoto = document.querySelector('.ad-form__photo');
const previewPhotoContainer = document.querySelector('.ad-form__photo-container');

fileAddPreview.addEventListener('change', () => {
  const file = fileAddPreview.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    if (previewPhoto.childNodes.length === 0) {
      const pictureElement = `<img src='${URL.createObjectURL(file)}' class="ad-form__photo-preview" title="Фотография жилья">`;
      previewPhoto.insertAdjacentHTML('beforeend', pictureElement);
    } else {
      const previewPhotoElement = previewPhoto.cloneNode(true);
      const imageElement = previewPhotoElement.querySelector('img');
      imageElement.src = URL.createObjectURL(file);
      previewPhotoContainer.append(previewPhotoElement);
    }
  }
});

fileAddAvatar.addEventListener('change', () =>
{
  const file = fileAddAvatar.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewAvatar.src = URL.createObjectURL(file);
  }
});

const resetPicture = () => {
  if (previewAvatar.src === DEFAULT_PHOTO) {
    return true;
  } else {
    previewAvatar.src = DEFAULT_PHOTO;
  }
  const previewPhotoItem = previewPhoto.childNodes;
  if (previewPhotoItem.length === 0) {
    return true;
  } else {
    const previewAllElements =  previewPhotoContainer.querySelectorAll('.ad-form__photo');
    previewAllElements.forEach((element, index) => index === 0 ? element.firstChild.remove() : element.remove());
  }
};

export {resetPicture};
