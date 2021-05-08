document.addEventListener('DOMContentLoaded', function () {
  const streetInput = document.querySelector('input#street')
  const pagination = document.querySelector('#pagination')

  // let element = document.querySelector('input[type="tel"]');
  // let maskOptions = {
  //   mask: '+375 (00) 000-00-00',
  // };
  // IMask(element, maskOptions);

  M.Tabs.init(document.querySelectorAll('.tabs'));
  let drop = document.querySelectorAll('.dropdown-trigger');
  M.Dropdown.init(drop);

  let selects = document.querySelectorAll('select');
  M.FormSelect.init(selects);

  let carousel = document.querySelectorAll('.carousel');
  M.Carousel.init(carousel);

  let streetInstance = M.Autocomplete.init(streetInput, {
    data: {}
  });

  if (pagination) {
    const pages = pagination.dataset.pages;
    if (pages > 1) {
      let paginationElement = `<li class="disabled"><a href="#"><i class="material-icons">chevron_left</i></a></li>
      <li class="active" data-pagenumber="1"><a href="">1</a></li>`;
      for (let i = 2; i <= pages && i <= 9; i++) {
        paginationElement = paginationElement + `<li class="waves-effect" data-pagenumber="${i}"><a href="">${i}</a></li>`
      }
      paginationElement = paginationElement + `<li class="waves-effect"><a href="#"><i class="material-icons">chevron_right</i></a></li>`
      pagination.innerHTML = paginationElement;
    }

    pagination.addEventListener('click', (event) => {
      event.preventDefault()
      document.querySelectorAll('#pagination > li').forEach(el => {
        el.classList.remove('active');
      })
      event.target.parentNode.classList.add('active');
      const data = {
        page: event.target.parentNode.dataset.pagenumber,
      }
      fetch('/announcement/getSales/', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json(data))
        .then((cards) => {
          // const cardGrid = document.querySelector('.card__wrapper')
          // let cards = ''
          // cards.forEach(el => {
          //   cards += `<div class="card__wrapper-inner col s6">
          //     <div class="card sticky-action" style="overflow: hidden;">
          //       <div class="card-image waves-effect waves-block waves-light ">
          //         <img class="activator" src="https://global-uploads.webflow.com/5ef5480befd392489dacf544/5f9f5e5943de7e69a1339242_5f44a7398c0cdf460857e744_img-image.jpeg">
          //       </div>
          //       <div class="card-content">
          //         <span class="card-title activator grey-text text-darken-4">
          //           Продажа
          //           <i class="material-icons right">more_vert</i>
          //         </span>

          //         <p>Минск, ${el.street}</p>
          //         <span>${el.roomsCount}</span>
          //         <span>${el.livingArea} м2</span>
          //         <span>${el.floor}/${el.countOfFloors} этаж</span>

          //         <p><a href="#">Позвонить</a></p>
          //       </div>

          //       <div class="card-action">
          //         <a href="#">Перейти к объявлению</a>
          //       </div>

          //       <div class="card-reveal" style="display: block; transform: translateY(-100%);">
          //         <span class="card-title grey-text text-darken-4">Описание<i class="material-icons right">close</i></span>
          //         <p>${el.description}</p>
          //       </div>
          //     </div>
          //   </div>`
          // })
          // cardGrid.innerHTML = cards
        })
    })
  }





















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
      let myMap = new ymaps.Map('YMapsID', {
        center: [53.9, 27.56],
        zoom: 11,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
      });

      let myGeocoder = ymaps.geocode('Беларусь, Минск ')
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

  // let input = document.querySelector('input ');
  // let preview = document.querySelector('.preview');

  // input.style.opacity = 0;

});