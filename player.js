import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ygnjhqnaiwnlurbfzwhi.supabase.co', 'sb_publishable_IZ3NMyiMVl0z4Om_U64MDg_c4LsLtNz')

const channel = supabase.channel('Hints:Public', {
  config: { private: false, broadcast: { self: false } },
})

const waitingView = document.getElementById('WaitingView')
const responseView = document.getElementById('ResponseView')
const imageView = document.getElementById('ImageView')
const contentLabel = document.getElementById('ContentLabel')
const popupAction = document.getElementById('PopupAction')
const popupContent = document.getElementById('PopupContent')
const responseInput = document.getElementById('ResponseInput')
const responseSend = document.getElementById('ResponseSend')

function hideAll() {
  waitingView.style.display = 'none'
  responseView.style.display = 'none'
  imageView.style.display = 'none'
}

function showWaiting() {
  hideAll()
  waitingView.style.display = 'block'
}

function openResponseView(action, content) {
  hideAll()
  popupAction.innerHTML = action
  popupContent.textContent = content || '(no content)'
  responseInput.value = ''
  responseView.style.display = 'flex'
  responseInput.focus()
}

function openImageView(srcs, content) {
  hideAll()
  imageView.innerHTML = ''
  if (content) {
    const p = document.createElement('p')
    p.textContent = content
    p.style.cssText = 'width:100%; text-align:center; margin-bottom:16px;'
    imageView.appendChild(p)
  }
  srcs.forEach(src => {
    const img = document.createElement('img')
    img.src = src
    img.addEventListener('click', () => {
      channel.send({
        type: 'broadcast',
        event: 'response_sent',
        payload: src,
      })
      showWaiting()
    })
    imageView.appendChild(img)
  })
  imageView.style.display = 'flex'
}

responseSend.addEventListener('click', () => {
  channel.send({
    type: 'broadcast',
    event: 'response_sent',
    payload: responseInput.value,
  })
  showWaiting()
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
  .on('broadcast', { event: 'image_pick' }, (payload) => {
    console.log('Incoming images:', payload.payload)
    openImageView(payload.payload.srcs, payload.payload.content)
  })
  .subscribe((status) => {
    console.log('Player channel status:', status)
  })
