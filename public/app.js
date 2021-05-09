document.addEventListener('DOMContentLoaded', function () {
  const streetInput = document.querySelector('input#street')
  const pagination = document.querySelector('#pagination')
  const countOnPage = document.querySelector('#countOnPage')

  let element = document.querySelector('input[type="tel"]');
  if (element) {
    let maskOptions = {
      mask: '+375 (00) 000-00-00',
    };
    IMask(element, maskOptions);
  }

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
    let pages = pagination.dataset.pages;
    if (pages > 1) {
      let paginationElement = `<li class="disabled arrow left-arrow"><a href="#"><i class="material-icons">chevron_left</i></a></li>
      <li class="waves-effect active page__number" data-pagenumber="1"><a href="">1</a></li>`;
      for (let i = 2; i <= pages; i++) {
        paginationElement = paginationElement + `<li class="waves-effect page__number" data-pagenumber="${i}"><a href="">${i}</a></li>`
      }
      paginationElement = paginationElement + `<li class="waves-effect arrow right-arrow"><a href="#"><i class="material-icons">chevron_right</i></a></li>`
      pagination.innerHTML = paginationElement;
    }
    let currentPage = 1

    let currentCountOnPage = countOnPage.value
    let newCountOnPage = currentCountOnPage
    countOnPage.addEventListener('change', event => {
      newCountOnPage = event.target.value
      let newPages;
      if (+newCountOnPage === 16) {
        currentPage = Math.ceil(currentPage / 2)
        newPages = Math.ceil(pages / 2)
      } else {
        currentPage = currentPage * 2 - 1
        newPages = pagination.dataset.otherpages
      }
      renderNewPagination(currentPage, newPages)
      sendForPagesData({
        skip: currentPage,
        count: +newCountOnPage
      })
    })

    pagination.addEventListener('click', (event) => {
      event.preventDefault()
      let currentEvent = event.target.parentNode
      const paginationPages = document.querySelectorAll('#pagination > li')
      if (currentEvent.tagName !== 'A' && !currentEvent.classList.contains('arrow')) {
        paginationPages.forEach(el => {
          el.classList.remove('active');
        })
        currentEvent.classList.add('active');
        currentPage = parseInt(event.target.parentNode.dataset.pagenumber)
        editPages('1')
      } else {
        if (currentEvent.parentNode.classList.contains('right-arrow')) {
          if (currentPage < pages) {
            currentPage++
            for (let i = 1; i < paginationPages.length - 1; i++) {
              if (paginationPages[i].classList.contains('active')) {
                paginationPages[i].classList.remove('active')
                i++
                paginationPages[i].classList.add('active')
              }
              editPages(currentPage)
            }
          }
        } else {
          if (currentPage > 1) {
            currentPage--
            for (let i = 1; i < paginationPages.length - 1; i++) {
              if (paginationPages[i].classList.contains('active')) {
                paginationPages[i].classList.remove('active')
                paginationPages[i - 1].classList.add('active')
              }
              editPages(currentPage)
            }
          }
        }
      }

      // console.log({
      //   skip: currentPage,
      //   count: +currentCountOnPage
      // })
      sendForPagesData({
        skip: currentPage,
        count: +currentCountOnPage
      })

      function editPages(page) {
        if (currentEvent.dataset.pagenumber !== '1' && page !== 1) {
          pagination.firstChild.classList.remove('disabled')
          pagination.firstChild.classList.add('waves-effect')
        } else {
          pagination.firstChild.classList.remove('waves-effect')
          pagination.firstChild.classList.add('disabled')
        }
        if (currentEvent.dataset.pagenumber !== pages.toString() && page.toString() !== pages.toString()) {
          pagination.lastChild.classList.remove('disabled')
          pagination.lastChild.classList.add('waves-effect')
        } else {
          pagination.lastChild.classList.remove('waves-effect')
          pagination.lastChild.classList.add('disabled')
        }
      }

    })

    function renderNewPagination(currentPage, newPages) {
      pagination.dataset.otherpages = pages;
      pagination.dataset.pages = newPages;
      pages = newPages;
      if (pages > 1) {
        let paginationElement = `<li class="disabled arrow left-arrow"><a href="#"><i class="material-icons">chevron_left</i></a></li>`
        for (let i = 1; i <= newPages; i++) {
          if (i === +currentPage) {
            paginationElement = paginationElement + `<li class="active waves-effect page__number" data-pagenumber="${i}"><a href="">${i}</a></li>`
          } else {
            paginationElement = paginationElement + `<li class="waves-effect page__number" data-pagenumber="${i}"><a href="">${i}</a></li>`
          }
        }
        paginationElement = paginationElement + `<li class="waves-effect arrow right-arrow"><a href="#"><i class="material-icons">chevron_right</i></a></li>`
        pagination.innerHTML = paginationElement;
      }
    }

    function sendForPagesData(data) {
      let url
      if (!document.querySelector('.rent__card')) {
        url = '/announcement/getSales/'
      } else {
        url = '/announcement/getRents/'
      }
      fetch(url, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json(data))
        .then((cards) => {
          const cardGrid = document.querySelector('.card__wrapper')
          let cardHtml = ''
          cards.forEach(el => {
            cardHtml += `<div class="card__wrapper-inner col s6">`
            if (url === '/announcement/getSales/') {
              cardHtml += `<div class="card">`
            } else {
              cardHtml += `<div class="card rent__card">`
            }
            cardHtml += `<div class="card-image waves-effect waves-block waves-light ">
                  <img class="activator" src="https://global-uploads.webflow.com/5ef5480befd392489dacf544/5f9f5e5943de7e69a1339242_5f44a7398c0cdf460857e744_img-image.jpeg">
                </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">`
            if (url === '/announcement/getSales/') {
              cardHtml += 'Продажа'
            } else {
              cardHtml += 'Аренда'
            }
            cardHtml += `<i class="material-icons right">more_vert</i>
                  </span>
  
                  <p>Минск, ${el.street}</p>
                  <span>${el.roomsCount}</span>
                  <span>${el.livingArea} м2</span>
                  <span>${el.floor}/${el.countOfFloors} этаж</span>
  
                  <p><a href="tel:">Позвонить</a></p>
                </div>
  
                `

            if (url === '/announcement/getSales/') {
              cardHtml += `<div class="card-action">
                    <a href="/announcement/sale/${el._id}">Перейти к объявлению</a>
                  </div>`
            } else {
              cardHtml += `<div class="card-action">
              <a href="/announcement/rents/${el._id}">Перейти к объявлению</a>
            </div>`
            }
            cardHtml += `<div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">Описание<i class="material-icons right">close</i></span>
                  <p>${el.description}</p>
                </div>
              </div>
            </div>`
          })
          // console.log(cardHtml);
          cardGrid.innerHTML = cardHtml
        })
    }
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