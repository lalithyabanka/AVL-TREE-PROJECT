class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;

    return x;
  }

  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;

    return y;
  }

  insert(node, key) {
    if (!node) return new Node(key);

    if (key < node.key) node.left = this.insert(node.left, key);
    else if (key > node.key) node.right = this.insert(node.right, key);
    else return node;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && key < node.left.key) return this.rightRotate(node);
    if (balance < -1 && key > node.right.key) return this.leftRotate(node);
    if (balance > 1 && key > node.left.key) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && key < node.right.key) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  delete(node, key) {
    if (!node) return node;

    if (key < node.key) node.left = this.delete(node.left, key);
    else if (key > node.key) node.right = this.delete(node.right, key);
    else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        const temp = this.minValueNode(node.right);
        node.key = temp.key;
        node.right = this.delete(node.right, temp.key);
      }
    }

    if (!node) return node;

    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0)
      return this.rightRotate(node);

    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

    if (balance < -1 && this.getBalance(node.right) <= 0)
      return this.leftRotate(node);

    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }
}

const tree = new AVLTree();
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

function insertValue() {
  const val = parseInt(document.getElementById("value").value);
  if (!isNaN(val)) {
    tree.root = tree.insert(tree.root, val);
    draw();
  }
}

function deleteValue() {
  const val = parseInt(document.getElementById("value").value);
  if (!isNaN(val)) {
    tree.root = tree.delete(tree.root, val);
    draw();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (tree.root) drawNode(tree.root, canvas.width / 2, 40, canvas.width / 4);
}

function drawNode(node, x, y, offset) {
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.fillStyle = "#d0728e";
  ctx.fill();
  ctx.stroke();
  ctx.font = "18px Arial";


  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.key, x, y);

  if (node.left) {
    drawLine(x, y, x - offset, y + 60);
    drawNode(node.left, x - offset, y + 60, offset / 2);
  }
  if (node.right) {
    drawLine(x, y, x + offset, y + 60);
    drawNode(node.right, x + offset, y + 60, offset / 2);
  }
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1 + 18);
  ctx.lineTo(x2, y2 - 18);
  ctx.stroke();
}


