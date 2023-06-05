import React, { useState, useEffect } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import axios from 'axios'
import Header from '../Header/header'

function Home() {

    const [books,setBooks]=useState([])
    const [search, setSearch] = useState("")
    const [pub_date, setDate] = useState("")
    const [genre,setGenre] = useState("")
    const [min_price,setMinPrice] = useState("")
    const [max_price,setMaxPrice] = useState("")
    const [apply,setApply] = useState(false)

    useEffect(()=>{
      axios.post(`http://localhost:5000/api/filter?name=${search}&genre=${genre}&min_price=${min_price}&max_price=${max_price}&publication=${pub_date}`)
      .then(res=>{setBooks(res.data),setApply(false)})
    },[search,apply])

    const onSearch = (keyword)=>{
      setSearch(keyword)
    }

    const onFilter = (e)=>{
      setApply(true)
      e.preventDefault()
    }

    const setPrice = (e)=>{
      let prices=e.target.value.split("-")
      setMinPrice(prices[0])
      setMaxPrice(prices[1])
    }

    
  return (
    <div>
      <Header onSearch = {onSearch}/>
    <div class="container-fluid">
    <div className='row'>
      <div className='col-md-3 mt-4'>
        <div className='card p-4'>
        <h4>Filter</h4>
          <form>
            <div class="form-group">
              <label for="priceRange">Price Range</label>
              <select class="form-control" id="priceRange" onChange={(e)=>setPrice(e)}>
                <option disabled selected>Select..</option>
                <option value="0-10">$0 - $10</option>
                <option value="10-20">$10 - $20</option>
                <option value="20-30">$20 - $30</option>
                <option value="30+">$30+</option>
              </select>
            </div>
            <div class="form-group">
              <label for="genre" className='mt-3'>Genre</label>
              <select class="form-control" id="genre" onChange={(e)=>setGenre(e.target.value)}>
                <option disabled selected>Select..</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Fantasy">Fantasy</option>
              </select>
            </div>
            <div class="form-group">
              <label for="publishDate" className='mt-3'>Publishing Date</label>
              <input type="date" class="form-control" id="publishDate" onChange={e=>setDate(new Date(e.target.value).toISOString())}/>
            </div>
            <button className="btn btn-primary mt-4" onClick={(e)=>onFilter(e)}>Apply Filter</button>
          </form>
          </div>
      </div>
      <div className='col-md-9'>
        <div class="row mt-4">
        {books.length>0 && books.map(r=>{
          return(<div class="col-md-3">
            <a href={`/book/${r._id.$oid}`} className='text-decoration-none'>
              <div class="card mb-4 text-black">
                <img src={r.cover_image} class="card-img-top img-fluid" alt="Book Image" style={{height:'270px', objectFit:'cover'}} />
                <div class="card-body p-2">
                  <span class="card-title" style={{fontSize:'14px'}}>{r.title}</span>
                  <i className='bi bi-star float-end'></i>
                  <span class="text-muted float-end me-1">{r.ratings}</span>
                  <p class="card-text text-danger">${r.price}</p>
                </div>
              </div>
            </a>
        </div>)
        })}
      </div>
      </div>
    </div>
  </div>
  </div>
  )
}

export default Home