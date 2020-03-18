import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {DocumentClient} from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";

export class TodoItemAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODO_TABLE) {
    }

    async deleteTodoItem(todoId: string) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                todoId: todoId
            }
        }).promise();
    }

    async getAllTodoItem(userId: string): Promise<TodoItem[]> {
        console.log('Getting all Todos')

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: "UserIdIndex",
            KeyConditionExpression: ' userId= :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async updateTodoItem(todoId: string, todoUpdate: TodoUpdate): Promise<TodoUpdate> {
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {"todoId": todoId},
            UpdateExpression: "set #n = :a, dueDate = :b, done = :c",
            ExpressionAttributeValues: {
                ":a": todoUpdate.name,
                ":b": todoUpdate.dueDate,
                ":c": todoUpdate.done
            },
            ExpressionAttributeNames: {
                "#n": "name"
            },
            ReturnValues: "UPDATED_NEW"
        });
        return todoUpdate;
    }

    async createTodoItem(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todoTable,
            Item: todo
        }).promise()

        return todo
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}


