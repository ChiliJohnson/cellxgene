import React from "react";
import { connect } from "react-redux";
import { AnchorButton, ButtonGroup, Tooltip } from "@blueprintjs/core";
import * as globals from "../../globals";
import actions from "../../actions";
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module './menubar.css' or its correspo... Remove this comment to see the full error message
import styles from "./menubar.css";

// @ts-expect-error ts-migrate(1238) FIXME: Unable to resolve signature of class decorator whe... Remove this comment to see the full error message
@connect((state) => ({
  reembedController: (state as any).reembedController,
  annoMatrix: (state as any).annoMatrix,
}))
class Reembedding extends React.PureComponent {
  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'dispatch' does not exist on type 'Readon... Remove this comment to see the full error message
    const { dispatch, annoMatrix, reembedController } = this.props;
    const loading = !!reembedController?.pendingFetch;
    const disabled = annoMatrix.nObs === annoMatrix.schema.dataframe.nObs;
    const tipContent = disabled
      ? "Subset cells first, then click to recompute UMAP embedding."
      : "Click to recompute UMAP embedding on the current cell subset.";
    return (
      <ButtonGroup className={styles.menubarButton}>
        <Tooltip
          content={tipContent}
          position="bottom"
          hoverOpenDelay={globals.tooltipHoverOpenDelay}
        >
          <AnchorButton
            icon="new-object"
            disabled={disabled}
            onClick={() => dispatch(actions.requestReembed())}
            loading={loading}
          />
        </Tooltip>
      </ButtonGroup>
    );
  }
}

export default Reembedding;
