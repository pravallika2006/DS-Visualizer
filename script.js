// DOM references
const stackDiv = document.getElementById("stack");
const queueDiv = document.getElementById("queue");
const linkedListDiv = document.getElementById("linkedList");

const stackInput = document.getElementById("stackInput");
const queueInput = document.getElementById("queueInput");
const llInput = document.getElementById("llInput");

// Individual status bars
const stackStatus = document.getElementById("stackStatus");
const queueStatus = document.getElementById("queueStatus");
const llStatus = document.getElementById("llStatus");

// Data structures
let stack = [];
let queue = [];
let linkedList = [];

// History stacks for Undo
let stackHistory = [];
let queueHistory = [];
let llHistory = [];

/* ---------------- UTILITY ---------------- */
function flashNode(node, colorClass, duration = 500) {
  if (!node) return;
  node.classList.add(colorClass);
  setTimeout(() => node.classList.remove(colorClass), duration);
}

/* ---------------- STACK ---------------- */
function pushStack() {
  if (!stackInput.value) {
    stackStatus.textContent = "Enter a value to push!";
    return;
  }
  stack.push(stackInput.value);
  stackHistory.push({ action: "push", value: stackInput.value });
  stackInput.value = "";
  renderStack();
  stackStatus.textContent = `Pushed ${stack[stack.length - 1]}`;
}

function popStack() {
  if (!stack.length) {
    stackStatus.textContent = "Stack is empty!";
    return;
  }
  const nodes = stackDiv.children;
  const node = nodes[nodes.length - 1];
  flashNode(node, "curr");
  const removed = stack[stack.length - 1];
  setTimeout(() => {
    stack.pop();
    stackHistory.push({ action: "pop", value: removed });
    renderStack();
    stackStatus.textContent = `Popped ${removed}`;
  }, 600);
}

function undoStack() {
  if (!stackHistory.length) return;
  const last = stackHistory.pop();
  if (last.action === "push") {
    const node = stackDiv.children[stack.length - 1];
    flashNode(node, "flash-green");
    stack.pop();
    stackStatus.textContent = `Undo Push (${last.value})`;
  } else if (last.action === "pop") {
    stack.push(last.value);
    renderStack();
    const node = stackDiv.children[stack.length - 1];
    flashNode(node, "flash-green");
    stackStatus.textContent = `Undo Pop (${last.value})`;
  }
  renderStack();
}

function renderStack() {
  stackDiv.innerHTML = "";
  stack.forEach((v) => {
    const node = document.createElement("div");
    node.className = "element";
    node.textContent = v;
    stackDiv.appendChild(node);
  });
}

/* ---------------- QUEUE ---------------- */
function enqueue() {
  if (!queueInput.value) {
    queueStatus.textContent = "Enter a value to enqueue!";
    return;
  }
  queue.push(queueInput.value);
  queueHistory.push({ action: "enqueue", value: queueInput.value });
  queueInput.value = "";
  renderQueue();
  queueStatus.textContent = `Enqueued ${queue[queue.length - 1]}`;
}

function dequeue() {
  if (!queue.length) {
    queueStatus.textContent = "Queue is empty!";
    return;
  }
  const node = queueDiv.children[0];
  flashNode(node, "curr");
  const removed = queue[0];
  setTimeout(() => {
    queue.shift();
    queueHistory.push({ action: "dequeue", value: removed });
    renderQueue();
    queueStatus.textContent = `Dequeued ${removed}`;
  }, 600);
}

function undoQueue() {
  if (!queueHistory.length) return;
  const last = queueHistory.pop();
  if (last.action === "enqueue") {
    const node = queueDiv.children[queue.length - 1];
    flashNode(node, "flash-green");
    queue.pop();
    queueStatus.textContent = `Undo Enqueue (${last.value})`;
  } else if (last.action === "dequeue") {
    queue.unshift(last.value);
    renderQueue();
    const node = queueDiv.children[0];
    flashNode(node, "flash-green");
    queueStatus.textContent = `Undo Dequeue (${last.value})`;
  }
  renderQueue();
}

function renderQueue() {
  queueDiv.innerHTML = "";
  queue.forEach((v) => {
    const node = document.createElement("div");
    node.className = "element";
    node.textContent = v;
    queueDiv.appendChild(node);
  });
}

/* ---------------- LINKED LIST ---------------- */
function insertLL() {
  if (!llInput.value) {
    llStatus.textContent = "Enter a value to insert!";
    return;
  }
  linkedList.push(llInput.value);
  llHistory.push({ action: "insert", value: llInput.value });
  llInput.value = "";
  renderLL();
  llStatus.textContent = `Inserted ${linkedList[linkedList.length - 1]}`;
}

function deleteLL() {
  if (!llInput.value) {
    llStatus.textContent = "Enter value to delete!";
    return;
  }
  if (!linkedList.length) {
    llStatus.textContent = "Linked List is empty!";
    return;
  }

  let prev = -1;
  let curr = 0;
  const target = llInput.value;

  const timer = setInterval(() => {
    renderLL(curr, prev, true);

    if (linkedList[curr] == target) {
      clearInterval(timer);
      setTimeout(() => {
        linkedList.splice(curr, 1);
        llHistory.push({ action: "delete", value: target, index: curr });
        renderLL();
        llStatus.textContent = `Deleted value ${target} at index ${curr}`;
      }, 600);
    } else {
      prev = curr;
      curr++;
      if (curr === linkedList.length) {
        clearInterval(timer);
        renderLL();
        llStatus.textContent = `Value ${target} not found for deletion`;
      }
    }
  }, 700);
}

function undoLL() {
  if (!llHistory.length) return;
  const last = llHistory.pop();

  if (last.action === "insert") {
    const node =
      linkedListDiv.children[linkedList.length * 2 - 2].querySelector(
        ".element",
      );
    flashNode(node, "flash-green");
    linkedList.pop();
    llStatus.textContent = `Undo Insert (${last.value})`;
  } else if (last.action === "delete") {
    linkedList.splice(last.index, 0, last.value);
    renderLL();
    const node =
      linkedListDiv.children[last.index * 2].querySelector(".element");
    flashNode(node, "flash-green");
    llStatus.textContent = `Undo Delete (${last.value} at index ${last.index})`;
  }
  renderLL();
}

/* ---------- TRAVERSAL ---------- */
function traverseLL() {
  if (!llInput.value) {
    llStatus.textContent = "Enter value to traverse!";
    return;
  }
  if (!linkedList.length) {
    llStatus.textContent = "Linked List is empty!";
    return;
  }

  let curr = 0;
  const target = llInput.value;

  const timer = setInterval(() => {
    renderLL(curr, -1, false);
    if (linkedList[curr] == target) {
      llStatus.textContent = `Value ${target} found at index ${curr}`;
      clearInterval(timer);
    }
    curr++;
    if (curr === linkedList.length) {
      llStatus.textContent = `Value ${target} not found (reached NULL)`;
      clearInterval(timer);
    }
  }, 700);
}

/* ---------------- RENDER LL ---------------- */
function renderLL(curr = -1, prev = -1, deleteMode = false) {
  linkedListDiv.innerHTML = "";

  linkedList.forEach((v, i) => {
    const nodeContainer = document.createElement("div");
    nodeContainer.style.display = "flex";
    nodeContainer.style.flexDirection = "column";
    nodeContainer.style.alignItems = "center";

    const indexDiv = document.createElement("div");
    indexDiv.className = "index";
    indexDiv.textContent = i;
    nodeContainer.appendChild(indexDiv);

    const node = document.createElement("div");
    node.className = "element";
    node.textContent = v;

    if (deleteMode) {
      if (i === curr) node.classList.add("curr");
      if (i === prev) node.classList.add("prev");
    } else {
      if (i === curr) node.classList.add("curr");
    }

    nodeContainer.appendChild(node);
    linkedListDiv.appendChild(nodeContainer);

    const arrow = document.createElement("span");
    arrow.textContent = "→";
    arrow.className = "arrow";
    linkedListDiv.appendChild(arrow);
  });

  const nullNode = document.createElement("span");
  nullNode.textContent = "NULL";
  nullNode.className = "null";
  linkedListDiv.appendChild(nullNode);
}

/* ---------------- RENDER ALL ---------------- */
function renderAll() {
  renderStack();
  renderQueue();
  renderLL();
}
