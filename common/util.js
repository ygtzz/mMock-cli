const ApiPrefix = 'apis';
function getApiKey(method,url){
    return `${ApiPrefix}.${method}|${url}`;
}

module.exports = {
    getApiKey
}