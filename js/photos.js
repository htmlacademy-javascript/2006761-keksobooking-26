const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const DEFAULT_PHOTO = 'img/muffin-grey.svg';

const fileAddAvatarElement = document.querySelector('.ad-form__field input[type=file]');
const fileAddPreviewElement = document.querySelector('.ad-form__upload input[type=file]');
const previewAvatarElement = document.querySelector('.ad-form-header__preview img');
const previewPhotoElement = document.querySelector('.ad-form__photo');
const previewPhotoContainerElement = document.querySelector('.ad-form__photo-container');

fileAddPreviewElement.addEventListener('change', () => {
  const file = fileAddPreviewElement.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    if (previewPhotoElement.childNodes.length === 0) {
      const pictureElement = `<img src='${URL.createObjectURL(file)}' class="ad-form__photo-preview" title="Фотография жилья">`;
      previewPhotoElement.insertAdjacentHTML('beforeend', pictureElement);
    } else {
      const previewPhoto = previewPhotoElement.cloneNode(true);
      const imageElement = previewPhoto.querySelector('img');
      imageElement.src = URL.createObjectURL(file);
      previewPhotoContainerElement.append(previewPhotoElement);
    }
  }
});

fileAddAvatarElement.addEventListener('change', () =>
{
  const file = fileAddAvatarElement.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    previewAvatarElement.src = URL.createObjectURL(file);
  }
});

const resetPicture = () => {
  if (previewAvatarElement.src !== DEFAULT_PHOTO) {
    previewAvatarElement.src = DEFAULT_PHOTO;
  }
  const previewPhotoItem = previewPhotoElement.childNodes;
  if (previewPhotoItem.length !== 0) {
    const previewAllElements =  previewPhotoContainerElement.querySelectorAll('.ad-form__photo');
    previewAllElements.forEach((element, index) => index === 0 ? element.firstChild.remove() : element.remove());
  }
  return true;
};

export {resetPicture};
