import { IconButton, IIconProps, TooltipHost } from '@fluentui/react';
import { useId } from '@uifabric/react-hooks';
import React, { useState } from 'react';


interface FoldableDivProps {
  title: string
  children?: JSX.Element | JSX.Element[]
}

const hideIcon: IIconProps = { iconName: 'Hide3' };
const viewIcon: IIconProps = { iconName: 'View' };

export default function FoldableDiv(props: FoldableDivProps) {
  const [isVisible, setIsVisible] = useState(true)
  const tooltipId = useId('tooltip');
  return (<div>
      <h2 className="App-title">
        {props.title}
        <TooltipHost
          content="Toggle visibility"
          // This id is used on the tooltip itself, not the host
          // (so an element with this id only exists when the tooltip is shown)
          id={tooltipId}
        >
          <IconButton
            iconProps={isVisible ? hideIcon : viewIcon }
            title={isVisible ? "Hide" : "Show"}
            ariaLabel={isVisible ? "Hide" : "Show"}
            onClick={() => setIsVisible(!isVisible)}
          />
        </TooltipHost>
      </h2>
      { isVisible
      ? <div>{props.children}</div>
      : null }
    </div>
  )
}
