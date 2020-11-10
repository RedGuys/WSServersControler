class Logger {
    static info(message){
        let result = "["+this.getStrDate()+"] (info): "+message;
        console.info(result);
    }

    static warning(message) {
        let result = "["+this.getStrDate()+"] (Warning): "+message;
        console.warn(result);
    }

    static error(message) {
        let result = "["+this.getStrDate()+"] (error): "+message;
        console.error(result);
    }

    static taggedMessage(tag,message) {
        let result = "["+this.getStrDate()+"] ("+tag+"): "+message;
        console.log(result);
    }

    static infoFromModule(module,message) {
        let result = "["+this.getStrDate()+"] (info) ["+module+"]: "+message;
        console.info(result);
    }

    static errorFromModule(module,error) {
        let result = "["+this.getStrDate()+"] (error) ["+module+"]: "+error;
        console.error(result);
    }

    static getStrDate() {
        let date = new Date();
        return date.getFullYear()+"."+(date.getMonth()+1)+"."+date.getDay()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+"."+date.getMilliseconds();
    }
}

module.exports = Logger;