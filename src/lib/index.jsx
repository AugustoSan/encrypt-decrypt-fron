/* eslint-disable react/display-name */
import React, { forwardRef } from 'react'
/* Componentes */
import Main from '../components/main'
/* Estilos */
// import '../css/bootstrap.min.css'
import '../css/principal.css'

const Index = forwardRef((props, ref) => {
    /* if (!props.uuidTransaction || !props.uuidClient || !props.uuidOtorgante || props.environment || props.urlEnvironment) {
      return null
    } */
  
    return (
         <Main {...props} ref={ref}
      />
    )
  })
  
  export default Index