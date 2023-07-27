const sao = document.getElementById("")


function parseMatrix(matrixString) {
  return matrixString.trim().split("\n").map(row => row.split(/\s+/).map(parseFloat));
}


function getMatrixDimensions(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  return [numRows, numCols];
}

function printMatrix(matrix) {
  const resultContainer = document.getElementById("resultContainer");
  if (typeof matrix === "number") {
    resultContainer.textContent = matrix;
  } else {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    let matrixString = "";

    for (let i = 0; i < numRows; i++) {
      matrixString += "[";
      for (let j = 0; j < numCols; j++) {
        matrixString += `<span>${matrix[i][j]}</span>`;
        if (j !== numCols - 1) {
          matrixString += "  ";
        }
      }
      matrixString += "]";
      if (i !== numRows - 1) {
        matrixString += "<br>";
      }
    }

    resultContainer.innerHTML = matrixString;
  }
}


function addMatrices(matrix1, matrix2) {
  const dimensions1 = getMatrixDimensions(matrix1);
  const dimensions2 = getMatrixDimensions(matrix2);

  if (dimensions1[0] !== dimensions2[0] || dimensions1[1] !== dimensions2[1]) {
    alert("Error: Matrix sizes don't match!");
    return null;
  }

  const resultMatrix = matrix1.map((row, i) =>
    row.map((value, j) => value + matrix2[i][j])
  );

  return resultMatrix;
}

function subtractMatrices(matrix1, matrix2) {
  const dimensions1 = getMatrixDimensions(matrix1);
  const dimensions2 = getMatrixDimensions(matrix2);

  if (dimensions1[0] !== dimensions2[0] || dimensions1[1] !== dimensions2[1]) {
    alert("Error: Matrix sizes don't match!");
    return null;
  }

  const resultMatrix = matrix1.map((row, i) =>
    row.map((value, j) => value - matrix2[i][j])
  );

  return resultMatrix;
}


function multiplyMatrices(matrix1, matrix2) {
  if (!matrix2) {
    alert("Error: Enter the second matrix for multiplication.");
    return null;
  }

  const dimensions1 = getMatrixDimensions(matrix1);
  const dimensions2 = getMatrixDimensions(matrix2);

  if (dimensions1[1] !== dimensions2[0]) {
    alert("Error: Matrix sizes don't match for multiplication.");
    return null;
  }

  const resultMatrix = Array.from({ length: dimensions1[0] }, (_, i) =>
    Array.from({ length: dimensions2[1] }, (_, j) =>
      matrix1[i].reduce((sum, value, k) => sum + value * matrix2[k][j], 0)
    )
  );

  return resultMatrix;
}

function transposeMatrix(matrix) {
  const resultMatrix = matrix[0].map((_, i) => matrix.map((row) => row[i]));
  return resultMatrix;
}

function getMatrixMinor(matrix, i, j) {
  return matrix.filter((_, rowIndex) => rowIndex !== i).map((row) =>
    row.filter((_, colIndex) => colIndex !== j)
  );
}

function getMatrixDeterminant(matrix) {
  if (matrix.length === 1) {
    return matrix[0][0];
  } else if (matrix.length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  } else {
    let determinant = 0;
    for (let j = 0; j < matrix.length; j++) {
      const subMatrix = getMatrixMinor(matrix, 0, j);
      determinant +=
        Math.pow(-1, j) * matrix[0][j] * getMatrixDeterminant(subMatrix);
    }
    return determinant;
  }
}

function getMatrixInverse(matrix) {
  if (matrix.length !== matrix[0].length) {
    alert("Error: Matrix is not square.");
    return null;
  }

  const n = matrix.length;
  const augMatrix = matrix.map((row, i) => [...row, ...(new Array(n).fill(0))]);
  for (let i = 0; i < n; i++) {
    if (augMatrix[i][i] === 0) {
      for (let j = i + 1; j < n; j++) {
        if (augMatrix[j][i] !== 0) {
          [augMatrix[i], augMatrix[j]] = [augMatrix[j], augMatrix[i]];
          break;
        }
      }
      if (augMatrix[i][i] === 0) {
        alert("Error: Matrix is singular.");
        return null;
      }
    }

    const diagonal = augMatrix[i][i];
    for (let j = 0; j < n * 2; j++) {
      augMatrix[i][j] /= diagonal;
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = augMatrix[j][i];
        for (let k = 0; k < n * 2; k++) {
          augMatrix[j][k] -= factor * augMatrix[i][k];
        }
      }
    }
  }

  const invMatrix = augMatrix.map((row) => row.slice(n));

  return invMatrix;
}

function operateMatrices(matrix1, matrix2, operator) {
  if (operator === "+") {
    return addMatrices(matrix1, matrix2);
  } else if (operator === "-") {
    return subtractMatrices(matrix1, matrix2);
  } else if (operator === "*") {
    return multiplyMatrices(matrix1, matrix2);
  } else if (operator === "t" || operator === "T") {
    return transposeMatrix(matrix1);
  } else if (operator === "det") {
    if (matrix1.length !== matrix1[0].length) {
      alert("Error: Matrix must be square.");
      return null;
    }
    return getMatrixDeterminant(matrix1);
  } else if (operator === "inv") {
    if (matrix1.length !== matrix1[0].length) {
      alert("Error: Matrix must be square.");
      return null;
    }
    return getMatrixInverse(matrix1);
  } else {
    alert("Error: Invalid operator.");
    return null;
  }
}

function calculate() {
  const matrix1Input = document.getElementById("matrix1Input").value;
  const matrix2Input = document.getElementById("matrix2Input").value;
  const operatorSelect = document.getElementById("operatorSelect");

  const matrix1 = parseMatrix(matrix1Input);
  const matrix2 = parseMatrix(matrix2Input)
  // const matrix2 = operatorSelect.value !== "*" ? parseMatrix(matrix2Input) : null;
  const operator = operatorSelect.value;

  let resultMatrix;
  switch (operator) {
    case "+":
      resultMatrix = operateMatrices(matrix1, matrix2, operator);
      break;
    case "-":
      resultMatrix = operateMatrices(matrix1, matrix2, operator);
      break;
    case "*":
      resultMatrix = operateMatrices(matrix1, matrix2, operator);
      break;
    case "t":
      resultMatrix = operateMatrices(matrix1, null, operator);
      break;
    case "det":
      resultMatrix = operateMatrices(matrix1, null, operator);
      break;
    case "inv":
      resultMatrix = operateMatrices(matrix1, null, operator);
      break;
    default:
      resultMatrix = null;
  }

  if (resultMatrix !== null) {
    printMatrix(resultMatrix);
  }
}






















setSelectHover();

function setSelectHover(selector = "select") {
  let selects = document.querySelectorAll(selector);
  selects.forEach((select) => {
    let selectWrap = select.parentNode.closest(".select-wrap");
    // wrap select element if not previously wrapped
    if (!selectWrap) {
      selectWrap = document.createElement("div");
      selectWrap.classList.add("select-wrap");
      select.parentNode.insertBefore(selectWrap, select);
      selectWrap.appendChild(select);
    }
    // set expanded height according to options
    let size = 8;

    // adjust height on resize
    const getSelectHeight = () => {
      selectWrap.style.height = "auto";
      let selectHeight = select.getBoundingClientRect();
      selectWrap.style.height = selectHeight.height + "px";
    };
    getSelectHeight(select);
    window.addEventListener("resize", (e) => {
      getSelectHeight(select);
    });

    /**
     * focus and click events will coincide
     * adding a delay via setTimeout() enables the handling of
     * clicks events after the select is focused
     */
    let hasFocus = false;
    select.addEventListener("focus", (e) => {
      select.setAttribute("size", size);
      setTimeout(() => {
        hasFocus = true;
      }, 150);
    });

    // close select if already expanded via focus event
    select.addEventListener("click", (e) => {
      if (hasFocus) {
        select.blur();
        hasFocus = false;
      }
    });

    // close select if selection was set via keyboard controls
    select.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        select.removeAttribute("size");
        select.blur();
      }
    });

    // collapse select
    select.addEventListener("blur", (e) => {
      select.removeAttribute("size");
      hasFocus = false;
    });
  });
}