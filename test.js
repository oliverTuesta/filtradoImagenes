function getValues(matrix, x, y) {
    let values = new Array();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (
                x - 1 + j < 0 ||
                x - 1 + j >= matrix[y].length ||
                y - 1 + i < 0 ||
                y - 1 + i >= matrix.length
            ) {
                values.push(0);
                continue;
            }
            values.push(matrix[y - 1 + i][x - 1 + j]);
        }
    }
    return values;
}
function filtroMediana(matrix) {
    let matrixCopia = Array(matrix.length);
    let k = 0;
    for (const arr of matrix) {
        matrixCopia[k] = Array(arr.length);

        k++;
    }
    for (let y in matrix) {
        for (let x in matrix[y]) {
            let values = getValues(matrix, x, y);
            let newPixelValue;
            values.sort();
            if (values.length % 2 == 0) {
                let mid1 = values[Math.floor(values.length / 2)];
                let mid2 = values[Math.floor(values.length / 2 - 1)];
                newPixelValue = Math.round((mid1 + mid2) / 2);
            } else newPixelValue = values[Math.floor(values.length / 2)];
            matrixCopia[y][x] = newPixelValue;
        }
    }
    return matrixCopia;
}

function filtroMedia(matrix, filtro) {
    let matrixCopia = Array(matrix.length);
    let k = 0;
    for (const arr of matrix) {
        matrixCopia[k] = Array(arr.length);
        k++;
    }
    for (let y in matrix) {
        for (let x in matrix[y]) {
            let values = getValues(matrix, x, y);

            let suma = 0;
            let i = 0;
            for (const arr of filtro) {
                for (const num of arr) {
                    suma += num * values[i];
                    i++;
                    if (i >= values.length) break;
                }
            }
            let newPixelValue = Math.round(suma / 16);

            matrixCopia[y][x] = newPixelValue;
        }
    }
    return matrixCopia;
}

function convertToMatrix(pixels, w, h) {
    let matrix = Array(h)
        .fill()
        .map(() => Array(w));
    let i = 0,
        j = 0;
    for (let k = 0; k < pixels.length; k++) {
        matrix[i][j] = pixels[k];
        j++;
        if (j >= w) {
            j = 0;
            i++;
        }
    }
    return matrix;
}

let mascara = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

let imgOriginal = [
    0, 4, 3, 3, 3, 4, 4, 3, 7, 3, 4, 4, 3, 3, 3, 0, 4, 3, 3, 3, 4, 4, 3, 7, 3
];
matrix = convertToMatrix(imgOriginal, 5, 5);
console.log(matrix);
console.log(filtroMediana(matrix));
resultado = filtroMedia(matrix, mascara);
console.log(resultado);
console.log(resultado[3][4]);
console.log(resultado[2][0]);
console.log(resultado[1][1]);
console.log(resultado[3][2]);
