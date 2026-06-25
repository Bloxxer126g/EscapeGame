import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ygnjhqnaiwnlurbfzwhi.supabase.co', 'sb_publishable_IZ3NMyiMVl0z4Om_U64MDg_c4LsLtNz')

const channel = supabase.channel('Hints:Public', {
  config: { private: false, broadcast: { self: false } },
})

const waitingView = document.getElementById('WaitingView')
const responseView = document.getElementById('ResponseView')
const contentLabel = document.getElementById('ContentLabel')
const popupAction = document.getElementById('PopupAction')
const popupContent = document.getElementById('PopupContent')
const responseInput = document.getElementById('ResponseInput')
const responseSend = document.getElementById('ResponseSend')

function openResponseView(action, content) {
  popupAction.innerHTML = action
  popupContent.textContent = content || '(no content)'
  responseInput.value = ''
  waitingView.style.display = 'none'
  responseView.style.display = 'flex'
  responseInput.focus()
}

function closeResponseView() {
  waitingView.style.display = 'block'
  responseView.style.display = 'none'
}

responseSend.addEventListener('click', () => {
  channel.send({
    type: 'broadcast',
    event: 'response_sent',
    payload: responseInput.value,
  })
  closeResponseView()
})

responseInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) responseSend.click()
})

channel
  .on('broadcast', { event: 'message_sent' }, (payload) => {
    console.log('Incoming action:', payload.payload)
    const { action, content } = payload.payload
    openResponseView(action, content)
  })
  .subscribe((status) => {
    console.log('Player channel status:', status)
  })
