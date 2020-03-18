import 'source-map-support/register'

import {getAllTodos} from "../../businessLogic/todos";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import { getUserId} from "../utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('event:', event)
    const userId = getUserId(event);
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
