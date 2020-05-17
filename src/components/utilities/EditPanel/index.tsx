import { Panel, PanelType } from '@fluentui/react/lib/Panel'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditPanelVisibility } from 'store/actions'
import { ComposerState } from 'types'
import ActuatorConfig from './configs/actuator'
import FrameConfig from './configs/frame'
import SystemConfig from './configs/system'

// The panel type and description are passed in by the PanelSizesExample component (later in this file)
function EditPanel() {
  const editPanel = useSelector((state: ComposerState) => state.system.editPanel)
  const dispatch = useDispatch()

  return (
    <div>
      <Panel
        isLightDismiss
        isOpen={editPanel.visibility}
        onDismiss={() => dispatch(setEditPanelVisibility(false))}
        type={PanelType.customNear}
        closeButtonAriaLabel="Close"
        headerText={editPanel.scope.toLowerCase() + " options" }
        customWidth={"400px"}
      >
        <ContentSwitcher />
      </Panel>
    </div>
  )
}

export default EditPanel

function ContentSwitcher() {
  const scope = useSelector((state: ComposerState) => state.system.editPanel.scope)
  switch (scope) {
    case "SYSTEM":
      return <SystemConfig />
  
      case "ACTUATOR":
        return <>
          <ActuatorConfig />
        </>
        
      case "FRAME":
          return <FrameConfig />

    default:
      return <p>No matching panel found</p>
  }
}
