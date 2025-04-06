from openai import OpenAI
import json

client = OpenAI()

def generate_tasks(prompt : str):
    response = client.responses.create(
        model='gpt-4o',
        input=[
                {"role" : "system", "content" : "You are a Assistant tasked with organising day and making To-Do lists"},
                {
                    "role" : "user", "content" : prompt
                },
            ],
            text={
                "format" : {
                    "type" : "json_schema",
                    "name" : "ToDoList",
                    "schema" : {
                            "type" : "object",
                            "properties" : {
                                "todos" : {
                                    "type" : "array",
                                    "items" :{
                                        "type" : "object",
                                        "properties" : {
                                            "name" : {"type" : "string",},
                                            "time" : {
                                                    "type" : "string",
                                                    "description" : "Timeframe to complete the task in"
                                                    },
                                            "done" : {"type" : "boolean",},
                                        },
                                        "additionalProperties": False,
                                        "required": ["name", "time", "done"],
                                    },
                                }
                                
                            },
                        "required" : ["todos"],
                        "additionalProperties" : False,
                    },
                "strict" : True
                },
            },
    )

    return response.output_text