// Catching the DOM
const imgFil_canvas = document.getElementById('imagen_filtrada');
const imgOrg_canvas = document.getElementById('imagen_original');
const filtro_select = document.getElementById('filtro');

const contextImgFil = imgFil_canvas.getContext('2d');
const contextImgOrg = imgOrg_canvas.getContext('2d');
let imageUploaded = new Image();
let uploaded_image = null;

const downloadCanvas = () => {
    const dataURL = imgFil_canvas
        .toDataURL('image/png', 1.0)
        .replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.download = 'my-image.png';
    link.href = dataURL;
    link.click();
};

const image_input = document.querySelector('#image_input');
image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        uploaded_image = reader.result;
        document.querySelector(
            '#display_image'
        ).style.backgroundImage = `url(${uploaded_image})`;

        imageUploaded.src = uploaded_image;
    });
    reader.readAsDataURL(this.files[0]);
});

imageUploaded.onload = () => {
    imgOrg_canvas.width = imageUploaded.width;
    imgOrg_canvas.height = imageUploaded.height;

    imgFil_canvas.width = imageUploaded.width;
    imgFil_canvas.height = imageUploaded.height;

    //contextImgOrg.filter = 'grayscale(1)';
    contextImgOrg.drawImage(
        imageUploaded,
        0,
        0,
        imageUploaded.width,
        imageUploaded.height
    );
};

function convertToMatriz(pixels) {
    let matriz = Array(imageUploaded.height)
        .fill()
        .map(() => Array(imageUploaded.width));
    let i = 0,
        j = 0;
    for (let k = 0; k < pixels.length; k += 4) {
        matriz[i][j] = pixels[k];
        j++;
        if (j >= imageUploaded.width) {
            j = 0;
            i++;
        }
    }
    return matriz;
}

function convertToPixels(matriz, pixels) {
    let x = 0;
    //console.log(`matriz (${matriz.length} ${matriz[0].length})`);
    //console.log(`imagen (${imageUploaded.height} ${imageUploaded.width})`);

    for (const arr of matriz) {
        for (const value of arr) {
            pixels[x] = value;
            pixels[x + 1] = value;
            pixels[x + 2] = value;
            x += 4;
        }
    }
}

function submit() {
    let imgData = contextImgOrg.getImageData(
        0,
        0,
        imgOrg_canvas.width,
        imgOrg_canvas.height
    );

    //contextImgOrg.filter = 'grayscale(1)';
    let matriz = convertToMatriz(imgData.data);
    let pixels = imgData.data;
    switch (filtro_select.selectedIndex) {
        case 0: //FILTRO MEDIANA
            convertToPixels(filtroMediana(matriz), pixels);
            break;
        case 1: //FILTRO MEDIA 1/9
            convertToPixels(filtroMedia(matriz, 1), pixels);
            break;

        case 2: //FILTRO MEDIA 1/16
            convertToPixels(filtroMedia(matriz, 2), pixels);
            break;
        case 3: //FILTRO MEDIA laplaciano
            convertToPixels(filtroLaplaciano(matriz, 1), pixels);
            break;

        default:
            //for (let i = 0; i < pixels.length; i += 4) {
            //let lightness = parseInt(
            //(pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
            //);

            //pixels[i] = 255 - lightness;
            //pixels[i + 1] = 255 - lightness;
            //pixels[i + 2] = 255 - lightness;
            //}
            break;
    }
    contextImgFil.putImageData(imgData, 0, 0);
}

//***********************FILTROS***********************88
//
//MEDIANA
function filtroMediana(matriz) {
    let matrizCopia = Array(matriz.length);
    let k = 0;
    for (const arr of matriz) {
        matrizCopia[k] = Array(arr.length);

        k++;
    }
    for (let y in matriz) {
        for (let x in matriz[y]) {
            let values = new Array();
            for (let i = 0; i < 3; i++) {
                if (y - 1 + i < 0 || y - 1 + i >= matriz.length) {
                    continue;
                }
                for (let j = 0; j < 3; j++) {
                    if (x - 1 + j < 0 || x - 1 + j >= matriz[y].length)
                        continue;
                    values.push(matriz[y - 1 + i][x - 1 + j]);
                }
            }
            let newPixelValue;
            values.sort();
            if (values.length % 2 == 0) {
                let mid1 = values[Math.floor(values.length / 2)];
                let mid2 = values[Math.floor(values.length / 2 - 1)];
                newPixelValue = Math.round((mid1 + mid2) / 2);
            } else newPixelValue = values[Math.floor(values.length / 2)];
            matrizCopia[y][x] = newPixelValue;
        }
    }
    return matrizCopia;
}
//MEDIA
const filtro1 = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
];
const filtro1V = 9;
const filtro2 = [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];
const filtro2V = 16;
function filtroMedia(matriz, opcion) {
    let filtro = [];
    let filtroV = 1;
    switch (opcion) {
        case 1:
            filtro = [...filtro1];
            filtroV = filtro1V;
            break;
        case 2:
            filtro = [...filtro2];
            filtroV = filtro2V;
            break;
        default:
    }

    let matrizCopia = Array(matriz.length);
    let k = 0;
    for (const arr of matriz) {
        matrizCopia[k] = Array(arr.length);
        k++;
    }
    for (let y in matriz) {
        for (let x in matriz[y]) {
            let values = new Array();
            for (let i = 0; i < filtro.length; i++) {
                if (y - 1 + i < 0 || y - 1 + i >= matriz.length) {
                    continue;
                }
                for (let j = 0; j < filtro.length; j++) {
                    if (x - 1 + j < 0 || x - 1 + j >= matriz[y].length)
                        continue;
                    values.push(matriz[y - 1 + i][x - 1 + j]);
                }
            }
            let suma = 0;
            let i = 0;
            for (const arr of filtro) {
                for (const num of arr) {
                    suma += num * values[i];
                    i++;
                    if (i >= values.length) break;
                }
            }
            let newPixelValue = Math.round(suma / filtroV);

            matrizCopia[y][x] = newPixelValue;
        }
    }
    return matrizCopia;
}

const laplaciano1 = [
    [1, 1, 1],
    [1, -8, 1],
    [1, 1, 1]
];
const laplaciano2 = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0]
];
const laplaciano3 = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
];
function filtroLaplaciano(matriz, opcion) {
    let filtro = [...laplaciano3];
    switch (opcion) {
        case 1:
            //filtro = [...filtro1];
            break;
        case 2:
            //filtro = [...filtro2];
            break;
        default:
    }
    let mayor = Number.MIN_SAFE_INTEGER;
    let menor = Number.MAX_SAFE_INTEGER;
    let matrizCopia = Array(matriz.length);
    let k = 0;
    for (const arr of matriz) {
        matrizCopia[k] = Array(arr.length);
        k++;
    }
    for (let y in matriz) {
        for (let x in matriz[y]) {
            let values = new Array();
            for (let i = 0; i < 3; i++) {
                if (y - 1 + i < 0 || y - 1 + i >= matriz.length) {
                    continue;
                }
                for (let j = 0; j < 3; j++) {
                    if (x - 1 + j < 0 || x - 1 + j >= matriz[y].length)
                        continue;
                    values.push(matriz[y - 1 + i][x - 1 + j]);
                }
            }
            let suma = 0;
            let i = 0;
            for (const arr of filtro) {
                for (const num of arr) {
                    suma += num * values[i];
                    i++;
                    if (i >= values.length) break;
                }
            }
            let newPixelValue = Math.round(suma);
            if (mayor < newPixelValue) mayor = newPixelValue;
            if (menor > newPixelValue) menor = newPixelValue;
            matrizCopia[y][x] = newPixelValue;
        }
    }
    console.log(menor, mayor);

    expandirHistograma(matrizCopia, menor, mayor);
    return matrizCopia;
}
function expandirHistograma(histograma, menor, mayor) {
    let m = 255 / (mayor - menor);
    let b = -m * menor;
    const ecuacion = (r) => m * r + b;
    for (let i in histograma) {
        for (let j in histograma[i]) {
            histograma[i][j] = ecuacion(histograma[i][j]);
        }
    }
    console.log(ecuacion(menor), ecuacion(mayor));
}
