const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(value = null) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    this.array = array;
    this.root = null;
  }
  buildTree(arr = this.array) {
    if (arr[0] == null) return null;
    if (arr.length <= 1) return new Node(arr[0]);
    if (!arr || arr.length == 0) return null;
    // Sorting and removing dupes from array
    const sortedArr = Array.from(new Set(arr)).sort((a, b) => a - b);

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
}

let array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
//let array = [50, 30, 20, 70, 40, 32, 34, 36, 60, 80, 65, 75, 85];
//let array = [11, 23, 8, 14, 30, 9, 6, 17, 22, 28, 25, 15, 7, 10, 19];
//const sortedArr = Array.from(new Set(array)).sort((a, b) => a - b);

//let array = [1, 3, 4, 5, 7, 8, 9];
let t = new Tree(array);
//console.log(t);
t.buildTree();
console.log(t.find(4));
//prettyPrint(t.root);