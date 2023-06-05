import React, { useState } from 'react'
import {Modal, Button} from 'react-bootstrap';
import axios from 'axios';

function SignupModal(props) {

    const [state, setState]=useState({
        name: '',
        email: '',
        password: '',
        cartItem: []
    })

    function handleInput(event){
        setState({...state, [event.target.name]:event.target.value})
    }

    function submit(){
        if(state.name==='' && state.email==='' && state.password===''){
            alert('Enter all fields');
        }
        else if(state.name==='' && state.email===''){
            alert('Enter all fields');
        }
        else if(state.name==='' && state.password===''){
            alert('Enter all fields');
        }
        else if(state.email==='' && state.password===''){
            alert('Enter all fields');
        }
        else if(state.name===''){
            alert('Enter all fields');
        }
        else if(state.email===''){
            alert('Enter all fields');
        }
        else if(state.password===''){
            alert('Enter all fields');
        }
        else{
            axios.post('http://localhost:5000/api/user',state)
            .then(()=>{
                setState({
                    name: '',
                    email: '',
                    password: ''
                })
                props.onHide();
            })
        }
    }

  return (
    <Modal centered show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Create an account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
        <div class="form-group mb-3">
            <label for="exampleInputUsername" className='mb-2'><strong>Username</strong></label>
            <input type="text" class="form-control" name="name" id="exampleInputUsername" onChange={(e)=>handleInput(e)} value={state.name} placeholder="Enter Username"/>
        </div>
        <div className="mb-3">
          <label for="exampleInputEmail" className='mb-2'><strong>Email</strong></label>
          <input type="email" class="form-control" name='email' id="exampleInputEmail" onChange={(e)=>handleInput(e)} value={state.email} placeholder="Enter email"/>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className='mb-2'><strong>Password</strong></label>
          <input type="password" class="form-control" name='password' id="exampleInputPassword1" onChange={(e)=>handleInput(e)} value={state.password} placeholder="Enter password"/>
        </div>
        <div className="d-grid">
          <button type="button" className="btn btn-primary mb-3" onClick={submit}>
            Register
          </button>
        </div>
      </form>
        </Modal.Body>
      </Modal>
  )
}

export default SignupModal;
