
function scale(source){
  const max = 100;
  const min = 15;
  //0 -> 0
  //1 -> 1
  //100000 -> 
  let result;
  if(source > 99999){
    result = max;
  }else{
    result = (source/99999)*(max-min) + min;
  }
  return result;
}

function scaleFontSize(source){
  const max = 20;
  const min = 12;
  //0 -> 0
  //1 -> 1
  //100000 -> 
  let result;
  if(source > 9999){
    result = max;
  }else{
    result = Math.round((source/9999)*(max-min) + min);
  }
  return result;
}

export {
  scale,
  scaleFontSize,
}
