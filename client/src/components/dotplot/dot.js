import React from "react";

const Dot = (props) => {
  const {
    categoryValue,
    _categoryValueIndex,
    histogramMap,
    _geneSymbol,
    _geneIndex,
    rowColumnSize,
  } = props;

  const bins = histogramMap.has(categoryValue)
    ? histogramMap.get(categoryValue)
    : new Array(100).fill(0);

  const zeros = bins.shift(); /* MUTATES, REMOVES FIRST ELEMENT */
  const rest = bins.reduce(
    (acc, current) => acc + current
  ); /* SUM REMAINING ELEMENTS */

  /* TODO(colinmegill) #632 colorscale */

  return (
    <g
      id={`row_${categoryValue}_${_geneSymbol}`}
      key={`${_categoryValueIndex}_${categoryValue}`}
      transform={`translate(${_geneIndex * rowColumnSize}, ${
        _categoryValueIndex * rowColumnSize
      })`}
    >
      {_geneIndex === 0 && (
        <text
          textAnchor="end"
          style={{ fill: "black", font: "12px Roboto Condensed" }}
        >
          {categoryValue}
        </text>
      )}
      <circle
        r={(rest / zeros) * 10 > 20 ? 20 : (rest / zeros) * 10}
        cx="11"
        cy="-3.5"
        style={{
          fill: "steelblue",
          fillOpacity: 0.3,
          stroke: "none",
        }}
      />
    </g>
  );
};

export default Dot;
