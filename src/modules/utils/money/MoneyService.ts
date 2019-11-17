

export function toS(value: number){
  var cents = (value % 100).toString().padStart(2, '0');
  var dollars = Math.round(value / 100).toString();
  return dollars + '.' + cents;
}

export function fromS(value: string){
  return Math.round(Number.parseFloat(value) / 100);
}
