import React, { useEffect, useRef, useState } from 'react';
import userImg from '../../images/user-cropped.svg';
import { useNavigate } from 'react-router-dom';
import addContact from '../../images/add-contact.svg'
import axios from 'axios';

const Navbar = ({ user, handelAddContact }) => {

    const navigate = useNavigate();
    const [showHideDetails, setShowHideDetails] = useState('none');
    const userDetailsRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleClickOutside(event) {
        if (userDetailsRef.current && !userDetailsRef.current.contains(event.target) && event.target.className !== 'profile-img') {
            setShowHideDetails('none');
        }
    }

    function handelLogout() {
        user.setUser({});
        axios.delete('http://localhost:3001/api/logout')
            .then(resp => {
                if (resp.data) {
                    navigate("/login");
                }
            })
            .catch(error => console.log(error));
    }

    function handelDetails() {
        // showHideDetails === 'none' ? setShowHideDetails('flex') : setShowHideDetails('none')
        setShowHideDetails(prevState => prevState === 'none' ? 'flex' : 'none');
    }

    return (
        <div className='navbar'>
            <div className='col'>
                <span className='main-heading'>Contacts</span>
            </div>
            <div className='col' >
                <img className='add-contact' src={addContact} alt='' onClick={handelAddContact} />
                <img className='profile-img' src={user.user["avatar"] ? user.user.avatar : userImg} alt='' onClick={handelDetails} />
                <div ref={userDetailsRef} className='userDetails' style={{ display: showHideDetails }}>
                    <span className='username'>@{user.user.userName}</span>
                    <span className='name'>{user.user.firstName + " " + user.user.lastName}</span>
                    <span className='logout' onClick={handelLogout}>Logout</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar