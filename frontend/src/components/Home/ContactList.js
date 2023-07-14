import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ContactCard from './ContactCard';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactList = ({ handleContactClick, user, handelChatClick }) => {

    const [response, setResponse] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        if (searchQuery.trim()) {
            const delay = 600; // Delay in milliseconds
            clearTimeout(typingTimeout);
            setTypingTimeout(setTimeout(fetchSearchedContact, delay));
        } else {
            clearTimeout(typingTimeout);
            fetchContacts();
        }
        // console.log("Query", searchQuery);
    }, [searchQuery]);

    function fetchContacts() {
        axios.get("http://localhost:3001/api/contacts")
            .then(resp => setResponse(resp.data))
            .catch(error => console.log(error));
    }

    function fetchSearchedContact() {
        axios.get(`http://localhost:3001/api/search?search=${searchQuery}`)
            .then(resp => setResponse(resp.data))
            .catch(error => console.log(error));
    }

    function handleSearchClick(event) {
        setSearchQuery(event.target.value);
    }

    return (
        <div className='contact-list'>
            <div className='search-div'>
                <form>
                    <label>Enter your name:
                        <div className='searchbar'>
                            <input type="text" id="search-input" onChange={handleSearchClick} placeholder='Name, email or phone number' />
                            <button type='button' onClick={handleSearchClick}>
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#ffffff", }} />
                            </button>
                        </div>
                    </label>
                </form>
            </div>
            <div className='contactlist'>
                {response["data"] ? response.data.map(contact => (<ContactCard contact={contact} key={contact._id} handleContactClick={() => handleContactClick(contact)} handelChatClick={(event) => handelChatClick(event, contact)} />)) : <span className='loading'>Loading...</span>}
            </div>
        </div>
    )
}

export default ContactList;