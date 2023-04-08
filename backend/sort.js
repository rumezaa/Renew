function mergeSort(arr, r, l, setArr, type) {
    if (r > l) {
      const m = Math.floor((l + r) / 2);
      mergeSort(arr, l, m, setArr, type);
      mergeSort(arr, m + 1, r, setArr, type);
      sort(arr, m, l, r, setArr, type);
    }
  }
  
  function sort(arr, m, l, r, setArr, type) {
    const tempLeft = [];
    const tempRight = [];
  
    const l_length = m - l + 1;
    const r_length = r - m;
  
    //fill up the temp arrays
    for (let i = 0; i < l_length; i++) {
      tempLeft.push(arr[l + i]);
    }
  
    for (let j = 0; j < r_length; j++) {
      tempRight.push(arr[m + 1 + j]);
    }
  
    let R = 0;
    let L = 0;
    let A = l;
  
    while (R < r_length && L < l_length) {
        if (type == "AZ"){
            if (tempLeft[L].title < tempRight[R].title) {
                arr[A] = tempLeft[L];
                L++;
              } else {
                arr[A] = tempRight[R];
                R++;
              }
              A++;
        } else {
            if (tempLeft[L].title > tempRight[R].title) {
                arr[A] = tempLeft[L];
                L++;
              } else {
                arr[A] = tempRight[R];
                R++;
              }
              A++;
        }
     
    }
  
    while (L < l_length) {
      arr[A] = tempLeft[L];
      L++;
      A++;
    }
  
    while (R < r_length) {
      arr[A] = tempRight[R];
      R++;
      A++;
    }
  
    setArr(arr);
    
  }
  
  export { mergeSort };