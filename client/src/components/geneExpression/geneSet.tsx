import React from "react";
import { connect } from "react-redux";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import actions from "../../actions";
import Gene from "./gene";
import { memoize } from "../../util/dataframe/util";
import Truncate from "../util/truncate";
import * as globals from "../../globals";
import GenesetMenus from "./menus/genesetMenus";
import EditGenesetNameDialogue from "./menus/editGenesetNameDialogue";
import HistogramBrush from "../brushableHistogram";

import { diffexpPopNamePrefix1, diffexpPopNamePrefix2 } from "../../globals";

type State = any;

// @ts-expect-error ts-migrate(1238) FIXME: Unable to resolve signature of class decorator whe... Remove this comment to see the full error message
@connect((state, ownProps) => {
  return {
    world: (state as any).world,
    userDefinedGenes: (state as any).controls.userDefinedGenes,
    userDefinedGenesLoading: (state as any).controls.userDefinedGenesLoading,
    isColorAccessor:
      (state as any).colors.colorAccessor === (ownProps as any).setName,
  };
})
class GeneSet extends React.Component<{}, State> {
  // @ts-expect-error ts-migrate(2729) FIXME: Property '_genesToUpper' is used before its initia... Remove this comment to see the full error message
  _memoGenesToUpper = memoize(this._genesToUpper, (arr: any) => arr);

  constructor(props: {}) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  _genesToUpper = (listGenes: any) => {
    // Has to be a Map to preserve index
    const upperGenes = new Map();
    for (let i = 0, { length } = listGenes; i < length; i += 1) {
      upperGenes.set(listGenes[i].toUpperCase(), i);
    }

    return upperGenes;
  };

  fetchGenes = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'world' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { world, dispatch, setGenes } = this.props;
    const varIndexName = world.schema.annotations.var.index;

    const worldGenes = world.varAnnotations.col(varIndexName).asArray();

    const upperGenes = this._genesToUpper(setGenes);
    const upperWorldGenes = this._memoGenesToUpper(worldGenes);

    dispatch({ type: "bulk user defined gene start" });

    Promise.all(
      [...upperGenes.keys()].map((upperGene) => {
        const indexOfGene = upperWorldGenes.get(upperGene);

        return dispatch(
          actions.requestUserDefinedGene(worldGenes[indexOfGene])
        );
      })
    ).then(
      () => dispatch({ type: "bulk user defined gene complete" }),
      () => dispatch({ type: "bulk user defined gene error" })
    );

    return undefined;
  };

  onGenesetMenuClick = () => {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  };

  onColorChangeClick = () => {
    //   const { dispatch, setName } = this.props;
    //   dispatch({
    //     type: "color by gene set",
    //     colorAccessor: setName,
    //   });
  };

  renderGenes() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setName' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { setName, setGenes, setGenesWithDescriptions } = this.props;

    return (
      <div data-testclass="gene-set-genes">
        {setGenes.map((gene: any) => {
          const { geneDescription } = setGenesWithDescriptions.get(gene);

          return (
            <Gene
              key={gene}
              // @ts-expect-error ts-migrate(2322) FIXME: Type '{ key: any; gene: any; geneDescription: any;... Remove this comment to see the full error message
              gene={gene}
              geneDescription={geneDescription}
              geneset={setName}
            />
          );
        })}
      </div>
    );
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'setName' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { setName, setGenes, genesetDescription } = this.props;
    const { isOpen } = this.state;
    const genesetNameLengthVisible = 150; /* this magic number determines how much of a long geneset name we see */
    const genesetIsEmpty = setGenes.length === 0;
    let testClass = "geneset-expand";

    if (setName.includes(diffexpPopNamePrefix1))
      testClass = "pop-1-geneset-expand";
    else if (setName.includes(diffexpPopNamePrefix2))
      testClass = "pop-2-geneset-expand";

    return (
      <div style={{ marginBottom: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            role="menuitem"
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'number | ... Remove this comment to see the full error message
            tabIndex="0"
            data-testclass={testClass}
            data-testid={`${setName}:geneset-expand`}
            onKeyPress={
              /* TODO(colinmegill): #2101: click handler on span */ () => {}
            }
            style={{
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={this.onGenesetMenuClick}
          >
            <Truncate
              tooltipAddendum={
                genesetDescription ? `: ${genesetDescription}` : ""
              }
            >
              <span
                style={{
                  maxWidth: globals.leftSidebarWidth - genesetNameLengthVisible,
                }}
                data-testid={`${setName}:geneset-name`}
              >
                {setName}
              </span>
            </Truncate>
            {isOpen ? (
              <FaChevronDown
                data-testclass="geneset-expand-is-expanded"
                style={{ fontSize: 10, marginLeft: 5 }}
              />
            ) : (
              <FaChevronRight
                data-testclass="geneset-expand-is-not-expanded"
                style={{ fontSize: 10, marginLeft: 5 }}
              />
            )}
          </span>
          <div>
            {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ isOpen: any; genesetsEditable: true; genes... Remove this comment to see the full error message */}
            <GenesetMenus isOpen={isOpen} genesetsEditable geneset={setName} />
          </div>
        </div>

        <div style={{ marginLeft: 15, marginTop: 5, marginRight: 0 }}>
          {isOpen && genesetIsEmpty && (
            <p style={{ fontStyle: "italic", color: "lightgrey" }}>
              No genes to display
            </p>
          )}
        </div>
        {isOpen && !genesetIsEmpty && setGenes.length > 0 && (
          <HistogramBrush
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            isGeneSetSummary
            field={setName}
            setGenes={setGenes}
          />
        )}
        {isOpen && !genesetIsEmpty && this.renderGenes()}
        <EditGenesetNameDialogue
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ parentGeneset: any; parentGenesetDescripti... Remove this comment to see the full error message
          parentGeneset={setName}
          parentGenesetDescription={genesetDescription}
        />
      </div>
    );
  }
}

export default GeneSet;
