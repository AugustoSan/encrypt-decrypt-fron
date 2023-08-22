import React, { useRef } from 'react'
/* Componentes */
import Main from './components/main'
/* Librerías */
import { v4 as uuidv4 } from 'uuid'
/* Imágenes */
// import WatchSvg from '../src/assets/watch.svg'
/* Estilos */
import './css/bootstrap.min.css'
import './css/principal.css'

export const App = () => {

  /* Referencias */
  const refMain = useRef(null)

  const getErrorPermissions = status => console.log('PERMISSIONS', status)

  const getResponse = response => {
    console.log('RESPONSE', response)
    if (response.mensaje.includes('modelo')) {
      // refMain.current.detenerVideo()
      setTimeout(async () => {
        // await refMain.current.reiniciarVideo()
        await refMain.current.cargarModelos()
      }, 1000)
    }
    response.mensaje.includes('Cancelar') && setTimeout(() => {
      // refMain.current.reiniciarProceso()
    }, 2000);
  }
  //console.log('RESPONSE', response)

  const getImage = image => console.log('IMAGE', image)

  const props = {
    uuidTransaction: uuidv4(),
    uuidClient: uuidv4(),
    uuidOtorgante: 'eb97bcad-b465-49f2-b5e0-d2ed1751f0b1',
    apikey: 'i2MopevgEp2HSmOppDOR3MHUzT4SEZOi',
    environment: 'nqa_',
    urlEnvironment: 'https://api.qadicio.net:8444',
    bucket: 'dco-bucket-ciencia',
    host: 'api.qadicio.net', // Aqui hay que cambiar por el host del ambiente
    getErrorPermissions: getErrorPermissions,
    getResponse: getResponse,
    getImage: getImage,
    videoFolder: 'test-pruebasFront',
    imageFolderReal: 'dev',
    imageFolderSpoof: 'dev',
    KMSkeyId: 'arn:aws:kms:us-east-1:870998336239:key/b8c654d5-c146-4fdc-a465-e03ed40411e5',
    KMSaccessKeyId: 'AKIA4VS4L4LXSKTIUH7X',
    KMSsecretAccessKey: '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',
    KMSregion: 'us-east-1',
    // firstMessage: '<p><b>Hola</b> Armando</p>',
    // centerErrorMessage: (<p>Muy bien, <b>acerca</b> tu <b>rostro</b> al centro de la toma</p>),
    // farAwayErrorMessage: (<p><b>Acércate</b> un poco del <b>centro</b> de la toma</p>),
    // nearErrorMessage: (<p><b>Alejáte</b> un poco del <b>centro</b> de la toma</p>),
    // stableMessage: (<p>Mantente estable<br /><br /><p><img src={WatchSvg} /> Procesando</p></p>),
    // realMessage: (<p>Procesando, gracias por tu <b>paciencia</b></p>),
    // spoofMessage: (<p>No se detectó rostro válido</p>),
    // timeMessage: (<p>No se detectó rostro válido</p>),
    // textCancelButton: 'CANCELAR'
    //rebootProcess:reiniciarProceso
  }

  return (
    <>
      <Main {...props} ref={refMain} />
    </>
  )
}

export default App
