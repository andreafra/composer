import React, { useRef, useEffect, useContext, Context, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { ComposerState } from "types"
import { setScroll } from "store/actions"

export const ScrollContext = React.createContext({
  scroll: 0,
  updateScroll: (newScroll: number) => {}
})

function ScrollableContainer(props: {
  children: JSX.Element | JSX.Element[]
}) {
  const [scroll, setScroll] = useState(0)

  const updateScroll= (newScroll: number) => {
    setScroll(newScroll)
  }

  return (
    <ScrollContext.Provider value={{scroll, updateScroll}}>
      {props.children}
    </ScrollContext.Provider>
  )
}

function ScrollableDiv(props: {
  children: JSX.Element
}) {

  const dispatch = useDispatch()
  // const scroll = useSelector((state: ComposerState)=> state.system.leftScroll)

  const _scrollCtx = useContext(ScrollContext)

  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (divRef && divRef.current) {
      divRef.current.scrollTo({
        left: _scrollCtx.scroll,
        behavior: "auto"
      })
    }
  }, [_scrollCtx.scroll])

  const _handleScroll = () => {
    _scrollCtx.updateScroll(divRef.current?.scrollLeft || 0)
    // dispatch(setScroll(divRef.current?.scrollLeft || 0))

  }

  return (
    <div className="App-scrollable"
      ref={divRef}
      onScroll={_handleScroll}
    >
      {props.children}
    </div>
  )
}

export {
  ScrollableContainer,
  ScrollableDiv
}
