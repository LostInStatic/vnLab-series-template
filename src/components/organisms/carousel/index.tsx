import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { getImage, IGatsbyImageData, ImageDataLike } from "gatsby-plugin-image"
import * as Styled from "./style"
import { GridConstraint, GridContainer, InnerGrid } from "~styles/grid"
import { GatsbyImage } from "gatsby-plugin-image"
import { motion, useSpring } from "framer-motion"
import FullscreenPortal from "./fullscreen"
import { v4 as uuid } from "uuid"

//@ts-ignore
import LeftArrowSVG from "../../../images/icons/arrow_left.svg"
//@ts-ignore
import RightArrowSVG from "../../../images/icons/arrow_right.svg"
//@ts-ignore
import ExpandArrow from "../../../images/icons/arrow_expand.svg"

interface Props {
  images: ImageDataLike[]
  captions: string[]
}

const Carousel: React.FC<Props> = ({ images, captions }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const constraintRef = useRef<HTMLDivElement | null>(null)
  const [viewportOffset, setViewportOffset] = useState(0)
  const [currentImage, setCurrentImage] = useState(0)
  const carouselUid = useMemo(() => uuid(), [images])
  const [fullscreen, setFullscreen] = useState(false)

  const translateX = useSpring(0)

  const determineViewportOffset = () => {
    if (!ref || !ref.current) return

    setViewportOffset(ref.current.offsetLeft)
  }

  useLayoutEffect(() => {
    determineViewportOffset()
    window.addEventListener("resize", determineViewportOffset)

    return () => {
      window.removeEventListener("resize", determineViewportOffset)
    }
  }, [ref])

  useEffect(() => {
    const img = document.querySelector<HTMLDivElement>(
      `#carousel-${carouselUid}__image--${currentImage}`
    )

    img && translateX.set((img.offsetLeft - viewportOffset) * -1)
  }, [currentImage, viewportOffset])

  const getSliderMargins = () => {
    if (!ref || !ref.current || !constraintRef || !constraintRef.current)
      return { start: 0, end: 0 }

    const { offsetLeft, offsetWidth } = constraintRef.current
    const start = offsetLeft
    const end = ref.current.offsetWidth - offsetLeft - offsetWidth

    return { start, end }
  }

  const getSliderImageWidth = () => {
    if (!constraintRef || !constraintRef.current) return "50vw"

    return constraintRef.current.offsetWidth
  }

  const nextImage = () =>
    setCurrentImage(prev => (prev >= images.length - 1 ? prev : prev + 1))

  const previousImage = () =>
    setCurrentImage(prev => (prev <= 0 ? prev : prev - 1))

  const { start, end } = getSliderMargins()
  const width = getSliderImageWidth()

  return (
    <>
      <Styled.ViewportConstraint
        ref={ref}
        style={{ transform: `translatex(-${viewportOffset}px)` }}
      >
        <GridContainer>
          <Styled.Slider as={motion.div} style={{ translateX }}>
            {images.map((image, index) => {
              const uid = `carousel-${carouselUid}__image--${index}`

              return (
                <Styled.SliderImage
                  key={uid}
                  id={uid}
                  marginStart={start}
                  marginEnd={end}
                  style={{ width }}
                >
                  <GatsbyImage
                    style={{ width: "100%" }}
                    image={getImage(image) as IGatsbyImageData}
                    alt={`Carousel image ${index}`}
                  />
                  <Styled.ImageCaption>{captions[index]}</Styled.ImageCaption>
                </Styled.SliderImage>
              )
            })}
          </Styled.Slider>
          <GridConstraint ref={constraintRef} style={{ gridRow: 2 }}>
            <Styled.CarouselNav>
              <InnerGrid>
                <Styled.Arrow side="left" onClick={previousImage}>
                  <img src={LeftArrowSVG} alt="Left arrow" />
                </Styled.Arrow>
                <Styled.ImageCount>
                  {currentImage + 1}/{images.length}
                </Styled.ImageCount>
                <Styled.Arrow side="right" onClick={nextImage}>
                  <img src={RightArrowSVG} alt="Right arrow" />
                </Styled.Arrow>
                <Styled.Expand onClick={() => setFullscreen(true)}>
                  <img src={ExpandArrow} alt="Exapnd arrow" />
                </Styled.Expand>
              </InnerGrid>
            </Styled.CarouselNav>
          </GridConstraint>
        </GridContainer>
      </Styled.ViewportConstraint>
      {fullscreen && (
        <FullscreenPortal
          carouselUid={carouselUid}
          images={images}
          captions={captions}
          currentImage={currentImage}
          nextImage={nextImage}
          previousImage={previousImage}
          exitFullscreen={() => setFullscreen(false)}
        />
      )}
    </>
  )
}

export default Carousel
