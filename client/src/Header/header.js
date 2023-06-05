import "./header.css"
import React, { useEffect, useState } from 'react';
import LoginModal from '../login-modal/login-modal';
import SignupModal from '../signup-modal/signup-modal';
import axios from "axios";

function Header(props) {

const [showSignUp, setShowSignUp] = useState(false);
const [showLogin, setShowLogin] = useState(false);
const [items,setItems] = useState(0)
const [isLogin, setIsLogin]=useState(sessionStorage.getItem('isLogin')==='true'?true:false);
const username = sessionStorage.getItem('username');
const [keyword, setKeyword] = useState("")

useEffect(()=>{
    if(sessionStorage.getItem('email')){
    axios.get("http://localhost:5000/api/user?email="+sessionStorage.getItem('email'))
    .then(res=>{
        let sum = 0
            for (let i = 0; i < res.data[0].cartItem.length; i++) {
                sum += res.data[0].cartItem[i]['quantity'];
                if (i===res.data[0].cartItem.length-1){
                    setItems(sum)
                }
            }
    })}
},[])

const onChange = (e)=>{
    setKeyword(e.target.value);
    props.onSearch(e.target.value)
}

function getIsLogin(res){
    setIsLogin(res);
  }

  let header=null;

  if(isLogin || sessionStorage.getItem('isLogin')==='true'){
    header=
        <div className="d-flex align-items-center ms-auto me-4">
            <a href="/cart"><i className="btn btn-lg bi bi-bag text-white me-4 position-relative"><span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize:'0.55em'}}>{props.quantity===undefined ? items:props.quantity }<span class="visually-hidden">unread messages</span></span></i></a>
            <div className="login me-4" onClick={()=>{sessionStorage.setItem('isLogin',false);setIsLogin(false);sessionStorage.clear();window.location.href='/'}}>
                 <span className="login_span">Logout</span>
            </div>
            <div className="create">
                Hi! {username}
            </div>
        </div>
  }
  else{
    header=
        <div className="d-flex align-items-center ms-auto me-4">
            <div onClick={()=>setShowLogin(true)} className="login me-4">
                 <span className="login_span">Login</span>
            </div>
            <div className="create" onClick={()=>setShowSignUp(true)}>
                Create an account
            </div>
        </div>
  }

  return ( 
      <div className="header align-items-center position-sticky top-0" style={{zIndex:2}}>
                <SignupModal onHide={()=>setShowSignUp(false)} show={showSignUp}/>
                <LoginModal onHide={()=>setShowLogin(false)} show={showLogin} setLogin={getIsLogin}/>
                <a href="/" className="text-decoration-none">
                <div className="logo">BookStore</div>
                </a>
                <form class="form-inline ms-5">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="searchBtn" style={{width:'25vw'}} onChange={(e)=>onChange(e)}/>
                    </div>
                </form>
                {header}
        </div>);
}

export default Header;
