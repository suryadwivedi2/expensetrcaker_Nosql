const pbtn = document.getElementById('premiumbtn');
const lbtn = document.getElementById('leaderboard-btn');
const token = localStorage.getItem("token");
const divp = document.getElementById('premium');


function getformvalue(event) {
    event.preventDefault();
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('cat').value;
    let expense_detail = {
        "amount": amount,
        "description": description,
        "category": category
    }
    axios.post('http://localhost:4000/user/add-expense', expense_detail, { headers: { 'Authorization': token } })
        .then((response) => {
            console.log('expense added');
            showscreenadd(expense_detail);
        }).catch((err) => {
            console.log(err);
        })
}


function premiumuser() {
    pbtn.remove();
    divp.innerHTML = "<h6>YOU ARE A PREMIUM USER</h6>";
    const rbtn=document.getElementById('showreport');
    const inputelement=document.createElement('input');
    inputelement.type='button';
    inputelement.value='SHOW PREMIUM REPORT';
    rbtn.appendChild(inputelement);
}


const decodedtoken = parseJwt(token);

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


let no_of_item=10;
document.getElementById('noofitembtn').onclick=()=>{
    localStorage.setItem('frequency',document.getElementById('noofitem').value)
}

window.addEventListener('DOMContentLoaded', () => {
    if (decodedtoken.ispremium == true) {
        premiumuser();
        showleaderboard();
        document.getElementById('dbtn').disabled=false;
        document.getElementById('dbtn').onclick=async()=>{
          try{
              const response=await  axios.get('http://localhost:4000/premium/download',{ headers: { 'Authorization': token } })
               if(response.status==200)
               {
                var a = document.createElement("a");
            a.href = response.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
                console.log('success');
               }          
            } catch(err){
                console.log(err);
            }
        }
    }
    const n=localStorage.getItem('frequency');
    if(n)
    {
       no_of_item=Number(n);
    }
    const page=1;
    axios.get(`http://localhost:4000/user/get-expense/${no_of_item}?page=${page}`, { headers: { 'Authorization': token } })
        .then((response) => {
            //console.log(response.data);
                showscreen(response.data.products);
          showpagination(response.data);
        })

    function showleaderboard() {
        const lbtn = document.getElementById("board-btn");
        const inputElement = document.createElement('input');
        inputElement.type = "button";
        inputElement.value = "show Leaderboard";
        lbtn.appendChild(inputElement);
     inputElement.onclick=async()=>{
        const token=localStorage.getItem('token');
    const leaderboardarray= await axios.get('http://localhost:4000/premium/show-leaderboard',{ headers: {'Authorization':token}})
   // console.log(leaderboardarray); 
    let leaderboardelement=document.getElementById('leaderboard');
     leaderboardelement.innerHTML='<h1>Leaderboard</h1>';
    leaderboardarray.data.forEach(userdetails => {
        leaderboardelement.innerHTML+=`<li>name-${userdetails.name} Total expense-${userdetails.totalexpense}`
        
    });
}
    }
})




function showscreen(data) {
    document.getElementById('list-item').innerHTML="";
    for (let i = 0; i < data.length; i++) {
        const ul = document.getElementById('list-item');
        const li = document.createElement('li');
        li.id = 'lists';
        const dltbtn = document.createElement("input");
        dltbtn.class = "btn-check";
        dltbtn.type = "button";
        dltbtn.value = "Delete-product";
        li.textContent = data[i].amount + "-" + "-" + data[i].description + "-" + data[i].category;
        li.appendChild(dltbtn);
        ul.appendChild(li);
        dltbtn.onclick = () => {
            axios.delete(`http://localhost:4000/user/delete-expense/${data[i]._id}`,{ headers: { 'Authorization': token }},{amount:data.amount})
                .then((result) => {
                    console.log("deleted");
                    ul.removeChild(li);
                }).catch(err => console.log(err));
        }
    }
}
function showscreenadd(data) {
    const ul = document.getElementById('list-item');
    const li = document.createElement('li');
    li.id = 'lists';
    const dltbtn = document.createElement("input");
    dltbtn.class = "btn-check";
    dltbtn.type = "button";
    dltbtn.value = "Delete-product";
    li.textContent = data.amount + "-" + "-" + data.description + "-" + data.category;
    li.appendChild(dltbtn);
    ul.appendChild(li);
    dltbtn.onclick = () => {
        axios.delete(`http://localhost:4000/user/delete-expense/${data.id}`,{ headers: { 'Authorization': token }},{amount:data.amount})
            .then((result) => {
                console.log("deleted");
                ul.removeChild(li);
            }).catch(err => console.log(err));
    }
}

pbtn.onclick = async (e) => {
    e.preventDefault();
    const response = await axios.get('http://localhost:4000/premium/purchase-premium', { headers: { "Authorization": token } });
    let options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:4000/premium/update-transaction', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })
            localStorage.setItem("token", res.data.token);
            //console.log(res.data.token);
            alert('congratulation on  buying our premium services')
            premiumuser();
            showleaderboard();
        }
    }
    const rpz1 = new Razorpay(options)
    rpz1.open();


    rpz1.on('payment.failed', async function (response) {
        await axios.post('http://localhost:4000/premium/update-transaction', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
        }, { headers: { "Authorization": token } })

        alert('something went wrong');
    })
}


function showpagination(data){
    const currentPage=data.currentPage
    const hasNextpage=data.hasNextpage
    const hasPreviouspage=data.hasPreviouspage;
    const lastPage=data.lastPage;
    const nextPage=data.nextPage
    const previousPage=data.previousPage;
   // console.log(currentPage)  
   const pgbtn=document.getElementById('pagination-btn');

   pgbtn.innerHTML='';
if(currentPage){
    const btn1=document.createElement('input');
    btn1.type='button';
    btn1.value=`${currentPage}`;
     pgbtn.appendChild(btn1);
     btn1.onclick=()=>{
        getproducts(currentPage);
     }
}
if(hasNextpage){
    const btn2=document.createElement('input');
    btn2.type='button';
    btn2.value=`${nextPage}`;
     pgbtn.appendChild(btn2);
     btn2.onclick=()=>{
        getproducts(nextPage);
     }
}
if(hasPreviouspage){
    const btn3=document.createElement('input');
    btn3.type='button';
    btn3.value=`${previousPage}`;
     pgbtn.appendChild(btn3);
     btn3.onclick=()=>{
        getproducts(previousPage);
     }
}
if(lastPage && lastPage!=currentPage && lastPage!=nextPage && lastPage!=previousPage){
    const btn4=document.createElement('input');
    btn4.type='button';
    btn4.value=`${lastPage}`;
     pgbtn.appendChild(btn4);
     btn4.onclick=()=>{
        getproducts(lastPage);
     }
}
}


function getproducts(page){
    axios.get(`http://localhost:4000/user/get-expense/${no_of_item}?page=${page}`, { headers: { 'Authorization': token } })
    .then((response) => {
        //console.log(response.data);
            showscreen(response.data.products);
      showpagination(response.data);
    })
}