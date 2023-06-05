import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Header from '../Header/header';
import axios from 'axios';
import { Prev } from 'react-bootstrap/esm/PageItem';

function Detail() {

  const [data,setData] = useState([])
  const [quantity,setQuantity] = useState(1)
  const [item,setItem] = useState(0)
  let {id} = useParams();

  useEffect(()=>{
    axios.get('http://localhost:5000/api/data?id='+id)
    .then(res=>setData(res.data[0]))
    if(sessionStorage.getItem('email')){
    axios.get('http://localhost:5000/api/user?email='+sessionStorage.getItem('email'))
    .then(res=>{
      let sum = 0
          for (let i = 0; i < res.data[0].cartItem.length; i++) {
              sum += res.data[0].cartItem[i]['quantity'];
              if (i===res.data[0].cartItem.length-1){
                  setItem(sum)
              }
          }
  })}
  },[item])

  const handleSubmit = ()=>{
    let dat = {
      "name":data.title,
      "price":data.price,
      "quantity":quantity
    }
    if (sessionStorage.getItem('isLogin')==="true"){
      axios.post("http://localhost:5000/api/user",{email:sessionStorage.getItem('email'),cartItem:[dat]})
      setItem(prev=>prev+1)
    }
  }

  return (
    <div>
        <Header quantity={item}/>
    <div class="container mb-5">
        <h3 className='mt-4 mb-4'>Product Detail</h3>
        <div class="row">
            <div class="col-md-4">
                <img src={data.cover_image} alt="Product Image" class="img-fluid"/>
            </div>
            <div class="col-md-8">
                <h2>{data.title}</h2>
                <p>{data.description}</p>
                <div className='mb-2'>
                <span class="badge bg-secondary">Genre</span> : {data.genre}
                </div>
                <div class="rating">
                  <i className='bi bi-star-fill text-warning me-2'></i>{data.ratings}
                </div>
                <div className='text-danger mt-2' style={{fontWeight:'bold',fontSize:'20px'}}>
                  ${data.price}
                </div>
                <button class="btn btn-primary mt-3" onClick={handleSubmit}>Add to Cart</button>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Detail