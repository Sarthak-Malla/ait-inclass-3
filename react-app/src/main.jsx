import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const Clubs = ({ clubs }) => {
  if (!clubs) {
    return <p>Loading...</p>
  }

  const handleClick = (e) => {
    const clubs = document.querySelectorAll('.club');
    const selected_club = e.target.closest('div');
    clubs.forEach(club => {
      if (club === selected_club) {
        club.classList.add('selected');
        club.querySelector('.form').classList.toggle('hidden');
      } else {
        club.classList.remove('selected');
        club.querySelector('.form').classList.add('hidden');
      }
    })
  }

  const handleFormClick = (e) => {
    // e.preventDefault();
    e.stopPropagation();
  }

  const handleFormSubmit = (e) => {
    // add member to club
    e.stopPropagation();

    const club = e.target.closest('.club');
    const club_members = club.querySelector('p');
    const new_member = club.querySelector('input').value;

    club_members.textContent += `, ${new_member}`;
    club.querySelector('input').value = '';

    // update database
    const club_id = club.id;
    console.log(club, club_id);
    const url = `http://localhost:3001/clubs/${club_id}`;
    const data = { name: new_member };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }

    const updateClub = async () => {
      const response = await fetch(url, options);
      const res_data = await response.json();
      console.log(res_data);
    }

    updateClub();
  }

  return (
    <div onClick={handleClick}>
      {clubs.map(club => (
        <div className='club' key={club.id} id={club.id}>
          <h2>{club.name}</h2>
          <p>
            {/* make into comma separated values */}
            {club.members.reduce((acc, member) => acc + member + ', '
              , '').slice(0, -2)}
          </p>
          <form className='form hidden' onClick={handleFormClick} onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = e.target;
                                        form.classList.add('hidden');
                                        const club = e.target.closest('.club');
                                        club.classList.remove('selected');
                      
                                        }}>
            <input type="text" placeholder='add members' />
            <input type="submit" onClick={handleFormSubmit}/>
          </form>
        </div>
      ))}
    </div>
  )
}

const App = () => {

  const [data, setData] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/clubs')
      console.log(response);
      const res_data = await response.json();
      setData(res_data);
    }
    
    fetchData();
  }, []);

  return (
  	<div className='main'>
      <h1>Join some clubs!</h1>
      <Clubs clubs={data}/>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( <App /> )