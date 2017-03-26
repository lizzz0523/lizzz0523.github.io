/**
 * @param {number[]} nums
 * @return {string[]}
 */
var summaryRanges = function(nums) {
    var res = [],
        i,
        len,
        j,
        last;
    
    if (nums.length === 0) return [];
    if (nums.length === 1) return [nums[0] + ''];

    nums.push(null);

    i = 0;
    len = nums.length;
    j = 0;
    last = nums[0];
    
    while (++i < len) {
        j++;
        
        if (last + j !== nums[i]) {
            if (j === 1) {
                res.push(last + '');
            } else {
                res.push(last + '->' + (last + j - 1));
            }
            j = 0;
            last = nums[i]; 
        }
    }
    
    return res;
};