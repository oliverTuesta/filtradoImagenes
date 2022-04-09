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

function filtroMedia(matrix, filtro, divisor) {
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
                }
            }
            let newPixelValue = Math.round(suma / divisor);

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

function filtroLaplaciano(matrix, mascara) {
    let mayor = Number.MIN_SAFE_INTEGER;
    let menor = Number.MAX_SAFE_INTEGER;
    let matrixCopia = Array(matrix.length);
    let k = 0;
    for (const arr of matrix) {
        matrixCopia[k] = Array(arr.length);
        k++;
    }
    for (let y in matrix) {
        for (let x in matrix[y]) {
            let values = getValues(matrix, x, y, mascara.length);
            let suma = 0;
            let i = 0;
            for (const arr of mascara) {
                for (const num of arr) {
                    suma += num * values[i];
                    i++;
                    if (i >= values.length) break;
                }
            }
            let newPixelValue = Math.round(suma);
            if (mayor < newPixelValue) mayor = newPixelValue;
            if (menor > newPixelValue) menor = newPixelValue;
            matrixCopia[y][x] = newPixelValue;
        }
    }

    expandirHistograma(matrixCopia, menor, mayor);
    return matrixCopia;
}
function expandirHistograma(histograma, menor, mayor) {
    let m = 7 / (mayor - menor);
    let b = -m * menor;
    const ecuacion = (r) => Math.round(m * r + b);
    for (let i in histograma) {
        for (let j in histograma[i]) {
            histograma[i][j] = ecuacion(histograma[i][j]);
        }
    }
}

let mascara = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];

let mascaraLapla = [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1]
];

let histogrma = [1, 0, 0, 2, 7, 3, 3, 4, 4, 5, 2, 7, 1, 0, 1, 3];

let imgOriginal = [
    1, 0, 2, 2, 0, 7, 3, 3, 4, 1, 4, 5, 0, 7, 3, 1, 1, 1, 3, 5, 1, 6, 1, 4, 2
];
matrix = convertToMatrix(histogrma, 4, 4);
console.log(matrix);
resultado = filtroLaplaciano(matrix, mascaraLapla);
console.log(resultado);
