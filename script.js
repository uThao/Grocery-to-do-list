const $ = document.querySelector.bind(document),
      $$ = document.querySelectorAll.bind(document),
      section = $('section'),  ///section
      inputCheckbox = $('form #inputCheckbox'), ///input
      inputCheckboxMargin = inputCheckbox.offsetLeft,
      form = $('#grocery--form'),  ///form
      submitBtn = $('form #submitBtn'),  ///button
      list = $('#list'),  ///list
      alertStatus = $('div#alert'), ///alert
      deleteAllBtn = $('#clear') ///btn clear all

let   editFlag = false, 
      editID,
      id = ``,
      editElement

    // preSetting
submitBtn.style.height = inputCheckbox.offsetHeight + 'px'
    // alertFunction
function displayAlert(msg, stt) {
    alertStatus.textContent = msg
    alertStatus.classList.add(stt, 'alert')
    alertStatus.style.animation = `slide ease 3s forwards, fade ease-in 1s forwards`
        // autoRemoveAlert
    setTimeout(function () {
        alertStatus.textContent = ``
        alertStatus.classList.remove(stt, 'alert')
    }, 3000)
}

// caseAdd
function showSuccessAlert() {
    displayAlert('Add Item Successfully', 'alert--add')
}
// caseDelete
function showDeleteAlert() {
    displayAlert('Delete Item Successfully', 'alert--delete')
}
// caseWarning
function showWarningAlert() {
    displayAlert('Please select a valid', 'alert--warning')
}
// caseEdit
function showEditAlert() {
    displayAlert('Edit Item Successfully', 'alert--edit')
}
// caseEmty
function showEmtyListAlert() {
    displayAlert('Emty List', 'alert--emty')
}

// delete all items function
function deleteAllItems() {
    const items = $$('article.new--article')
    deleteAllBtn.style.visibility = 'hidden'
    section.style.height = `28vh`
    items.forEach(function(item) {
        list.removeChild(item)
    })
    showEmtyListAlert()
    localStorage.clear()
}
//delete one item fuction
function deleteItem(e) {
    if(list.children.length == 1)
        deleteAllBtn.style.visibility = 'hidden'
        // logic
    const targetElement = e.target.parentElement.parentElement
    console.log(e.currentTarget,targetElement,targetElement.dataset.id)
    list.removeChild(targetElement)
        // remove from local storage
    removeFromLocalStorage(targetElement.dataset.id)
    showDeleteAlert()
    setBack()
}
// edit function
function editItem(e) {
    editElement = e.currentTarget.parentElement.parentElement
    editFlag = true
    submitBtn.textContent = `Edit`
    inputCheckbox.value = editElement.children[1].textContent
}

// set back to Default
function setBack() {
    inputCheckbox.value = ``
    id.value = ``
    editFlag = false
    submitBtn.textContent = `Submit`
}

// add item to local storage
function addToLocalStorage(id, value) {
    let items = localStorage.getItem('items')
    ? JSON.parse(localStorage.getItem('items'))
    : []
    items.push({id, value}) 
    localStorage.setItem('items', JSON.stringify(items))
}
// remove item to local storage
function removeFromLocalStorage(idDelete) {
    const items = JSON.parse(localStorage.getItem('items'))
    const itemRemain = items.filter(item => {
        return item.id !== idDelete
    })
    localStorage.setItem('items', JSON.stringify(itemRemain))
}
// edit item from local storage
function editFromLocalStorage(idEdit) {
    const items = JSON.parse(localStorage.getItem('items'))
    const itemEdit = items.map(item => {
        console.log(item.id, item.value)
        // can rebuild logic
        if(item.id === idEdit)  
            return {id: item.id, value: inputCheckbox.value}
        else 
            return {id: item.id, value: item.value} 
    })
    localStorage.setItem('items', JSON.stringify(itemEdit))
}

// slide down for more info 
function slideDown(e) {
    const item = e.currentTarget.nextElementSibling
    if($$('.item.hidden').length == 0) {
        item.classList.add('hidden')
    }
    else {
        switch($('.item.hidden') !== item) {
            case true: {
                $$('.item.hidden').forEach(item => {
                    item.classList.remove('hidden')  
                })
                item.classList.add('hidden')
            }
            case false: {
                item.classList.remove('hidden')
            }
        }
    }
    item.style.transition = `all ease 0.36s`
}

//load onstock item from local storage
(function loadItemFromLocalStorage() {
    const items = JSON.parse(localStorage.getItem('items'))
    if(items) {
        items.forEach(item => {
            const newArticle = document.createElement('article')
            newArticle.innerHTML =  `
                        <span class="item">${item.value}</span>
                        <span class="icon">
                            <i class="fa-solid fa-pen-to-square fa-sm btn--edit"></i>
                            <i class="fa-solid fa-rectangle-xmark fa-sm btn--delete"></i>
                        </span>
                `
            newArticle.classList.add('new--article')
            newArticle.style.margin = `12px 36px`
            section.style.transition = 'all ease 0.25s'
            deleteAllBtn.style.visibility = 'visible'
            newArticle.setAttribute('data-id', item.id)
            ///add Article
            list.appendChild(newArticle)
                // add event listeners to clear btn
            $$('.btn--delete').forEach((btn) => {
                btn.addEventListener('click', deleteItem)
            })
                // add event listeners to edit btn
            $$('.btn--edit').forEach((btn) => {
                btn.addEventListener('click', editItem)
            })
            $$('.slide').forEach((btn) => {
                btn.addEventListener('click', slideDown)
            section.style.transition = 'all ease 0.25s'
            })
        })
    }
    form.addEventListener('submit', submit)
    deleteAllBtn.addEventListener('click', deleteAllItems)
}) ()

// submitFuntion
function submit(e) {
        // default 
    e.preventDefault()
    let value = inputCheckbox.value
    let code = new Date().getTime() 
        // edit input
    if(editFlag && value) {
        editElement.children[1].textContent = inputCheckbox.value 
        showEditAlert()
        editFromLocalStorage(editElement.dataset.id)
        setBack()
    }
        // submit input
    else if(!editFlag && value) {  
        const newArticle = document.createElement('article')
        newArticle.innerHTML =  `
                    <div class="slide">
                        <i class="fa-solid fa-circle-up fa-rotate-90 fa-sm"></i>
                    </div>
                    <span class="item">${value}</span>
                    <span class="icon">
                        <i class="fa-solid fa-pen-to-square fa-sm btn--edit"></i>
                        <i class="fa-solid fa-rectangle-xmark fa-sm btn--delete"></i>
                    </span>
            `
            // setting
        newArticle.classList.add('new--article')
        newArticle.style.margin = `12px ${inputCheckboxMargin}px`
        deleteAllBtn.style.visibility = 'visible'
        ///showSuccessAlert
        showSuccessAlert()
            ///assign ID
        let id = document.createAttribute('data-id')
        id.value = code
        newArticle.setAttributeNode(id)
        ///add to Local Storage
        addToLocalStorage(id.value, value)
        ///add Article
        list.appendChild(newArticle)
        section.style.height = `fit-content`
        // add event listeners to clear btn
        $$('.btn--delete').forEach((btn) => {
            btn.addEventListener('click', deleteItem)
        })
        // add event listeners to edit btn
        $$('.btn--edit').forEach((btn) => {
            btn.addEventListener('click', editItem)
        })
        $$('.slide').forEach((btn) => {
            btn.addEventListener('click', slideDown)
        })
        // set back to default 
        setBack()
    }   
    // oops
    else {
        showWarningAlert()
    }
}

const preloader = $('#preloader')
window.onload = function () {
    preloader.classList.add('hide')
}