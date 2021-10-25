import React, { createContext, useState } from "react"

export interface Annotation {
  target: string
  content: any
  index: number
  position: number
}

interface Context {
  annotations: Array<Annotation>
  addAnnotation: (target: string, content: any, position: number) => void
}

export const AnnotationContext = createContext<Context>({
  annotations: [],
  addAnnotation: (_t, _a) => {},
})

const AnnotationProvider: React.FC = ({ children }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([])

  const addAnnotation = (target: string, content: any, position: number) => {
    setAnnotations(prev => {
      const index = prev.length + 1
      return [...prev, { target, content, index, position: position }]
    })
  }

  return (
    <AnnotationContext.Provider value={{ annotations, addAnnotation }}>
      {children}
    </AnnotationContext.Provider>
  )
}

export default AnnotationProvider
