export function getCookie(key:string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
}

export function formatCurrency(ammount : number){
  return `$ ${(ammount/100).toFixed(2)}`
}