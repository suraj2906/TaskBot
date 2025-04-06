from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

# Allow Next.js frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI()

class TaskRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_tasks(prompt : str):
    try: 
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

        return {"tasks" : response.output_text }
    except Exception as e:
        return {"error" : str(e)}

