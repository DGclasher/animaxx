import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeFromPlaylist } from '../reducers/playlistSlice'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([])
  const [title, setTitle] = useState('')

  const getPlaylist = async () => {
    try {
      const cookies = new Cookies()
      const token = cookies.get('token')
      const response = await axios.get('http://localhost:3000/user/playlist', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      })
      console.log(response.data)
      setPlaylists(response.data.playlists)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPlaylist()
  }, [])

  const removeFromPlaylist = async (item) => {
    try {
      const cookies = new Cookies()
      const token = cookies.get('token')
      const response = await axios.post('http://localhost:3000/user/remove-from-playlist', item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      })
      console.log(response.data.message)
      getPlaylist()
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    try {
      console.log(title)
      const data={
        title:title
      }
      const cookies = new Cookies()
      const token = cookies.get('token')
      const response = await axios.post('http://localhost:3000/user/create-playlist', data , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        }
      })
      console.log(response.data.message)
      getPlaylist()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <h1 className='text-3xl text-red-600'>Playlist</h1>
      <p className='text-lg text-gray-800'>Here are the items in your playlist. Click on an item to remove it.</p>
      <div>
        Create new playlist
        <form>
          <input type="text" onChange={(e)=> setTitle(e.target.value)} placeholder="Playlist name" />
          <button onClick={handleCreatePlaylist} type="submit">Create</button>
        </form>
      </div>
      <div className="card-container">
        {
          playlists.map((item, index) => (
            <div key={index} className="card bg-zinc-200 p-2 my-2 flex flex-col gap-2" onClick={() => removeFromPlaylist({ item })}>
              <img src={item.image} alt={item.title} />
              <h2>{item.title}</h2>
              
             {/* <p>{item.upvotes}</p>
              <button className='block bg-blue-500 p-2 my-4 rounded' onClick={() => removeFromPlaylist({ item })}>Remove from Playlist</button> */}

              <Link className='bg-blue-500 p-3 rounded-none w-36' to={`/playlist/${item._id}`}>View Playlist</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default PlaylistList