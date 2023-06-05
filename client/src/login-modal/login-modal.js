import React, { useState } from 'react'
import {Modal, Button} from 'react-bootstrap';
import axios from 'axios';
import SignupModal from '../signup-modal/signup-modal';

function LoginModal(props) {

    const [state, setState]=useState({
        email: '',
        password: ''
    })

    const [show,setShow]=useState(false)

    function handleInput(event){
        setState({...state, [event.target.name]:event.target.value})
    }

    function submit(){
        if(state.email==='' && state.password===''){
            alert('Enter all fields');
        }
        else if(state.username===''){
            alert('Enter all fields');
        }
        else if(state.email===''){
            alert('Enter all fields');
        }
        else{
            axios.post('http://localhost:5000/api/login',state)
            .then((res)=>{
                if(res.data.length>0){
                    props.setLogin(true);
                    sessionStorage.setItem('username',res.data[0].name);
                    sessionStorage.setItem('email',res.data[0].email);
                    sessionStorage.setItem('isLogin',true);
                    setState({
                        email: '',
                        password: ''
                    })
                    props.onHide();
                }
                else{
                    alert('Invalid Credentials')
                }
            })
        }
    }

    return (
        <div>
      <SignupModal show={show} onHide={()=>setShow(false)} />
      <Modal centered show={props.show} onHide={props.onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Sign In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
        <div className="mb-3">
          <label for="exampleInputEmail" className='mb-2'><strong>Email address</strong></label>
          <input type="email" class="form-control" name='email' id="exampleInputEmail" onChange={(e)=>handleInput(e)} value={state.email} placeholder="Enter email"/>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className='mb-2'><strong>Password</strong></label>
          <input type="password" class="form-control" name='password' id="exampleInputPassword1" onChange={(e)=>handleInput(e)} value={state.password} placeholder="Enter password"/>
        </div>
        <div className="d-grid">
          <button type="button" className="btn btn-primary mb-3" onClick={submit}>
            Submit
          </button>
        </div>
        <p className="forgot-password text-center">
          New User? <a href="#" onClick={()=>{setShow(true);props.onHide()}}>Create account</a>
        </p>
      </form>
          </Modal.Body>
        </Modal>
        </div>
    )
  }
  
  export default LoginModal;