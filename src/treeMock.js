
/* 1. build tree method */
export function buildTree(folderList, level, folderTree) {
  // put the fundamental root folder insde target folder tree.
  if (!level) {
    folderTree.push("root", "root", [], level);
  }

  // In case folder list being empty, return the tree only with root folder
  if (!folderList) {
    return folderTree;
  }

  const parentId = folderTree[0]; // Inital parentId is set as "root"
  const temp = folderTree; // Setting the reference in temp variable

  for (let i = 0; i < folderList.length; i++) {
    if (folderList[i]["parent_folder"] === parentId) {
      temp.push([folderList[i]._id, folderList[i].title, folderList[i].bookmark, level + 1]);
    }
  }

  for (let i = 3; i < temp.length; i++) {
    const subTree = temp[i];
    buildTree(folderList, level + 1, subTree);
  }

  return folderTree;
}

/* 2. add folder method */
export function addFolder(category, newFolderCount, title, folderTree, parentId) {
  if (!folderTree[3]) {
    return;
  }

  for (let i = 3; i < folderTree.length; i++) {
    if (folderTree[i][0] === parentId) {
      const newFolder = createFolder(category, parentId, newFolderCount, title);
      folderTree[i].push(newFolder);
      return;
    }

    addFolder(category, newFolderCount, title, folderTree[i], parentId);
  }
}

const createFolder = (category, parentId, newFolderCount, title) => {
  return [`${category} ${newFolderCount} ${parentId}`, title, []];
};

/* 3. remove folder method */
export function removeFolder(targetId, parentId, folderTree) {
  let targetArray = null;
  if (!folderTree[3]) {
    return;
  }

  for (let i = 3; i < folderTree.length; i++) {
    if (folderTree[i][0] === parentId) {
      targetArray = folderTree[i];
      break;
    }

    removeFolder(targetId, parentId, folderTree[i]);
  }

  if (!targetArray) {
    return;
  }

  for (let i = 3; i < targetArray.length; i++) {
    if (targetArray[i][0] === targetId) {
      targetArray.splice(i, 1);
      return;
    }
  }
}

/* 4. relocate folder method */
export function relocateFolder(folderTree, targetId, currentParentId, newParentId) {
  let currentSubtree = folderTree[0] === currentParentId ? folderTree : null;
  let targetSubtree = folderTree[0] === newParentId ? folderTree : null;

  const findFolder = (tree) => {
    if (tree.length === 0) {
      return;
    }

    for (let i = 3; i < tree.length; i++) {
      const subtree = tree[i];
      if (subtree[0] === currentParentId) {
        currentSubtree = tree[i];
      }

      if (subtree[0] === newParentId) {
        targetSubtree = tree[i];
      }

      if (targetSubtree && currentSubtree) {
        break;
      }

      findFolder(subtree);
    }
  };

  findFolder(folderTree);

  for (let i = 3; i < currentSubtree.length; i++) {
    if (currentSubtree[i][0] === targetId) {
      const targetArray = currentSubtree.splice(i, 1);
      targetSubtree.push(targetArray[0]);
      break;
    }
  }
}

/* 5. add link method */
export function addLink(folderTree, targetId, parentId, bookmark) {
  if (!folderTree[3]) {
    return;
  }

  let targetArray = parentId === "root" ? folderTree : null;

  for (let i = 3; i < folderTree.length; i++) {
    if (targetArray) {
      break;
    }

    if (folderTree[i][0] === parentId) {
      targetArray = folderTree[i];
      break;
    }

    addLink(folderTree[i], targetId, parentId);
  }
  for (let i = 3; i < targetArray.length; i++) {
    if (targetArray[i][0] === targetId) {
      targetArray[i][2].push(bookmark);
      return;
    }
  }
}

/* 6. remove link method */
export function removeLink(folderTree, targetId, parentId, bookmark) {
  if (!folderTree[3]) {
    return;
  }

  let targetArray = parentId === "root" ? folderTree : null;
  let bookmarkArray = null;

  for (let i = 3; i < folderTree.length; i++) {
    if (targetArray) {
      break;
    }

    if (folderTree[i][0] === parentId) {
      targetArray = folderTree[i];
      break;
    }

    removeLink(folderTree[i], targetId, parentId, bookmark);
  }

  for (let i = 3; i < targetArray.length; i++) {
    if (targetArray[i][0] === targetId) {
      bookmarkArray = targetArray[i];
      break;
    }
  }

  for (let i = 0; i < bookmarkArray.length; i++) {
    if (bookmarkArray[i] === bookmark) {
      bookmarkArray.splice(i, 1);
      return;
    }
  }
}
