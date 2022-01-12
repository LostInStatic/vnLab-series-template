import React, { useState, useLayoutEffect, useEffect, useRef } from "react"
import useNavMenuContext from "src/hooks/useNavMenuContext"
import { TFunction, useTranslation } from "react-i18next"
import * as Styled from "./style"
import { LocalizedLink, useLocalization } from "gatsby-theme-i18n"
import LanguagePicker from "~components/molecules/language-picker"
import useHypothesis from "src/hooks/useHypothesis"
import Indexes from "./tabs/indexes"
import About from "./tabs/about"
import useScrollPause from "src/hooks/useScrollPause"
import { useTheme } from "styled-components"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useTransform,
  useViewportScroll,
} from "framer-motion"
import { navigate } from "gatsby-link"
import useIsMobile from "src/hooks/useIsMobile"
import useScrollDistance from "src/hooks/useScrollDistance"

//@ts-ignore
import HamburgerSVG from "../../../images/icons/hamburger.svg"
//@ts-ignore
import CloseSVG from "../../../images/icons/x.svg"
//@ts-ignore
import VnlabLogo from "../../../images/icons/vnlab_logo.svg"
//@ts-ignore
import SearchSVG from "../../../images/icons/magnifying_glass.svg"

enum NAV_MENU_STATES {
  TOC,
  INDEXES,
  ABOUT,
}

interface Props {
  currentPath: string
  reduced?: boolean
  ignoreHypothesis?: boolean
  independentHiding?: boolean
}

interface MiscProps {
  currentPath: string
  locale: string
  aside?: boolean
}

const MiscTabs: React.FC<MiscProps> = ({ currentPath, locale, aside }) => {
  return (
    <>
      <LanguagePicker
        alwaysDark={aside}
        currentPath={currentPath}
        compact={aside}
      />
      <Styled.TabButton small={aside}>
        <LocalizedLink to="/search" language={locale}>
          <Styled.SearchImg
            style={aside ? { filter: "brightness(0)" } : undefined}
            className="sizeable-icon"
            src={SearchSVG}
            alt="Magnifying glass"
          />
        </LocalizedLink>
      </Styled.TabButton>
    </>
  )
}

const ActiveTab: React.FC<{ navState: NAV_MENU_STATES }> = ({ navState }) => {
  switch (navState) {
    case NAV_MENU_STATES.TOC:
      return <Styled.TableOfContents headless />
    case NAV_MENU_STATES.INDEXES:
      return <Indexes />
    case NAV_MENU_STATES.ABOUT:
      return <About />
    default:
      return <></>
  }
}

const nextTabNames = (t: TFunction<"nav-menu">) => ({
  [NAV_MENU_STATES.TOC]: t("tabs.indexes"),
  [NAV_MENU_STATES.INDEXES]: t("tabs.about"),
  [NAV_MENU_STATES.ABOUT]: t("tabs.toc"),
})

const nextTabNavState = {
  [NAV_MENU_STATES.TOC]: NAV_MENU_STATES.INDEXES,
  [NAV_MENU_STATES.INDEXES]: NAV_MENU_STATES.ABOUT,
  [NAV_MENU_STATES.ABOUT]: NAV_MENU_STATES.TOC,
}

const NextTab: React.FC<{
  navState: NAV_MENU_STATES
  setNavState: React.Dispatch<React.SetStateAction<NAV_MENU_STATES>>
}> = ({ navState, setNavState }) => {
  const { t } = useTranslation("nav-menu")
  const tabName = nextTabNames(t)[navState]

  const setNextNavState = () => setNavState(nextTabNavState[navState])

  return (
    <Styled.NextTabButton onClick={setNextNavState}>
      {tabName}
    </Styled.NextTabButton>
  )
}

const NavigationMenu: React.FC<Props> = ({
  currentPath,
  reduced = false,
  ignoreHypothesis = false,
  independentHiding = false,
}) => {
  const { navMode, setToggleNav, isVisible, setIsVisible } = useNavMenuContext()
  const [open, setOpen] = useState(false)
  const [navState, setNavState] = useState<NAV_MENU_STATES>(NAV_MENU_STATES.TOC)
  const { locale, localizedPath, defaultLang, prefixDefault } =
    useLocalization()
  const { hideHypothesis } = useHypothesis()
  const { t } = useTranslation(["common", "nav-menu"])
  const prevScrollPos = useRef<number | undefined>(undefined)
  const isMobile = useIsMobile(mobile => !mobile && setIsVisible(true))

  const theme = useTheme()
  const { pauseScroll, resumeScroll } = useScrollPause({
    backgroundColor: theme.palette.light,
  })

  const { scrollYProgress } = useViewportScroll()
  const scrollPercent = useTransform(scrollYProgress, [0, 1], [0, 100])
  const progress = useMotionTemplate`${scrollPercent}%`

  const toggleMenu = () => setOpen(prev => !prev)

  const onScroll = () => {
    if (!independentHiding) return

    const currentScrollPos = window.pageYOffset

    if (prevScrollPos.current !== undefined && isMobile) {
      if (open || prevScrollPos.current !== 0) {
        if (prevScrollPos.current < currentScrollPos) setIsVisible(false)
      }
    }

    prevScrollPos.current = currentScrollPos
  }

  const onScrollEnd = useScrollDistance(distance => {
    if (distance <= -300 && isMobile) setIsVisible(true)
  })

  useEffect(() => {
    window.addEventListener("scroll", onScroll)
    window.addEventListener("scroll", onScrollEnd)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.addEventListener("scroll", onScrollEnd)
    }
  }, [isMobile, setIsVisible])

  useEffect(() => setToggleNav(() => () => toggleMenu()), [])

  useLayoutEffect(() => {
    if (open) {
      pauseScroll()
      if (!ignoreHypothesis) hideHypothesis()
    } else {
      resumeScroll()
    }
  }, [open])

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {isVisible && (
        <Styled.Aside
          noConstraint
          open={open}
          as={motion.div}
          initial={{ translateY: -125, opacity: 0 }}
          animate={{
            translateY: 0,
            opacity: 1,
            transition: { duration: 0.25, ease: "easeInOut" },
          }}
          exit={{
            translateY: -125,
            opacity: 0,
            transition: { delay: 0.25, duration: 0.3, ease: "easeInOut" },
          }}
        >
          <Styled.Nav mode={navMode} id="menu-nav">
            <Styled.Progress style={{ height: progress, width: progress }} />
            <Styled.ToggleBtn mode={navMode} open={open} onClick={toggleMenu}>
              <img
                className="sizeable-icon"
                src={open ? CloseSVG : HamburgerSVG}
                alt="Toggle Menu Button"
              />
            </Styled.ToggleBtn>
            {!reduced ? (
              <Styled.Title to="/" language={locale}>
                {t("common:title")}
              </Styled.Title>
            ) : (
              <MiscTabs
                currentPath={currentPath}
                locale={locale}
                aside={reduced}
              />
            )}

            <Styled.Logo src={VnlabLogo} alt="vnLab logo" />
          </Styled.Nav>
          <AnimatePresence>
            {open && (
              <Styled.NavMenuContent
                initial={{ translateX: -1500 }}
                animate={{ translateX: 0 }}
                exit={{ translateX: -1500 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Styled.Tabs sticky>
                  <Styled.TabItems>
                    <Styled.TabButton
                      onClick={() => setNavState(NAV_MENU_STATES.TOC)}
                    >
                      <Styled.TabButtonText
                        active={navState === NAV_MENU_STATES.TOC}
                      >
                        {t("nav-menu:tabs.toc")}
                      </Styled.TabButtonText>
                    </Styled.TabButton>
                    <Styled.TabButton
                      onClick={() => setNavState(NAV_MENU_STATES.INDEXES)}
                    >
                      <Styled.TabButtonText
                        active={navState === NAV_MENU_STATES.INDEXES}
                      >
                        {t("nav-menu:tabs.indexes")}
                      </Styled.TabButtonText>
                    </Styled.TabButton>
                    <Styled.TabButton
                      onClick={() => setNavState(NAV_MENU_STATES.ABOUT)}
                    >
                      <Styled.TabButtonText
                        active={navState === NAV_MENU_STATES.ABOUT}
                      >
                        {t("nav-menu:tabs.about")}
                      </Styled.TabButtonText>
                    </Styled.TabButton>
                  </Styled.TabItems>
                  <Styled.TabItems noFlex>
                    <MiscTabs currentPath={currentPath} locale={locale} />
                  </Styled.TabItems>
                </Styled.Tabs>
                <ActiveTab navState={navState} />
                <NextTab navState={navState} setNavState={setNavState} />
                <Styled.AnnotationsButton
                  onClick={() =>
                    navigate(
                      localizedPath({
                        locale,
                        prefixDefault,
                        defaultLang,
                        path: "/hypothesis_tutorial",
                      })
                    )
                  }
                >
                  {t("nav-menu:how_to_annotate")}
                </Styled.AnnotationsButton>
              </Styled.NavMenuContent>
            )}
          </AnimatePresence>
        </Styled.Aside>
      )}
    </AnimatePresence>
  )
}

export default NavigationMenu
