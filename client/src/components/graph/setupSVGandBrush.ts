import * as d3 from "d3";
import Lasso from "./setupLasso";

/******************************************
*******************************************
          put svg & brush in DOM
*******************************************
******************************************/

export default (
  selectionToolType: any,
  handleStartAction: any,
  handleDragAction: any,
  handleEndAction: any,
  handleCancelAction: any,
  viewport: any
) => {
  const svg = d3.select("#graph-wrapper").select("#lasso-layer");
  if (svg.empty()) return {};

  if (selectionToolType === "brush") {
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [viewport.width, viewport.height],
      ])
      .on("start", handleStartAction)
      .on("brush", handleDragAction)
      // FYI, brush doesn't generate cancel
      .on("end", handleEndAction);

    const brushContainer = svg
      .append("g")
      .attr("class", "graph_brush")
      .call(brush);

    return { svg, container: brushContainer, tool: brush };
  }

  if (selectionToolType === "lasso") {
    const lasso = Lasso()
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'on' does not exist on type 'void'.
      .on("end", handleEndAction)
      // FYI, Lasso doesn't generate drag
      .on("start", handleStartAction)
      .on("cancel", handleCancelAction);

    const lassoContainer = svg.call(lasso);

    return { svg, container: lassoContainer, tool: lasso };
  }

  throw new Error("unknown graph selection tool");
};
