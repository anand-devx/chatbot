class ApiResponse{
    constructor(
        statusCode,
        message="This is a Response from server.",
        data
    ){
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode<400
    }
}
export default ApiResponse;