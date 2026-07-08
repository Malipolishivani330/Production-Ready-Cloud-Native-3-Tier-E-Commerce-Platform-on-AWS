/*==================================================
                API URL
==================================================*/

const API_URL = "/products";
/*==================================================
                ELEMENTS
==================================================*/

const productGrid = document.getElementById("products");

const searchInput = document.getElementById("searchInput");

const productCount = document.getElementById("productCount");

/*==================================================
                LOAD PRODUCTS
==================================================*/

window.addEventListener("DOMContentLoaded", () => {

    loadProducts();

});

/*==================================================
                GET PRODUCTS
==================================================*/

async function loadProducts() {

    try {

        const response = await fetch(API_URL);

        const products = await response.json();

        displayProducts(products);

    }

    catch(error){

        console.error(error);

        productGrid.innerHTML = `

        <div class="no-products">

            Unable to connect to FastAPI Server.

        </div>

        `;

    }

}

/*==================================================
                DISPLAY PRODUCTS
==================================================*/

function displayProducts(products){

    productGrid.innerHTML = "";

    if(products.length===0){

        productGrid.innerHTML=`

        <div class="no-products">

            No Products Available

        </div>

        `;

        productCount.innerHTML="0 Products";

        return;

    }

    productCount.innerHTML=`${products.length} Products`;

    products.forEach(product=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`

        <div class="badge">

            NEW

        </div>

        <img src="${product.image}"

        onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">

        <div class="card-content">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <div class="stars">

                ⭐⭐⭐⭐⭐

            </div>

            <div class="price">

                <span class="current-price">

                    ₹${product.price}

                </span>

            </div>

            <div class="card-buttons">

                <button

                class="buy-btn"

                onclick="buyProduct('${product.name}')">

                Buy Now

                </button>

                <button

                class="delete-btn"

                onclick="deleteProduct(${product.id})">

                Delete

                </button>

            </div>

        </div>

        `;

        productGrid.appendChild(card);

    });

}
/*==================================================
                ADD PRODUCT
==================================================*/

async function addProduct(){

    const name=document.getElementById("name").value.trim();

    const description=document.getElementById("description").value.trim();

    const price=document.getElementById("price").value.trim();

    const image=document.getElementById("image").value.trim();

    if(name===""||description===""||price===""||image===""){

        showToast("Please fill all fields","error");

        return;

    }

    try{

        const response=await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                name:name,

                description:description,

                price:Number(price),

                image:image

            })

        });

        if(response.ok){

            showToast("Product Added Successfully","success");

            document.getElementById("name").value="";

            document.getElementById("description").value="";

            document.getElementById("price").value="";

            document.getElementById("image").value="";

            loadProducts();

        }

        else{

            showToast("Unable to Add Product","error");

        }

    }

    catch(error){

        console.error(error);

        showToast("Server Connection Failed","error");

    }

}

/*==================================================
                DELETE PRODUCT
==================================================*/

async function deleteProduct(id){

    const confirmDelete=confirm("Delete this product?");

    if(!confirmDelete){

        return;

    }

    try{

        const response=await fetch(`${API_URL}/${id}`,{

            method:"DELETE"

        });

        if(response.ok){

            showToast("Product Deleted","success");

            loadProducts();

        }

        else{

            showToast("Delete Failed","error");

        }

    }

    catch(error){

        console.error(error);

        showToast("Server Error","error");

    }

}

/*==================================================
                LIVE SEARCH
==================================================*/

searchInput.addEventListener("keyup",async()=>{

    try{

        const response=await fetch(API_URL);

        const products=await response.json();

        const keyword=searchInput.value.toLowerCase();

        const filtered=products.filter(product=>{

            return(

                product.name.toLowerCase().includes(keyword)||

                product.description.toLowerCase().includes(keyword)

            );

        });

        displayProducts(filtered);

    }

    catch(error){

        console.error(error);

    }

});

/*==================================================
                AUTO REFRESH
==================================================*/

setInterval(()=>{

    loadProducts();

},30000);
/*==================================================
                BUY PRODUCT
==================================================*/

function buyProduct(productName){

    showToast(`${productName} added to cart!`,"success");

    const cartCount=document.querySelector(".cart-icon span");

    let count=parseInt(cartCount.innerText);

    cartCount.innerText=count+1;

}

/*==================================================
                DARK MODE
==================================================*/

const darkModeBtn=document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    const icon=darkModeBtn.querySelector("i");

    if(document.body.classList.contains("dark")){

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

        localStorage.setItem("theme","dark");

    }

    else{

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

        localStorage.setItem("theme","light");

    }

});

/*==================================================
                LOAD SAVED THEME
==================================================*/

window.addEventListener("load",()=>{

    const savedTheme=localStorage.getItem("theme");

    if(savedTheme==="dark"){

        document.body.classList.add("dark");

        darkModeBtn.querySelector("i").classList.remove("fa-moon");

        darkModeBtn.querySelector("i").classList.add("fa-sun");

    }

});

/*==================================================
                TOAST MESSAGE
==================================================*/

function showToast(message,type){

    const toast=document.createElement("div");

    toast.className=`toast ${type}`;

    toast.innerHTML=message;

    document.body.appendChild(toast);

    if(type==="success"){

        toast.style.background="#16a34a";

    }

    else{

        toast.style.background="#ef4444";

    }

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

/*==================================================
                TOAST STYLE
==================================================*/

const toastStyle=document.createElement("style");

toastStyle.innerHTML=`

.toast{

position:fixed;

top:30px;

right:30px;

padding:16px 25px;

color:white;

border-radius:10px;

font-size:16px;

font-weight:600;

opacity:0;

transform:translateX(120px);

transition:.4s;

z-index:99999;

box-shadow:0 10px 25px rgba(0,0,0,.2);

}

.toast.show{

opacity:1;

transform:translateX(0);

}

`;

document.head.appendChild(toastStyle);

/*==================================================
                HERO BUTTONS
==================================================*/

document.querySelector(".shop-btn").addEventListener("click",()=>{

    document.getElementById("products").scrollIntoView({

        behavior:"smooth"

    });

});

document.querySelector(".learn-btn").addEventListener("click",()=>{

    document.getElementById("categories").scrollIntoView({

        behavior:"smooth"

    });

});

/*==================================================
                IMAGE FALLBACK
==================================================*/

document.addEventListener("error",(event)=>{

    if(event.target.tagName==="IMG"){

        event.target.src="https://via.placeholder.com/400x300?text=No+Image";

    }

},true);

/*==================================================
                PAGE READY
==================================================*/

console.log("CloudCart Loaded Successfully");