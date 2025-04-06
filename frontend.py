import streamlit as st
import json
from TaskBot import generate_tasks

st.set_page_config(page_title="TaskBot", page_icon="🧠", layout="centered")
st.title("🧠 TaskBot – Your Personal To-Do Planner")
st.markdown("Type your goal or tasks, and let AI organize your day.")

user_input = st.text_area("Enter your goals or task list:", placeholder="E.g., Plan my day: meal prep, homework, catch up with friends...")

if 'tasks' not in st.session_state:
    st.session_state.tasks = []

if st.button("Generate To-Do List") and user_input:
    raw = generate_tasks(user_input)
    try:
        st.session_state.tasks = json.loads(raw)
    except Exception as e:
        st.error(f"Parsing error: {e}")
        st.stop()

# Show checkboxes
for i, task in enumerate(st.session_state.tasks["todos"]):
    checkbox_key = f"task_{i}"
    st.session_state.tasks["todos"][i]['done'] = st.checkbox(
        f"{task['time']} - {task['name']}",
        value=task['done'],
        key=checkbox_key
    )