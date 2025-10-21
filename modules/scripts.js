import { getRandomArray } from "./utils.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 360;

let SPEED = 0.8;
let DELAY = (1 / SPEED) * 25;
let FREQ = 120;
const GAP = 2;
const X = 100;
const Y = 320;
let W = (600 - (FREQ * GAP)) / FREQ;
const MIN = 10;
const MAX = 250;

const BLUE = "rgba(0, 82, 171, 1)";
const RED = "rgba(171, 0, 0, 1)";
const GREEN = "rgba(100, 171, 0, 1)";
const YELLOW = "rgba(255, 196, 0, 1)";
const ORANGE = "rgba(190, 108, 0, 1)";

let barArray = [];
let timeoutArray = [];

// Bar Class
class Bar {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;

        this.drawBar();
    }

    drawBar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        ctx.font = `bold 0.7rem "Roboto Mono", "Roboto Mono", "Vazirmatn", monospace`;
        ctx.fillStyle = '#979797ff'; // Sets the fill color for the text
        ctx.textAlign = 'center'; // Aligns text horizontally
        ctx.textBaseline = 'middle'; // Aligns text vertically

        let text = `${-this.h}`;
        let textX = this.x + this.w / 2;
        let textY = this.y + 12;
        if (FREQ <= 20) {
            ctx.fillText(text, textX, textY); // Draws filled text
        }
    }
}

// Initialize barArray
const setBarArray = () => {
    barArray = [];
    let h = getRandomArray(MIN, MAX, FREQ);
    for (let idx = 0; idx < FREQ; idx++) {
        let bar = new Bar(X + idx * (W + GAP), Y, W, -h[idx], BLUE);
        barArray.push(bar);
    }
}

// Draw barArray
const drawBarArray = () => {
    barArray.forEach(bar => {
        bar.drawBar();
    });
}

// Change bar color
const changeBarColor = (idx, color) => {
    barArray[idx].color = color;
}

// Switch bar color
async function switchBackColor(idx, color) {
    changeBarColor(idx, color);
    await delay(DELAY);
    changeBarColor(idx, BLUE);
}

// // Move bar color from start index to end index
// const moveColorBar = (startIdx, endIdx, color) => {
//     for (let idx = startIdx; idx <= endIdx; idx++) {
//         setTimeout(() => {
//             switchBackColor(idx, color);
//         }, idx * DELAY);
//     }
// }

// // Swap bar values
// async function swapBar(firstBarIdx, secondBarIdx) {
//     await delay(DELAY);
//     [barArray[firstBarIdx].h, barArray[secondBarIdx].h] = [barArray[secondBarIdx].h, barArray[firstBarIdx].h];
// }

// Find Minimum
const findMinimum = (startIdx, endIdx) => {
    let min = Number.MAX_SAFE_INTEGER;
    let minIdx = 0;
    for (let idx = startIdx; idx <= endIdx; idx++) {
        if (min > -barArray[idx].h) {
            min = -barArray[idx].h;
            minIdx = idx;
        }
    }
    return minIdx;
}

// Clear red bars (bruteforce fix)
const clearRed = (startIdx, endIdx) => {
    for (let i = startIdx; i <= endIdx; i++) {
        changeBarColor(i, BLUE);
    }
}

// Add delay
const delay = (ms) => {
    return new Promise(resolve => {
        let timeoutId = setTimeout(resolve, ms);
        timeoutArray.push(timeoutId);
    });
}

const clearAllTimeout = () => {
    timeoutArray.forEach(timeoutId => {
        clearTimeout(timeoutId);
    });
    timeoutArray.length = 0;
}

// Selection Sort
async function selectionSort() {
    const n = FREQ;

    for (let i = 0; i < n - 1; i++) {
        clearRed(i, n - 1);
        let minIdx = i;
        changeBarColor(i, RED);

        // Step 1: Find smallest element
        for (let j = i + 1; j < n; j++) {
            changeBarColor(j, RED);
            await delay(DELAY);

            if (-barArray[j].h < -barArray[minIdx].h) {
                changeBarColor(minIdx, BLUE);
                minIdx = j;
                changeBarColor(minIdx, RED);
            } else {
                changeBarColor(j, BLUE);
            }
        }

        // Step 2: Swap with first unsorted
        if (minIdx !== i) {
            await delay(DELAY);
            [barArray[i].h, barArray[minIdx].h] = [barArray[minIdx].h, barArray[i].h];
        }

        // Step 3: Mark as sorted
        changeBarColor(i, GREEN);
        drawBarArray();
    }

    // Mark last bar as sorted
    changeBarColor(n - 1, GREEN);
    console.log("Selection Sort Complete");
}

// Insertion Sort
async function insertionSort() {
    const n = FREQ;

    for (let i = 1; i < n; i++) {
        // Mark first bar as sorted
        changeBarColor(0, GREEN);
        let j = i;
        changeBarColor(j, RED);
        await delay(DELAY);
        while (j > 0 && -barArray[j].h < -barArray[j - 1].h) {
            await delay(DELAY);
            [barArray[j].h, barArray[j - 1].h] = [barArray[j - 1].h, barArray[j].h];
            [barArray[j].color, barArray[j - 1].color] = [barArray[j - 1].color, barArray[j].color];
            j--;
        }
        // Mark last bar as sorted
        changeBarColor(j, GREEN);
    }
    console.log("Insertion Sort Complete");
}

// Bubble Sort
async function bubbleSort() {
    const n = FREQ;
    await delay(DELAY);
    for (let i = 0; i < n - 1; i++) {
        await delay(DELAY);
        let j = 0;
        for (j = 0; j < n - i - 1; j++) {
            await delay(DELAY);
            changeBarColor(j, RED);
            if (-barArray[j].h > -barArray[j + 1].h) {
                [barArray[j].h, barArray[j + 1].h] = [barArray[j + 1].h, barArray[j].h];
                [barArray[j].color, barArray[j + 1].color] = [barArray[j + 1].color, barArray[j].color];
            }
            else {
                [barArray[j].color, barArray[j + 1].color] = [barArray[j + 1].color, barArray[j].color];
            }
        }
        // Mark last bar as sorted
        changeBarColor(j, GREEN);
    }
    // Mark first bar as sorted
    changeBarColor(0, GREEN);
    console.log("Bubble Sort Complete");
}

// Merge Algorithm
async function mergeArray(arr, startIdx, midIdx, endIdx) {
    changeBarColor(startIdx, RED);
    changeBarColor(endIdx, RED);
    // To show unsorted array
    for (let i = startIdx + 1; i <= endIdx - 1; i++) {
        changeBarColor(i, BLUE);
    }

    // temp array sizes
    const n1 = midIdx - startIdx + 1;
    const n2 = endIdx - midIdx;

    // Create temp arrays
    const L = new Array(n1);
    const R = new Array(n2);

    // Copy data to temp arrays L[] and R[]
    for (let i = 0; i < n1; i++) {
        L[i] = -(arr[startIdx + i].h);
    }

    for (let j = 0; j < n2; j++) {
        R[j] = -(arr[midIdx + 1 + j].h);
    }

    let i = 0;
    let j = 0;
    let k = startIdx;

    // Merge the temp arrays back into original arr[startIdx..endIdx]
    while (i < n1 && j < n2) {
        await delay(DELAY);
        if (L[i] <= R[j]) {
            arr[k].h = -L[i];
            i++;
        } else {
            arr[k].h = -R[j];
            j++;
        }
        // Keep start and end index RED
        if (k != startIdx && k != endIdx)
            changeBarColor(k, YELLOW);
        k++;
    }

    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        await delay(DELAY);
        arr[k].h = -L[i];
        // Keep start and end index RED
        if (k != startIdx && k != endIdx)
            changeBarColor(k, YELLOW);
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        await delay(DELAY);
        arr[k].h = -R[j];
        // Keep start and end index RED
        if (k != startIdx && k != endIdx)
            changeBarColor(k, YELLOW);
        j++;
        k++;
    }

    // Make complete sorted array GREEN
    if (endIdx - startIdx + 1 == FREQ) {
        for (let i = 0; i < FREQ; i++) {
            await delay(DELAY);
            changeBarColor(i, GREEN);
        }
    }
}

// Merge Sort
async function mergeSortHelper(arr, startIdx, endIdx) {
    if (startIdx >= endIdx)
        return;

    let midIdx = Math.floor(startIdx + (endIdx - startIdx) / 2);

    await mergeSortHelper(arr, startIdx, midIdx);
    await mergeSortHelper(arr, midIdx + 1, endIdx);
    await mergeArray(arr, startIdx, midIdx, endIdx);
}

async function mergeSort() {
    await mergeSortHelper(barArray, 0, FREQ - 1);
    console.log("Merge Sort Complete");
}

// Partition Algorithm
async function partition(arr, startIdx, endIdx) {
    changeBarColor(endIdx, ORANGE);
    let pivot = -arr[endIdx].h;
    let i = startIdx;
    for (let j = startIdx; j <= endIdx - 1; j++) {
        if (j != endIdx)
            switchBackColor(j, RED);
        await delay(DELAY);
        if (-arr[j].h < pivot) {
            [arr[i].h, arr[j].h] = [arr[j].h, arr[i].h];
            i++;
        }
    }
    changeBarColor(endIdx, BLUE);
    [arr[i].h, arr[endIdx].h] = [arr[endIdx].h, arr[i].h];
    changeBarColor(i, YELLOW);
    return i;
}

// Quick Sort
async function quickSortHelper(arr, startIdx, endIdx) {
    if (startIdx < endIdx) {
        let pivotIdx = await partition(arr, startIdx, endIdx);
        changeBarColor(pivotIdx, YELLOW);
        await quickSortHelper(arr, startIdx, pivotIdx - 1);
        await quickSortHelper(arr, pivotIdx + 1, endIdx);
    }
}

async function quickSort() {
    await quickSortHelper(barArray, 0, FREQ - 1);
    for (let i = 0; i < FREQ; i++) {
        await delay(DELAY);
        changeBarColor(i, GREEN);
    }
    console.log("Quick Sort Complete");
}

const init = () => {
    clearAllTimeout();
    setBarArray();
    // changeBarColor(0,RED);
    // moveColorBar(0,10,RED);
    // drawRectangle();
    // swapBar(0, 10);
    // findMin(0, FREQ - 1);
    // selectionSort();
    // insertionSort();
    // bubbleSort();
    // mergeSort();
    // quickSort();
};

// init();

// Animate function
const animate = () => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBarArray();
};

animate();

// Event Listeners and DOM elements

const btn = document.getElementsByClassName("btn");
const startBtn = document.getElementById("start-btn");
const freqIp = document.getElementById("freq");
const speedIp = document.getElementById("speed");
let algoButton = [];

const addButtonId = (id) => {
    if (algoButton.length > 100)
        algoButton.length = 0;
    algoButton.push(id);
}

// For button input
document.addEventListener("click", (e) => {
    let button = document.getElementById(e.target.id);

    if (button != null && e.target.id != "start-btn" && e.target.id != "freq" && e.target.id != "freq-value" && e.target.id != "speed" && e.target.id != "speed-value") {
        addButtonId(e.target.id);
        for (let i = 0; i < 5; i++) {
            btn[i].classList.remove("highlight");
        }
        button.classList.add("highlight");
    }

    if (e.target.id == "selection-sort-btn" || e.target.id == "insertion-sort-btn" || e.target.id == "bubble-sort-btn" || e.target.id == "merge-sort-btn" || e.target.id == "quick-sort-btn") {
        init();
    }
    if (e.target.id == "start-btn") {
        if (algoButton.at(-1) == "selection-sort-btn") {
            init();
            selectionSort();
        }
        else if (algoButton.at(-1) == "insertion-sort-btn") {
            init();
            insertionSort();
        }
        else if (algoButton.at(-1) == "bubble-sort-btn") {
            init();
            bubbleSort();
        }
        else if (algoButton.at(-1) == "merge-sort-btn") {
            init();
            mergeSort();
        }
        else if (algoButton.at(-1) == "quick-sort-btn") {
            init();
            quickSort();
        }
    }
});


// For Slider input

const changeFrequency = (value) => {
    FREQ = value;
    document.getElementById("freq-value").innerHTML = FREQ;
    W = (600 - (FREQ * GAP)) / FREQ;
    init();
}

const changeSpeed = (value) => {
    SPEED = value;
    DELAY = (1 / SPEED) * 25;
    document.getElementById("speed-value").innerHTML = SPEED;
}

freqIp.addEventListener("input", (e) => changeFrequency(e.target.value));

speedIp.addEventListener("input", (e) => changeSpeed(e.target.value));