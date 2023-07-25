// FIREBASE IMPORTS

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import { getFirestore ,  doc , collection, addDoc , onSnapshot ,deleteDoc ,updateDoc} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword ,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyCO4XQzLtIfby9M0iPOqK8ybT_5W-7ta0A",
    authDomain: "fire-store-todo-app.firebaseapp.com",
    projectId: "fire-store-todo-app",
    storageBucket: "fire-store-todo-app.appspot.com",
    messagingSenderId: "761216401418",
    appId: "1:761216401418:web:cdd1c98eb6a7d9d3a75ff3"
  };




  // FIREBASE FUNCTION
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const ids = []



  function signUp(){
    const userName = document.getElementById('signup-user-name')
    const email = document.getElementById('signup-email')
    const password = document.getElementById('signup-password')
    createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {

    const user = userCredential.user;
    document.getElementById('login').style.display='block'
    document.getElementById('signup').style.display = 'none'
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById('signup').style.display = 'none'
      document.getElementById('login').style.display = 'none'
      document.getElementById('main').style.display = 'block'
      const uid = user.uid;

    } else {
      // User is signed out
      // ...
    }
  });
  

  function login(){
    const userName = document.getElementById('login-user-name')
    const email = document.getElementById('login-email')
    const password = document.getElementById('login-password')
  
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      document.getElementById('signup').style.display = 'none'
      document.getElementById('login').style.display = 'none'
      document.getElementById('main').style.display = 'block'

      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  
  }
  


  function signOut(){
    signOut(auth).then(() => {

    }).catch((error) => {
      // An error happened.
    });
    
  }


document.getElementById('add-todo').addEventListener('click' , async ()=>{
    try {
        const todoInput = document.getElementById('todo-input')
        const docRef = await addDoc(collection(db, "todos"),
         {
            task : todoInput.value 
        });
        console.log("Document written with ID: ", docRef.id);
        todoInput.value = ""
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }
)





function getData (){
    onSnapshot(collection(db, "todos"), (data) => {
        data.docChanges().forEach((todoData) => {
          console.log(todoData)
        console.log(todoData.doc.data())
        console.log(todoData.doc.id)
        ids.push(todoData.doc.id)

        if(todoData.type === 'removed'){
          var liId = document.getElementById(todoData.doc.id)
          console.log(liId)
          liId.remove()
        }else if(todoData.type === 'added'){
          
          var list = document.getElementById('todo-list')
          console.log(todoData.doc.id)
          
          list.innerHTML+=
          `
          <li id='${todoData.doc.id}'>
         
  <input type="text" class="todo-value" value= ${todoData.doc.data().task} disabled>
          
          <button onclick='deleteFunction("${todoData.doc.id}")'>Delete</button>
          <button onclick='editFunction(this , "${todoData.doc.id}")'>Edit</button>
          </li>`
        }


      })
      
    })
    
      
}

getData()

async function deleteFunction(id){
  console.log('Delte button')
  // const collectionId = id 
  // console.log(collectionId)

  await deleteDoc(doc(db, "todos", id));

  console.log("Todo Has been detleted from " , id)
}

var edit = false  
async function editFunction(e , id){
  if(edit){
    await updateDoc(doc(db , 'todos' , id), {
      task : e.parentNode.childNodes[1].value
  });
  
    // console.log(e.parentNode.childNodes[1].value)
    e.parentNode.childNodes[1].disabled = true ;
    e.parentNode.childNodes[1].blur() ;
    e.parentNode.childNodes[5].innerHTML = "Edit" ;
    edit = false
  }else{
    e.parentNode.childNodes[1].disabled = false ;
    e.parentNode.childNodes[1].focus() ;
    e.parentNode.childNodes[5].innerHTML = "Update" ;
    edit = true
  }

}


document.getElementById('deleteAll-btn').addEventListener('click', deleteAll)

 async function deleteAll(){

  for(var i=0 ; i<ids.length ; i++){
    await deleteDoc(doc(db, "todos", ids[i]));

  }
}

window.getData = getData ;
window.deleteFunction =deleteFunction;
window.editFunction =editFunction ;
window.signUp = signUp ;
window.login =login;
window.signOut =signOut;