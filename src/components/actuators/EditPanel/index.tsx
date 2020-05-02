import * as React from 'react'
import { DefaultButton } from '@fluentui/react/lib/Button'
import { Panel, PanelType } from '@fluentui/react/lib/Panel'
import { useConstCallback } from '@uifabric/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { ComposerState } from 'types'
import { setEditPanelVisibility, setEditPanelScope } from 'store/actions'

// The panel type and description are passed in by the PanelSizesExample component (later in this file)
function EditPanel() {
  const isOpen = useSelector((state: ComposerState) => state.system.editPanelVisibility)
  const dispatch = useDispatch()

  return (
    <div>
      <Panel
        isOpen={isOpen}
        onDismiss={() => dispatch(setEditPanelVisibility(false))}
        type={PanelType.smallFixedNear}
        closeButtonAriaLabel="Close"
        headerText="Edit"
      >
        <p>HELLO</p>
      </Panel>
    </div>
  )
}

export default EditPanel
