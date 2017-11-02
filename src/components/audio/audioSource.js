
export default function (player) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  const source = ctx.createMediaElementSource(player)
  const gainDb = -40.0
  const bandSplit = [360, 3600]
  source.connect(analyser)
  analyser.connect(ctx.destination)
  const bufferLength = analyser.fftSize
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteTimeDomainData(dataArray)

  var hBand = ctx.createBiquadFilter()
  hBand.type = 'lowshelf'
  hBand.frequency.value = bandSplit[0]
  hBand.gain.value = gainDb

  const lBand = ctx.createBiquadFilter()
  lBand.type = 'highshelf'
  lBand.frequency.value = bandSplit[1]
  lBand.gain.value = gainDb

  // source.connect(lBand)
  // source.connect(hBand)
  return {
    init (player) {
    },
    frequency () {
      analyser.getByteFrequencyData(dataArray)
      return dataArray
    }
  }
}
