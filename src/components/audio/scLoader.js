import SC from 'soundcloud'
import emitter from 'lib/emitter'

export default (function () {
  const clientId = 'ca66887bcdd9141bdf67a2568496e151' // to get an ID go to http://developers.soundcloud.com/
  let track = null
  let streamURL = null
  SC.initialize({
    client_id: clientId
  })


  console.log('SC initialize')
  return {
    loadSound (url) {
      return new Promise((resolve, reject) => {
        SC.resolve(url)
          .then(function (tracks) {
            track = tracks
            streamURL = tracks.stream_url + '?client_id=' + clientId
            resolve(streamURL)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    getStreamURL () {
      return streamURL
    }
  }
})()
