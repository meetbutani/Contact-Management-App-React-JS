import React from 'react'
import '../../scss/ChatIndividual.scss'

const ChatIndividual = ({ user, selectedChat }) => {
  // console.log(selectedChat);
  return (
    <div className='chatIndiavidual'>
      <div className='chatheader'>
        <div className='contact-info'>
          <span className='name'>{selectedChat.firstName} {selectedChat.lastName}</span>
          <span className='status'>{selectedChat.online === 'off' ? 'Offline' : selectedChat.online === 'on' ? 'Online' : 'Recently Online'}</span>
          {/* <span className='name'>Meet Butani</span> */}
          {/* <span className='status'>Offline</span> */}
        </div>
      </div>
    </div>
  )
}

export default ChatIndividual
