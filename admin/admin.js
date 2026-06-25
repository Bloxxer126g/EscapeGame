import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ygnjhqnaiwnlurbfzwhi.supabase.co', 'sb_publishable_IZ3NMyiMVl0z4Om_U64MDg_c4LsLtNz')

const channel = supabase.channel('Hints:Public', {
  config: { private: false, broadcast: { self: false } },
})

const messageInput = document.getElementById('MessageInput')
const responseLabel = document.getElementById('ResponseLabel')

channel
  .on('broadcast', { event: 'response_sent' }, (payload) => {
    console.log('Player response:', payload.payload)
    responseLabel.textContent = payload.payload
  })
  .subscribe((status) => {
    console.log('Admin channel status:', status)
  })

document.querySelectorAll('.quick').forEach((btn) => {
  btn.addEventListener('click', () => {
    channel.send({
      type: 'broadcast',
      event: 'message_sent',
      payload: { action: btn.textContent, content: messageInput.value },
    })
  })
})
