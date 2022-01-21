import React from "react"
import ReactMarkdown from "react-markdown"
import { mdxComponents } from "src/templates/chapter"
import { useTheme } from "styled-components"

interface Props {
  background?: string
}

const TextSlide: React.FC<Props> = ({ children, background }) => {
  const theme = useTheme()
  const bgColor = background ?? theme.palette.light

  return (
    <section data-background-color={bgColor}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {typeof children === "string" ? (
          <ReactMarkdown components={mdxComponents as any}>
            {children?.toString() ?? ""}
          </ReactMarkdown>
        ) : (
          children
        )}
      </div>
    </section>
  )
}

export default TextSlide
