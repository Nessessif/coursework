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

});