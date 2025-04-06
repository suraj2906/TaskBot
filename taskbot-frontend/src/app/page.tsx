'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type Task = {
  name: string
  time: string
  done: boolean
}

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  // Reset first load when new tasks are generated
  useEffect(() => {
    if (tasks.length > 0 && isFirstLoad) {
      setIsFirstLoad(false)
    }
  }, [tasks])

  const fetchTasks = async () => {
    setLoading(true)
    setIsFirstLoad(true)
    try {
      const response = await fetch(
        `https://taskbot-hfy0.onrender.com/generate?prompt=${encodeURIComponent(prompt)}`,
        { method: 'POST' }
      )
      const data = await response.json()
      const parsed = JSON.parse(data.tasks)
      setTasks(parsed.todos)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDone = (index: number) => {
    const newTasks = [...tasks]
    newTasks[index].done = !newTasks[index].done
    setTasks(newTasks)
    console.log(`Task ${index} toggled to ${newTasks[index].done}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🧠 TaskBot
        </motion.h1>
        <p className='text-xl mb-4 text-gray-500'>An Agentic To-Do Assistant</p>
        
        <motion.div 
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              className="border-2 border-indigo-100 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-3 rounded-lg text-lg transition-all duration-200 outline-none"
              placeholder="What do you want to get done today?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  fetchTasks()
                }
              }}
            />
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-5 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              onClick={fetchTasks}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </div>
              ) : 'Generate Tasks'}
            </button>
          </div>
        </motion.div>
        
        {tasks.length > 0 && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {tasks.map((task, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: isFirstLoad ? 0.2 * idx : 0,
                  type: "spring",
                  stiffness: 100 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleDone(idx)}
                      className="focus:outline-none"
                      aria-label={task.done ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                        {task.done && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    <div className="flex-1">
                      <div 
                        className={`text-lg font-medium transition-all duration-300 ${task.done ? "line-through text-gray-400" : "text-gray-800"}`}
                        onClick={() => toggleDone(idx)}
                      >
                        {task.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        {task.time}
                      </div>
                    </div>
                  </div>
                  
                  <span className={`text-sm px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                    task.done 
                      ? "bg-green-100 text-green-700" 
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {task.done ? "Completed" : "Pending"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {tasks.length === 0 && !loading && (
          <motion.div 
            className="text-center mt-12 text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="text-lg">Generate tasks to get started</div>
            <div className="mt-4 text-sm">Try prompts like "Plan my weekend trip" or "Get my home office organized"</div>
          </motion.div>
        )}
      </div>
    </main>
  )
}