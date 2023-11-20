const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let imageLoadCount = 5;
let initialLoad = true;
// API key is in ignore file 'constants.js' not committed to repository, be sure to include your own API KEY
//  for the Unsplash API
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${API_KEY}&count=${imageLoadCount}`;


// Check is all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
  if (initialLoad) {
    imageLoadCount = 30;
    initialLoad = false;
  }
}

// helper function for setAttributes
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

// Create Elementsfor links and photos and add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  photosArray.forEach((photo) => {
    // Create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      'href': photo.links.html,
      'target': '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      'src': photo.urls.regular,
      'alt': photo.alt_description,
      'title': photo.alt_description,
    });
    // EventListener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos(photosArray);
  } catch (error) {
    // Catch error here
  }
}

// Check to see if scrolling near bottom of the page, load more photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
})

// On Load
getPhotos();
