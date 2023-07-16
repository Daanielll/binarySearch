class Node {
  constructor(value = null) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }
  buildTree(arr = this.array) {
    if (arr[0] == null) return null;
    if (arr.length <= 1) return new Node(arr[0]);
    if (!arr || arr.length == 0) return null;
    // Sorting and removing dupes from array
    const sortedArr = arr.slice().sort((a, b) => a - b);
    // Calculating the middle, right and left sides of the array
    const middle = Math.floor(sortedArr.length / 2);
    const left = sortedArr.slice(0, middle);
    const right = sortedArr.slice(middle + 1);
    // Creating the root node and assigning the left and right attributes
    let rootNode = new Node(sortedArr[middle]);
    rootNode.left = this.buildTree(left);
    rootNode.right = this.buildTree(right);
    this.root = rootNode;
    return rootNode;
  }
  insert(val, pointer = this.root) {
    if (pointer === null) {
      this.root = new Node(val);
      return true;
    }
    if (pointer.value == val) return false;
    if (!pointer || pointer.value == null) return;
    if (pointer.value > val)
      if (!pointer.left || pointer.left.value == null) {
        pointer.left = new Node(val);
        return true;
      }

    if (pointer.value < val)
      if (!pointer.right || pointer.right.value == null) {
        pointer.right = new Node(val);
        return true;
      }

    if (val < pointer.value) pointer = pointer.left;
    else pointer = pointer.right;
    if (this.insert(val, pointer) == true) return true;
  }
  delete(val, pointer = this.root) {
    if (!pointer || pointer.value == null) return;
    // if val is root
    if (pointer.value == val) {
      // Case 1: Root is a leaf
      if (!pointer.left && !pointer.right) this.root = null;
      // Case 2: Root has one child
      else if (!pointer.left || !pointer.right)
        this.root = pointer.left || pointer.right;
      // Case 3: Root has two children
      else {
        let p = pointer.right;
        while (p.left != null && p.left.left != null) p = p.left;
        let v = p.left.value;
        p.left = null;
        pointer.value = v;
      }
      return true;
    }
    // left
    if (pointer.left && pointer.left.value == val) {
      let x = deleteNode(pointer.left);
      if (typeof x == "object") pointer.left = x;
      else pointer.left.value = x;
      return true;
    }
    // right
    if (pointer.right && pointer.right.value == val) {
      let x = deleteNode(pointer.right);
      if (typeof x == "object") pointer.right = x;
      else pointer.right.value = x;
      return true;
    }
    // helper function
    function deleteNode(dir) {
      // if val is a leaf
      if (
        (!dir.left || dir.left.value == null) &&
        (!dir.right || dir.right.value == null)
      )
        return null;
      // if val has 1 child
      else if (dir.left == null && dir.right != null) return dir.right;
      else if (dir.right == null && dir.left != null) return dir.left;
      else if (dir.right != null && dir.left != null) {
        let p = dir.right;
        while (p != null && p.left != null && p.left.left != null) p = p.left;
        let v = p.left.value;
        p.left = null;
        return v;
      }
    }
    pointer = pointer.value > val ? pointer.left : pointer.right;
    if (this.delete(val, pointer) == true) return true;
  }
  find(val, pointer = this.root) {
    if (!pointer || pointer.value == null) return;

    if (pointer.value == val) return pointer;
    pointer = pointer.value > val ? pointer.left : pointer.right;
    return this.find(val, pointer);
  }
  levelOrder(func = null, queue = [this.root], visited = [this.root.value]) {
    if (!this.root) return null;
    if (queue[0] == null) {
      if (!func) return visited;
      for (let i of visited) func(this.find(i));
      return;
    }

    const first = queue.shift();
    if (first) {
      if (first.left) {
        queue.push(first.left);
        visited.push(first.left.value);
      }
      if (first.right) {
        queue.push(first.right);
        visited.push(first.right.value);
      }
    }

    return this.levelOrder(func, queue, visited);
  }
  preOrder(func = null, stack = [this.root], visited = [this.root.value]) {
    if (!this.root) return null;
    const last = stack[stack.length - 1];

    if (last.left && !visited.includes(last.left.value)) {
      stack.push(last.left);
      visited.push(last.left.value);
      return this.preOrder(func, stack, visited);
    }
    stack.pop();
    if (last.right) {
      stack.push(last.right);
      visited.push(last.right.value);
      return this.preOrder(func, stack, visited);
    }
    if (stack.length > 0) {
      return this.preOrder(func, stack, visited);
    }
    if (stack.length <= 0) {
      if (!func) return visited;
      for (let i of visited) func(this.find(i));
      return;
    }
  }
  inOrder(func = null, stack = [this.root], visited = []) {
    if (stack.length <= 0) {
      if (!func) return visited;
      for (let i of visited) func(this.find(i));
      return;
    }
    const last = stack[stack.length - 1];

    if (last.left && !visited.includes(last.left.value)) {
      stack.push(last.left);
      return this.inOrder(func, stack, visited);
    }
    if (last.right && !visited.includes(last.right.value)) {
      stack.push(last.right);
      visited.push(last.value);
      return this.inOrder(func, stack, visited);
    }
    if (!visited.includes(last.value)) visited.push(last.value);
    stack.pop();
    return this.inOrder(func, stack, visited);
  }
  postOrder(func = null, stack = [this.root], visited = []) {
    if (stack.length <= 0) {
      if (!func) return visited;
      for (let i of visited) func(this.find(i));
      return;
    }
    const last = stack[stack.length - 1];

    if (last.left && !visited.includes(last.left.value)) {
      stack.push(last.left);
      return this.postOrder(func, stack, visited);
    }
    if (last.right && !visited.includes(last.right.value)) {
      stack.push(last.right);
      return this.postOrder(func, stack, visited);
    }
    if (!visited.includes(last.value)) visited.push(last.value);
    stack.pop();
    return this.postOrder(func, stack, visited);
  }
  height(pointer = this.root) {
    if (!pointer) return -1;

    const leftHeight = this.height(pointer.left);
    const rightHeight = this.height(pointer.right);

    return 1 + Math.max(leftHeight, rightHeight);
  }
  depth(target, pointer = this.root, currentDepth = 0) {
    if (!pointer) return -1;
    if (pointer === target) return currentDepth;

    const leftDepth = this.depth(target, pointer.left, currentDepth + 1);
    if (leftDepth !== -1) return leftDepth;

    const rightDepth = this.depth(target, pointer.right, currentDepth + 1);
    if (rightDepth !== -1) return rightDepth;

    return -1; // target node not found in either subtree
  }
  isBalanced(pointer = this.root) {
    if (!pointer) return true;
    const heightDiff = Math.abs(
      this.height(pointer.left) - this.height(pointer.right)
    );
    return (
      heightDiff <= 1 &&
      this.isBalanced(pointer.left) &&
      this.isBalanced(pointer.right)
    );
  }
  rebalance() {
    this.root = this.buildTree(this.inOrder());
  }
}

// Driver
let array = [40, 30, 25, 35, 15, 28, 50, 45, 60, 55, 70];
let t = new Tree(array);

console.log(t.isBalanced());
console.log("in Order", t.inOrder());
console.log("pre Order", t.preOrder());
console.log("post Order", t.postOrder());
t.insert(40);
t.insert(43);
t.insert(24);
t.insert(23);
t.insert(64);
console.log(t.isBalanced());
t.rebalance();
console.log(t.isBalanced());
console.log("in Order", t.inOrder());
console.log("pre Order", t.preOrder());
console.log("post Order", t.postOrder());

