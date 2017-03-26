var countNodes = function(root) {
    function count(node) {
        var lnode,
            rnode,
            rdeep = 0,
            ldeep = 0;

        if (!node) {
            return 0;
        } else {
            lnode = node.left;
            while (lnode) {
                lnode = lnode.left;
                ldeep++;
            }

            rnode = node.right;
            while (rnode) {
                rnode = rnode.right;
                rdeep++;
            }

            if (ldeep === rdeep) {
                return Math.pow(2, ldeep + 1) - 1;
            } else {
                return count(node.left) + count(node.right) + 1;
            }
        }
    }

    return count(root);
};