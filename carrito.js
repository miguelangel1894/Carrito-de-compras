const $items = document.getElementById("items")
const $cards = document.getElementById('cards')
const $footer = document.getElementById('footer')
const $templateCard = document.getElementById("template-card").content
const $templateFooter = document.getElementById("template-footer").content
const $templateCarrito = document.getElementById("template-carrito").content
const $fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
})
$items.addEventListener('click',e =>{
    addCarrito(e)
})

const fetchData = async () => {
    try {
        let res = await fetch('api.json')
        let api = await res.json()
        console.log(api)
        pintarCards(api)
    } catch (error) {
        
    }
}

const pintarCards = (api) => {
    api.forEach(item => {
        $templateCard.querySelector('h5').textContent = item.title
        $templateCard.querySelector('p').textContent = item.precio
        $templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        $templateCard.querySelector('.btn-dark').dataset.id = item.id
        const clone = $templateCard.cloneNode(true)
        $fragment.appendChild(clone)
    });
    $items.appendChild($fragment)
}

const addCarrito = e =>{
    //console.log(e.target)
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = (objeto) =>{
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()
    //console.log(carrito)

}

const pintarCarrito = () =>{
    //console.log(carrito)
    $cards.innerHTML = ''
    Object.values(carrito).forEach(producto =>{
        $templateCarrito.querySelector('th').textContent = producto.id
        $templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        $templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        $templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        $templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        $templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = $templateCarrito.cloneNode(true)
        $fragment.appendChild(clone)
    })
    $cards.appendChild($fragment)

    pintarFooter()
}

const pintarFooter = () =>{
    $footer.innerHTML = ''

    if(Object.values(carrito).length === 0){
        $footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad ,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio})=> acc + cantidad * precio ,0)

    $templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    $templateFooter.querySelector('span').textContent = nPrecio

    const clone = $templateFooter.cloneNode(true)
    $fragment.appendChild(clone)
    $footer.appendChild($fragment)

}