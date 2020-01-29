exports.info = (message) => {
    let result = "["+getStrDate()+"] (info): "+message;
    console.info(result);
};

exports.warning = (message) => {
    let result = "["+getStrDate()+"] (Warning): "+message;
    console.warn(result);
};

exports.error = (message) => {
    let result = "["+getStrDate()+"] (error): "+message;
    console.error(result);
};

exports.taggedMessage = (tag,message) => {
    let result = "["+getStrDate()+"] ("+tag+"): "+message;
    console.log(result);
};

exports.infoFromModule = (module,message) => {
    let result = "["+getStrDate()+"] (info) ["+module+"]: "+message;
    console.info(result);
};

exports.errorFromModule = (module,error) => {
    let result = "["+getStrDate()+"] (error) ["+module+"]: "+error;
    console.error(result);
};

function getStrDate() {
    let date = new Date();
    return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
}