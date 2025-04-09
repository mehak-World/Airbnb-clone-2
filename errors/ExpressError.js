
class ExpressError extends Error{

    constructor(status_code, msg){
        super();
        this.status_code = status_code
        this.msg = msg
    }

}

module.exports = ExpressError