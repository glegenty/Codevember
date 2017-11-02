import raf from 'raf-loop'
import './styl/main.styl'
// import scLoader from './components/audio/scLoader'
// import player from './components/audio/playerElement'
import emitter from 'lib/emitter'
// import audioSource from './components/audio/audioSource'
import visualizer from './components/galaxy/visualizer'


// emitter.on('SUBMIT_URL', loadTracks)

// const audio = audioSource(player.getPlayerElement())

raf(tick).start()

// function loadTracks (tracksURL) {
//   scLoader.loadSound(tracksURL).then((streamURL) => {
//     player.setSource(streamURL)
//       .play()
//   })
// }

function tick (dt = 0) {
  // visualizer.update(audio.frequency())
  visualizer.update()
  

}
