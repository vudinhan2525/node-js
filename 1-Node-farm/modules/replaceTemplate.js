function replaceTemplate(temp,product){
    temp = temp.replaceAll('{%PRODUCTNAME%}',product.productName);
    temp = temp.replaceAll('{%IMAGE%}',product.image);
    temp = temp.replaceAll('{%FROM%}',product.from);
    temp = temp.replaceAll('{%NUTRIENTS%}',product.nutrients);
    temp = temp.replaceAll('{%QUANTITY%}',product.quantity);
    temp = temp.replaceAll('{%PRICE%}',product.price);
    temp = temp.replaceAll('{%DESCRIPTION%}',product.description);
    temp = temp.replaceAll('{%ID%}',product.id);
    temp = temp.replaceAll('{%ROUTE%}',product.route);
    if(!product.organic) temp = temp.replaceAll('{%NOT_ORGANIC%}','not-organic');
    return temp;
}
module.exports = replaceTemplate;