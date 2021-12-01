import { useEffect, useState } from "react"

export default function useHypothesis() {
  const [hypothesis, setHypothesis] = useState<Element | null>(null)

  useEffect(() => {
    if (hypothesis !== null) return

    const el = document.querySelector("hypothesis-sidebar")
    setHypothesis(el)
  }, [hypothesis])

  const isHidden = () => {
    if (!!!hypothesis) return true

    return hypothesis.classList.contains("invisible")
  }

  const hideHypothesis = () => {
    if (!!!hypothesis || isHidden()) return

    hypothesis.classList.add("invisible")
  }

  const showHypothesis = () => {
    if (!!!hypothesis || !isHidden()) return

    hypothesis.classList.remove("invisible")
  }

  return { hypothesis, showHypothesis, hideHypothesis, isHidden }
}
