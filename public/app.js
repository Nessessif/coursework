document.addEventListener('DOMContentLoaded', function () {
  const streetInput = document.querySelector('input#street')
  var instance = M.Tabs.init(document.querySelectorAll('.tabs'));

  // var element = document.querySelector('input[type="tel"]');
  // var maskOptions = {
  //   mask: '+375 (00) 000-00-00',
  // };
  // IMask(element, maskOptions);

  var drop = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(drop);

  var selects = document.querySelectorAll('select');
  M.FormSelect.init(selects);

  let streetInstance = M.Autocomplete.init(streetInput, {
    data: {}
  });

  if (streetInput) {

    streetInput.addEventListener('input', (e) => {
      ymaps.suggest(`Беларусь, Минск, ${e.target.value}`, { results: 5 }).then(function (items) {
        const newObj = Array.from(items, x => x.value)
        const streets = []
        const re = /(Беларусь, Минск, )|( улица )|( улица)|(улица )/g;
        for (let i = 0; i < newObj.length; i++) {
          streets.push(newObj[i].replace(re, '').trim())
        }
        streetInstance.updateData(Object.assign(...streets.map((k, i) => ({
          [k]: null
        }))));
      })
    })


    ymaps.ready(function () {
      var myMap = new ymaps.Map('YMapsID', {
        center: [53.9, 27.56],
        zoom: 11,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
      });

      var myGeocoder = ymaps.geocode('Беларусь, Минск ')
      myGeocoder.then(function (res) {
        myMap.geoObjects.remove(res.geoObjects)
      });

      streetInput.addEventListener('blur', (e) => {
        myGeocoder.then(function (res) {
          myMap.geoObjects.remove(res.geoObjects)
        })

        if (e.target.value !== '') {

          myGeocoder = ymaps.geocode(`Беларусь, Минск,  ${e.target.value}`)

          myGeocoder.then(function (res) {
            myMap.geoObjects.add(res.geoObjects)
          })
        }
      }, true)
    });
  }

  //==================================== Photos preview 

  const input = document.querySelector('input#photos');
  const preview = document.querySelector('div#preview');

  // input.style.opacity = 0;

  input.addEventListener('change', updateImageDisplay);

  function updateImageDisplay() {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }

    const curFiles = input.files;
    if (curFiles.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      const list = document.createElement('ol');
      preview.appendChild(list);

      for (const file of curFiles) {
        const listItem = document.createElement('li');
        const para = document.createElement('p');

        if (validFileType(file)) {
          para.textContent = `File name ${file.name}, file size ${returnFileSize(file.size)}.`;
          const image = document.createElement('img');


          image.src = URL.createObjectURL(file);

          image.style.height = "100px";

          listItem.appendChild(image);
          listItem.appendChild(para);
        } else {
          para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
    }
  }

  const fileTypes = [
    'image/apng',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
    `image/x-icon`
  ];

  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + 'bytes';
    } else if (number > 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + 'KB';
    } else if (number > 1048576) {
      return (number / 1048576).toFixed(1) + 'MB';
    }
  }

  //========================================

});