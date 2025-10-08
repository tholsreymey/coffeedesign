let cart = []
let cartItem=[]
// Function Display

const Displayproducts = (products = cart) => {
  let show = ``
  products.forEach(pro => {
    show += ` <div class="col-12 col-sm-6 col-md-3">
      <div class="card h-100">
        <img src="${pro.image}"
          class="card-img-top img-fixed" alt="Cappuccino">
        <div class="card-body">
          <h5 class="card-title">${pro.name}</h5>
          <p class="card-text">${pro.description}</p>
          <p class="fw-bold text-success">${pro.price}$</p>
          <button  type="button" onclick="AddtoCart(${pro.id})" class="btn btn-warning w-100">Add to cart</button>
        </div>
      </div>
    </div>`

  })
  document.getElementById("show-product").innerHTML = show
  Updatetocart()
 
}

fetch("https://thoenthonny.github.io/Coffee-Api/data.json")
  .then(res => res.json())
  .then(item => {
    cart = item
    Displayproducts()
  })
  .catch(err => alert(err))

// search

document.getElementById("input-search").addEventListener("input", (event) => {
  const inputserach = event.target.value.toLowerCase();
  const finds = cart.filter(item => {
    return item.name.toLowerCase().includes(inputserach)
  })
  if (finds.length > 0) {
    Displayproducts(finds)
  } else {
    document.getElementById("show-product").innerHTML = `
        <div class=" w-100">
<h1  class=" text-danger text-center">Search Is Not Found...!</h1>
</div>
      `
  }
})

// add to cart
const AddtoCart =(productId)=>{
    const product = cart.find(p=> p.id === productId)
    const tocart = cartItem.find(i=> i.id ===productId)
    if(tocart){
      tocart.qty+=1;
    }else{
      cartItem.push({...product,qty:1})
    }
    Swal.fire({
  title: `${product.name} Add Your Cart`,
  icon: "success",
  draggable: true
});
    Updatetocart()
}

// update item to card
const Updatetocart = () => {
  const count = document.getElementById("cart-count"); // your cart badge
  const itemtocart = document.getElementById("cart-item");

  // Update total items
  const totalitem = cartItem.reduce((sum, i) => sum + i.qty, 0);
  if (count) count.innerText = totalitem;

  // If cart is empty
  if (cartItem.length === 0) {
    itemtocart.innerHTML = `
      <div class=" w-100 h-auto text-center">
         <i class="bi bi-cart-x fs-4"></i>
        <p class="text-center mt-3 fs-5">Your Cart Is Empty</p>
        
      </div>
    `;
    return;
  }

  // Render cart items
  let show = "";
  cartItem.forEach(item => {
    show += `
      <div class="d-flex align-items-center mb-3 border-bottom pb-2">
        <img src="${item.image}" alt="${item.name}" class="rounded me-3" style="width:60px; height:60px; object-fit:cover;">
        <div class="flex-grow-1">
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">${item.price}$</small>
          <div class="d-flex align-items-center mt-1">
            <button class="btn btn-sm btn-outline-secondary" onclick="UpdateQty(${item.id}, -1)">-</button>
            <input type="text" class="form-control form-control-sm text-center mx-1" value="${item.qty}" style="width: 45px;" readonly>
            <button class="btn btn-sm btn-outline-secondary" onclick="UpdateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="d-flex flex-column align-items-end ms-2">
          <span class="fw-bold">${(item.qty * item.price).toFixed(2)}$</span>
          <button class="btn btn-sm btn-outline-danger mt-1" onclick="RemoveFromCart(${item.id})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>`;
  });

  // Cart summary
  const subtotal = cartItem.reduce((sum, i) => sum + i.qty * i.price, 0);
  const delivery = 1.5;
  const total = subtotal + delivery;

  show += `
    <div class="cart-summary border-top pt-3">
      <div class="d-flex justify-content-between mb-2">
        <span>Subtotal</span>
        <span class="fw-bold">$${subtotal.toFixed(2)}</span>
      </div>
      <div class="d-flex justify-content-between mb-3">
        <span>Delivery</span>
        <span class="fw-bold">$${delivery.toFixed(2)}</span>
      </div>
      <div class="d-flex justify-content-between fs-5 fw-bold">
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <button onclick="CheckOut()" class="btn btn-warning w-100 mt-3">Proceed to Checkout</button>
    </div>`;

  itemtocart.innerHTML = show;
};

// update qty

const UpdateQty = (productId,chang) =>{
    const item = cartItem.find(i => i.id === productId);
    if(item){
      item.qty+=chang
      if(item.qty<1){
        RemoveFromCart(productId)
      }else{
        Updatetocart();
      }
    }
}
// Remove From Card
const RemoveFromCart = (productId)=>{
  cartItem=cartItem.filter(i =>i.id !==productId);
  Updatetocart();
}

// CheckOut
const CheckOut = ()=>{
  
  Swal.fire({
  title: "Thank For Order",
  text: "Nice To Meet You!",
  icon: "success"
});
cartItem=[]
  Updatetocart()
}