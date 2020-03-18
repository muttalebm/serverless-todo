import 'source-map-support/register'

import {getAllTodos} from "../../businessLogic/todos";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {parseUserId} from "../../auth/utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event:', event)
    const authHeader = event.headers.Authorization;
    const authSplit = authHeader.split(" ");
    const userId = parseUserId(authSplit[1]);
    const todos = getAllTodos(userId);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            todos
        })
    }
}
