

export function toS(value?: number){
  if((!value) && (value !== 0)){
    return '';
  }
  var cents = (Math.abs(value) % 100).toString().padStart(2, '0');
  var dollars = Math.trunc(value / 100).toString();
  return dollars + '.' + cents;
}

export function fromS(value?: string){
  return (!value) ? undefined : Math.round(Number.parseFloat(value) * 100);
}
