import React, { useEffect, useState } from 'react'
import Header from '../Header/header'
import axios from 'axios'

function Cart() {

    const [data,setData] = useState([])
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0)
    const [del,setDel] = useState(0)

    useEffect(()=>{
        axios.get("http://localhost:5000/api/user?email="+sessionStorage.getItem('email'))
        .then(res=>{
            let sum = 0
            let price = 0
            if(res.data[0].cartItem.length===0){
                setQuantity(0)
                setPrice(0)
            }
            for (let i = 0; i < res.data[0].cartItem.length; i++) {
                sum += res.data[0].cartItem[i]['quantity'];
                price += res.data[0].cartItem[i]['price']*res.data[0].cartItem[i]['quantity'];
                if (i===res.data[0].cartItem.length-1){
                    setQuantity(sum)
                    setPrice(price.toFixed(2))
                }
            }
            setData(res.data[0].cartItem)})
    },[quantity,del])

    const handleChange = (e,name,q) =>{
        if (e.target.name==="+"){
            axios.post("http://localhost:5000/api/quantity",{"email":sessionStorage.getItem('email'),"name":name,"quantity":q+1})
            setQuantity(prev=>prev+1)
        }
        else if(e.target.name==="-"){
            if(q>0){
            axios.post("http://localhost:5000/api/quantity",{"email":sessionStorage.getItem('email'),"name":name,"quantity":q-1})
            setQuantity(prev=>prev-1)
            }
        }
    }

    const handleDelete = (name)=>{
        axios.post("http://localhost:5000/api/user/item",{"email":sessionStorage.getItem('email'),"name":name})
        setTimeout(()=>{
            setDel(prev=>prev+1)
        },1000)
    }

  return (
    <div>
        <Header quantity={quantity}/>
    <div class="container">
        <h1 className='mt-4'>Cart</h1>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {data.length>0 && data.map(r=>{
                    return(
                        <tr>
                            <td>{r.name}</td>
                            <td>
                                <div class="input-group">
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-primary decrease-btn" name="-" type="button" onClick={(e)=>handleChange(e,r.name,r.quantity)}>-</button>
                                    </div>
                                    <input readOnly type="text" class="form-control" value={r.quantity}/>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-primary increase-btn" name="+" type="button" onClick={(e)=>handleChange(e,r.name,r.quantity)}>+</button>
                                    </div>
                                </div>
                            </td>
                            <td>${r.price*r.quantity}</td>
                            <td><i className='btn bi bi-trash text-danger' onClick={()=>handleDelete(r.name)}></i></td>
                        </tr>
                    )
                })}
                <tr>
                    <td><strong>Sub Total</strong></td>
                    <td>
                        <input readOnly type="text" class="form-control" value={quantity} style={{fontWeight:'bold'}}/>
                    </td>
                    <td><strong>${price}</strong></td>
                </tr>
            </tbody>
        </table>
        <div className='text-center mb-4'>        
            <button type="button" className="btn btn-primary mt-4">Buy now</button>
        </div>
    </div>
    </div>
  )
}

export default Cart