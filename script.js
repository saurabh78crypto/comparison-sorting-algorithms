let bars = [];
let animationPaused = false;
let animationSpeed = 5;
let canvasWidth = 800;
let canvasHeight = 200;
let currentStep = 0;
let sortingInterval;
let sortingAlgorithm = null;
let isSorting = false;
let animationSteps = [];
let animationCompleted = false;

// Creating bars 

function createBars() {
  const container = document.getElementById('container');
  container.innerHTML = '';
  container.style.width = `${canvasWidth}px`;
  container.style.height = `${canvasHeight}px`;

  for (let i = 0; i < bars.length; i++) {
    const barContainer = document.createElement('div');
    barContainer.className = 'bar-container';
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = `${bars[i]}px`;
    const barLabel = document.createElement('div');
    barLabel.innerHTML = bars[i];
    barContainer.appendChild(bar);
    barContainer.appendChild(barLabel);
    container.appendChild(barContainer);
  }
}

// Generate random array of length 20
function randomizeArray() {
  bars = Array.from({ length: 20 }, () => Math.floor(Math.random() * (canvasHeight - 20)) + 20);
  createBars();
  resetSort();
}

// Change size of bar container (shrink the height by 10)
function changeSize() {
  bars = bars.map(height => height - 10);
  createBars();
  resetSort();
}

// Clears the sort
function resetSort() {
  clearTimeout(sortingInterval);
  currentStep = 0;
  isSorting = false;
  sortingAlgorithm = null;
  animationCompleted = false;
  createBars();
}

// Skip backwards animation
function skipBack() {
  if (animationPaused || currentStep <= 0) {
    return;
  }
  clearTimeout(sortingInterval);
  currentStep = 0;
  createBars();
  for (let i = 0; i < currentStep; i++) {
    animationSteps[i]();
  }
}

// Skip one-step back in animation
function stepBack() {
  if (animationPaused || currentStep <= 0) {
    return;
  }
  clearTimeout(sortingInterval);
  currentStep--;
  animationSteps[currentStep]();
  createBars();
}

// Pause animation
function pauseResume() {
    animationPaused = !animationPaused;
    if (!animationPaused && !animationCompleted) {
      animate();
    }
    if (animationPaused && animationCompleted) {
      removeAnimationCompletedMessage();
    }
}

// Remove animation message after clicked on pause button
function removeAnimationCompletedMessage() {
  const container = document.getElementById('container');
  const messageContainer = document.querySelector('.animation-completed-message');
  if (messageContainer) {
    container.removeChild(messageContainer);
  }
}

// Forward one-step in animation
function stepForward() {
  if (animationPaused || currentStep >= animationSteps.length || animationCompleted) {
    return;
  }
  clearTimeout(sortingInterval);
  animationSteps[currentStep]();
  createBars();
  currentStep++;
  if (currentStep < animationSteps.length) {
    sortingInterval = setTimeout(animate, 1000 / animationSpeed);
  } else {
    animationCompleted = true;
    displayAnimationCompletedMessage();
  }
}

// Skip forward animation 
    function skipForward() {
      if (animationPaused || currentStep >= animationSteps.length || animationCompleted) {
        return;
      }
      clearTimeout(sortingInterval);
      currentStep = animationSteps.length - 1;
      createBars();
      for (let i = 0; i < currentStep; i++) {
        animationSteps[i]();
      }
      animationCompleted = true;
      displayAnimationCompletedMessage();
    }

// Control the speed of the animation
function updateSpeed() {
  animationSpeed = document.getElementById('speedControl').value;
  if (!animationPaused) {
    clearTimeout(sortingInterval);
    sortingInterval = setTimeout(animate, 1000 / animationSpeed);
  }
}

// Change size of the canvas or container
    function changeCanvasSize() {
      canvasWidth = parseInt(document.getElementById('canvasWidth').value);
      canvasHeight = parseInt(document.getElementById('canvasHeight').value);
      createBars();
    }

// Move the controls
function moveControls() {
  const controls = document.querySelector('.footer');
  const footerText = document.querySelector('.footer-text');
  const container = document.getElementById('container');
  controls.style.order = isSorting ? 2 : 0;
  footerText.style.order = isSorting ? 0 : 2;
  container.style.order = isSorting ? 1 : 3;
  isSorting = !isSorting;
}

// Animation
function animate() {
  if (animationPaused || currentStep >= animationSteps.length) {
    displayAnimationCompletedMessage();
    return;
  }
  animationSteps[currentStep]();
  createBars();
  currentStep++;
  if (currentStep < animationSteps.length) {
    sortingInterval = setTimeout(animate, 1000 / animationSpeed);
  } else {
    animationCompleted = true;
    displayAnimationCompletedMessage();
    updateButtonStates();
  }
}

// Animate the sorting function
function animateSort(sortFunction) {
  resetSort();
  sortingAlgorithm = sortFunction;
  sortingAlgorithm();
  isSorting = true;
}

// Display Animation Completed message when animation is completed
function displayAnimationCompletedMessage(){
  if (animationCompleted) {
    const container = document.getElementById('container');
    const messageContainer = document.createElement('div');
    messageContainer.className = 'animation-completed-message';
    messageContainer.style.width = '100%';
    messageContainer.style.textAlign = 'center';
    messageContainer.style.bottom = '0px';
    messageContainer.style.left = '0px';
    messageContainer.style.position = 'absolute';
    messageContainer.style.marginBottom = '90px';
    const message = document.createElement('p');
    message.innerHTML = 'Animation Completed';
    message.style.color = 'black';
    messageContainer.appendChild(message);
    container.appendChild(messageContainer);
  }
}

// Disabled the buttons when the animation completes
function updateButtonStates() {
  const skipBackBtn = document.getElementById('skipBackBtn');
  const stepBackBtn = document.getElementById('stepBackBtn');
  const skipForwardBtn = document.getElementById('skipForwardBtn');
  const stepForwardBtn = document.getElementById('stepForwardBtn');

  // Disable buttons if animation is completed
  if (animationCompleted) {
    skipBackBtn.disabled = true;
    stepBackBtn.disabled = true;
    skipForwardBtn.disabled = true;
    stepForwardBtn.disabled = true;
  } else {
    // Enable buttons if animation is not completed
    skipBackBtn.disabled = false;
    stepBackBtn.disabled = false;
    skipForwardBtn.disabled = false;
    stepForwardBtn.disabled = false;
  }
}

// Sorting Algorithm functions
// Insertion Sort Functions
function insertionSort() {
  const steps = [];
  for (let i = 1; i < bars.length; i++) {
    let key = bars[i];
    let j = i - 1;
    steps.push(() => {
      bars[j + 1] = key;
    });
    while (j >= 0 && bars[j] > key) {
      steps.push(() => {
        bars[j + 1] = bars[j];
      });
      j = j - 1;
    }
    steps.push(() => {
      bars[j + 1] = key;
    });
  }
  animationSteps = steps;
  animate();
}

// Selection Sort Function
function selectionSort() {
  const steps = [];
  let n = bars.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    steps.push(() => {
      bars[minIndex] = bars[i];
    });
    for (let j = i + 1; j < n; j++) {
      if (bars[j] < bars[minIndex]) {
        minIndex = j;
      }
    }
    steps.push(() => {
      let temp = bars[minIndex];
      bars[minIndex] = bars[i];
      bars[i] = temp;
    });
  }
  animationSteps = steps;
  animate();
}

// Bubble Sort Function
function bubbleSort() {
  const steps = [];
  let n = bars.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; n > 1 && i < n - 1; i++) {
      if (bars[i] > bars[i + 1]) {
        steps.push(() => {
          let temp = bars[i];
          bars[i] = bars[i + 1];
          bars[i + 1] = temp;
        });
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  animationSteps = steps;
  animate();
}

// Quick Sort Function
function quickSort() {
  const steps = [];
  function quickSortRecursive(start, end) {
    if (start < end) {
      const pivotIndex = partition(start, end);
      quickSortRecursive(start, pivotIndex - 1);
      quickSortRecursive(pivotIndex + 1, end);
    }
  }

  function partition(start, end) {
    const pivotValue = bars[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
      if (bars[i] < pivotValue) {
        steps.push(() => {
          [bars[i], bars[pivotIndex]] = [bars[pivotIndex], bars[i]];
        });
        pivotIndex++;
      }
    }
    steps.push(() => {
      [bars[pivotIndex], bars[end]] = [bars[end], bars[pivotIndex]];
    });
    return pivotIndex;
  }

  quickSortRecursive(0, bars.length - 1);
  animationSteps = steps;
  animate();
}

// Merge Sort Function
function mergeSort() {
  const steps = [];
  
  function merge(left, right, start) {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
   }
    result = result.concat(left.slice(leftIndex), right.slice(rightIndex));
    // Animate the merging process
    for (let i = 0; i < result.length; i++) {
      steps.push((function (index, value) {
        return function () {
          bars[start + index] = value;
        };
      })(i, result[i]));
    }
  }

  function mergeSortRecursive(arr, start) {
    if (arr.length <= 1) {
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    mergeSortRecursive(left, start);
    mergeSortRecursive(right, start + mid);
    merge(left, right, start);
  }

  mergeSortRecursive(bars, 0);
  animationSteps = steps;
  animate();
}

// Shell Sort Function
function shellSort() {
  const steps = [];
  let n = bars.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let temp = bars[i];
      let j = i;
      while (j >= gap && bars[j - gap] > temp) {
        steps.push(() => {
          bars[j] = bars[j - gap];
        });
        j -= gap;
      }
      steps.push(() => {
        bars[j] = temp;
      });
    }
    gap = Math.floor(gap / 2);
  }
  animationSteps = steps;
  animate();
}

    
randomizeArray(); // Initialize with a random array