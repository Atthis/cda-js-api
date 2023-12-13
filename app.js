const imgsContainer = document.querySelector('#images-container');

function readableDate(date) {
  return `${date.substring(date.length - 2, date.length)}/${date.substring(5, 7)}/${date.substring(0, 4)}`;
}

const getAPIKey = async () => {
  const response = await fetch('./apiKey.json').then(res => res.json());
  const key = await response.nasaAPIKey;
  return key;
};

const photoFetch = async () => {
  return getAPIKey()
    .then(key => {
      const photoData = Promise.all([
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=3000&page=1&api_key=${key}`).then(res => res.json()),
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=3500&page=1&api_key=${key}`).then(res => res.json()),
      ]);
      return photoData;
    })
    .then(photoData => photoData.flatMap(el => el.photos));
};

try {
  photoFetch().then(data => {
    data.forEach(image => {
      const imgContainer = document.createElement('article');
      imgContainer.style.width = '30%';

      const img = document.createElement('img');
      img.src = image.img_src;
      img.setAttribute('alt', `curiosity photo from ${image.camera.name} camera on ${image.sol} sol`);
      img.style.width = '100%';

      const imgInfos = document.createElement('ul');
      imgInfos.innerHTML = `
            <li>Earth Date: ${readableDate(image.earth_date)}</li>
            <li>Sol: ${image.sol}</li>
            <li>Camera: ${image.camera.name}</li>`;

      imgContainer.append(img, imgInfos);

      imgsContainer.appendChild(imgContainer);
    });
  });
} catch (err) {
  console.log(err);
}
