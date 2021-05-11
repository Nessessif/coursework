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

  M.Modal.init(document.querySelectorAll('.modal'));

  let selects = document.querySelectorAll('select');
  M.FormSelect.init(selects);

  let carousel = document.querySelectorAll('.carousel');
  M.Carousel.init(carousel, {
    fullWidth: true,
    indicators: true
  });


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
          let type = ''
          if (url === '/announcement/getSales/') {
            type = 'sale'
          } else {
            type = 'rent'
          }
          cards.forEach(el => {
            cardHtml += `<div class="card__wrapper-inner col s6">`
            if (type === 'sale') {
              cardHtml += `<div class="card">`
            } else {
              cardHtml += `<div class="card rent__card">`
            }
            cardHtml += `<div class="card-image waves-effect waves-block waves-light">
            <img class="activator card-image" data-imagepreview="{{photos}}" style="min-height: 350px; background-size: cover; background-position: center;">
          </div>
                <div class="card-content">
                  <span class="card-title activator grey-text text-darken-4">`
            if (type === 'sale') {
              cardHtml += 'Продажа'
            } else {
              cardHtml += 'Аренда'
            }
            cardHtml += `<i class="material-icons right">more_vert</i>
                  </span>
  
                  <h5>Цена: ${el.price}</h5>`

            if (type === 'rent') {
              cardHtml += `<p>Срок аренды: ${el.dueDate}</p>`
            }

            cardHtml += `<p>Минск, ${el.street}</p>`
            if (type === 'sale') {
              cardHtml += `<span>${el.roomsCount}</span>`
            } else {
              cardHtml += `<span>${el.typeOfRent}</span>`
            }

            cardHtml += `
                  <span>${el.livingArea}м2</span>
                  <span>${el.floor}/${el.countOfFloors} этаж</span>
                </div>`

            if (type === 'sale') {
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
      if (streetInput.value !== '') {
        myGeocoder = ymaps.geocode(`Беларусь, Минск,  ${streetInput.value}`)
        myGeocoder.then(function (res) {
          myMap.geoObjects.add(res.geoObjects)
        })
      } else {
        myGeocoder.then(function (res) {
          myMap.geoObjects.remove(res.geoObjects)
        });
      }

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
  if (input) {

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

  // editSale


  // let selectValue = document.querySelector('#roomsCount').value
  // let idForSelect = ''
  // // if (selectValue) {
  // let a = selects.getSelectedValues()
  // console.log()
  // let selectLis = document.querySelector('.input-roomsCount .select-wrapper > ul')
  // // document.querySelector('.select-dropdown.dropdown-trigger').addEventListener('click', event => {
  // // console.log(document.querySelector('.input-roomsCount'))
  // // })
  // // console.log(`${value}\n${ids}`)
  // selectLis.childNodes.forEach(el => {
  //   if (selectValue === el.childNodes[0].innerHTML) {
  //     console.log(el.id);
  //     el.classList.add('selected')
  //     // document.querySelector('.select-dropdown.dropdown-trigger').value = selectValue
  //   }
  // })
  // }



  // console.log(document.querySelector('form'));
  // document.querySelector('form').addEventListener('submit', event => {
  //   event.preventDefault();
  //   console.log('winner');
  // })

  const totalAreaRange = document.querySelector('#totalArea.rangeInput');
  if (totalAreaRange) {
    noUiSlider.create(totalAreaRange, {
      start: [1, 300],
      connect: true,
      step: 0.1,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      range: {
        'min': 0,
        'max': 300
      },

    });
  }

  const livingAreaRange = document.querySelector('#livingArea.rangeInput');
  if (livingAreaRange) {
    noUiSlider.create(livingAreaRange, {
      start: [1, 300],
      connect: true,
      step: 0.1,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      range: {
        'min': 0,
        'max': 300
      },

    });
  }

  const kitchenAreaRange = document.querySelector('#kitchenArea.rangeInput');
  if (kitchenAreaRange) {
    noUiSlider.create(kitchenAreaRange, {
      start: [1, 300],
      connect: true,
      step: 0.1,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      range: {
        'min': 0,
        'max': 300
      },

    });
  }

  const priceRange = document.querySelector('#price.rangeInput');
  if (priceRange) {
    noUiSlider.create(priceRange, {
      start: [1, 1000000],
      connect: true,
      step: 1,
      orientation: 'horizontal', // 'horizontal' or 'vertical'
      range: {
        'min': 0,
        'max': 1000000
      },
      format: wNumb({
        decimals: 0
      })

    });
  }

  const cardPreview = document.querySelectorAll('.card-image')
  if (cardPreview) {
    cardPreview.forEach(el => {
      if (el.dataset.imagepreview !== undefined) {
        if (window.location.pathname === '/') {
          el.style.backgroundImage = `url(${el.dataset.imagepreview.split(',')[0]})`
        } else {
          el.style.backgroundImage = `url(${window.location.pathname}/${el.dataset.imagepreview.split(',')[0]})`
        }
      }
    })
  }


  //==============================Filter sales

  function createSalesFilter() {
    let filter = {}

    let roomsCount = document.querySelector('div.input-field select[name=roomsCount]')
    roomsCount = roomsCount.options[roomsCount.selectedIndex].text;
    if (roomsCount !== 'Число комнат') {
      filter.roomsCount = roomsCount;
    }

    filter.totalAreaMin = document.querySelector('div#totalArea div.noUi-handle-lower span').textContent
    filter.totalAreaMax = document.querySelector('div#totalArea div.noUi-handle-upper span').textContent

    filter.livingAreaMin = document.querySelector('div#livingArea div.noUi-handle-lower span').textContent
    filter.livingAreaMax = document.querySelector('div#livingArea div.noUi-handle-upper span').textContent

    filter.kitchenAreaMin = document.querySelector('div#kitchenArea div.noUi-handle-lower span').textContent
    filter.kitchenAreaMax = document.querySelector('div#kitchenArea div.noUi-handle-upper span').textContent

    let typeHouse = document.querySelector('div.input-field select[name=typeHouse]')
    typeHouse = typeHouse.options[typeHouse.selectedIndex].text;
    if (typeHouse !== 'Тип дома') {
      filter.typeHouse = typeHouse;
    }

    let balcony = document.querySelector('div.input-field select[name=balcony]')
    balcony = balcony.options[balcony.selectedIndex].text;
    if (balcony !== 'Балкон') {
      filter.balcony = balcony;
    }

    let ownership = document.querySelector('div.input-field select[name=ownership]')
    ownership = ownership.options[ownership.selectedIndex].text;
    if (ownership !== 'Собственность') {
      filter.ownership = ownership;
    }

    filter.priceMin = document.querySelector('div#price div.noUi-handle-lower span').textContent
    filter.priceMax = document.querySelector('div#price div.noUi-handle-upper span').textContent

    filter.type = document.querySelector('input[name=type]').value

    return filter
  }

  function sendForPagesDataFilter(data, link) {
    let url = link
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
        let type = ''
        let hostname = window.location.pathname.split('/')
        if (hostname[hostname.length - 1] === 'sales') {
          type = 'sale'
        } else {
          type = 'rent'
        }
        cards.forEach(el => {
          cardHtml += `<div class="card__wrapper-inner col s6">`
          if (type === 'sale') {
            cardHtml += `<div class="card">`
          } else {
            cardHtml += `<div class="card rent__card">`
          }
          cardHtml += `<div class="card-image waves-effect waves-block waves-light">
          <img class="activator card-image" data-imagepreview="{{photos}}" style="min-height: 350px; background-size: cover; background-position: center; background-image: url(${hostname[hostname.length - 1]}/${el.photos.toString().split(',')[0]})">
        </div>
              <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">`
          if (type === 'sale') {
            cardHtml += 'Продажа'
          } else {
            cardHtml += 'Аренда'
          }
          cardHtml += `<i class="material-icons right">more_vert</i>
                </span>

                <h5>Цена: ${el.price}</h5>`

          if (type === 'rent') {
            cardHtml += `<p>Срок аренды: ${el.dueDate}</p>`
          }

          cardHtml += `<p>Минск, ${el.street}</p>`
          if (type === 'sale') {
            cardHtml += `<span>${el.roomsCount}</span>`
          } else {
            cardHtml += `<span>${el.typeOfRent}</span>`
          }

          cardHtml += `
                <span>${el.livingArea}м2</span>
                <span>${el.floor}/${el.countOfFloors} этаж</span>
              </div>`

          if (type === 'sale') {
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
        cardGrid.innerHTML = cardHtml
      })
  }

  const announcementFilter = document.querySelector('a.waves-green#announcementFilter')
  announcementFilter.addEventListener('click', (event) => {
    event.preventDefault();
    sendForPagesDataFilter(createSalesFilter(), '/announcement/filter/');
  })

  const announcementSort = document.querySelector('a.waves-green#announcementSort')
  announcementSort.addEventListener('click', (event) => {
    event.preventDefault();
    let sortData = {}
    let sortValue = document.querySelector('div.input-field select[name=sortValue]')
    sortValue = sortValue.options[sortValue.selectedIndex].text;
    sortData.value = sortValue;
    sortData.type = document.querySelector('input[name=type]').value;
    sendForPagesDataFilter(sortData, '/announcement/sort/');
  })



  const announcementSearch = document.querySelector('i#announcementSearch')
  announcementSearch.addEventListener('click', (event) => {
    event.preventDefault();
    let searchData = {}
    let searchValue = document.querySelector('input#searchValue').value
    searchData.value = searchValue;
    searchData.type = document.querySelector('input[name=type]').value;
    sendForPagesDataFilter(searchData, '/announcement/search/');
  })

});