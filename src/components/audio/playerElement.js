import emitter from 'lib/emitter'

export default (function () {
  let playerElement = document.querySelector('#player')
  let urlInput = document.querySelector('#url-input')
  let submitButton = document.querySelector('#submit-url')
  playerElement.crossOrigin = 'anonymous'
  submitButton.addEventListener('click', submitURL)
  
  function submitURL () {
    emitter.emit('SUBMIT_URL', urlInput.value)
  }

  return {
    setSource (url) {
      playerElement.src = url
      return this
    },
    play () {
      playerElement.play()
      return this
    },
    getPlayerElement () {
      return playerElement
    }
  }
}())
