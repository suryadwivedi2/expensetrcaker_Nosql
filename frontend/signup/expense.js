

async function getformvalue(event){
event.preventDefault();
try
{
    const name=document.getElementById('name').value;
const email=document.getElementById('email').value;
const password=document.getElementById('pass').value;

let userdata={
    "name":name,
    "email":email,
    "password":password
}

const res=await axios.post("http://localhost:4000/expense/add-user", userdata)
                if(res.status==201){
              console.log('added successfull');
                window.location.href='../login/login.html';
            }else{
                throw new Error('something went wrong');
            }
        }catch(err){
            document.body.innerHTML+=`<div style="color:red;">${'something went wrong'}</div>`;
        }
}