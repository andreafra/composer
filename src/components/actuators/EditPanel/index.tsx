import { Panel, PanelType } from '@fluentui/react/lib/Panel'
import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setEditPanelVisibility } from 'store/actions'
import { ComposerState } from 'types'
import ActuatorConfig from './configs/actuator'
import FrameConfig from './configs/frame'
import { TextField, Label, SpinButton, DetailsList, IDetailsItemProps, DetailsListLayoutMode } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'

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

function SystemConfig() {
  
  const system = useSelector((state: ComposerState) => state.system)

  return <div>
    <TextField
      label="File name"
      defaultValue={system.filename}
    />
    <TextField
      label="Author"
      defaultValue={system.username}
    />
    <SpinButton
      defaultValue={system.editorOptions.resolution.toString()}
      label={'Tempo (ms)'}
      min={0}
      max={10000}
      step={1}
      iconProps={{ iconName: 'Timer' }}
      incrementButtonAriaLabel={'Increase value by 1'}
      decrementButtonAriaLabel={'Decrease value by 1'}
    />
    <SpinButton
      defaultValue={(system.editorOptions.width/system.editorOptions.frameSize).toString()}
      label={'Length (frames)'}
      min={0}
      max={10000}
      step={1}
      iconProps={{ iconName: 'FitWidth' }}
      incrementButtonAriaLabel={'Increase value by 1'}
      decrementButtonAriaLabel={'Decrease value by 1'}
    />
  </div>
}
