import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://ygnjhqnaiwnlurbfzwhi.supabase.co', 'sb_publishable_IZ3NMyiMVl0z4Om_U64MDg_c4LsLtNz')

const channel = supabase.channel('Hints:Public', {
  config: { private: false, broadcast: { self: false } },
})

const messageInput = document.getElementById('MessageInput')
const responseLabel = document.getElementById('ResponseLabel')
const responseImage = document.getElementById('ResponseImage')
const pictureBtn = document.getElementById('PictureBtn')
const srcModal = document.getElementById('SrcModal')
const srcInput = document.getElementById('SrcInput')
const srcCancel = document.getElementById('SrcCancel')
const srcSend = document.getElementById('SrcSend')

channel
  .on('broadcast', { event: 'response_sent' }, (payload) => {
    console.log('Player response:', payload.payload)
    const value = payload.payload
    const isUrl = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(value) || value.startsWith('http')
    if (isUrl) {
      responseLabel.textContent = value
      responseImage.src = value
      responseImage.style.display = 'block'
    } else {
      responseLabel.textContent = value
      responseImage.style.display = 'none'
    }
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

pictureBtn.addEventListener('click', () => {
  srcInput.value = ''
  srcModal.classList.add('open')
  srcInput.focus()
})

srcCancel.addEventListener('click', () => {
  srcModal.classList.remove('open')
})

srcSend.addEventListener('click', () => {
  const srcs = srcInput.value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  if (srcs.length === 0) return

  channel.send({
    type: 'broadcast',
    event: 'image_pick',
    payload: { srcs, content: messageInput.value },
  })

  srcModal.classList.remove('open')
})
