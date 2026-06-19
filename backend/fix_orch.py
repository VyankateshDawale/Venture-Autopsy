import os
import re

filepath = "app/agents/orchestrator.py"
with open(filepath, "r") as f:
    content = f.read()

# We want to replace:
#             f.write("Starting orchestrator.astream()...\\n")
#             async for output in orchestrator_graph.astream(initial_state):
#                 f.write(f"Graph Output: {list(output.keys())}\\n")
#                 
#             f.write("Orchestrator finished astream().\\n")

target = """            f.write("Starting orchestrator.astream()...\\n")
            async for output in orchestrator_graph.astream(initial_state):
                f.write(f"Graph Output: {list(output.keys())}\\n")
                
            f.write("Orchestrator finished astream().\\n")"""

replacement = """            f.write("Starting orchestrator.astream()...\\n")
            async for output in orchestrator_graph.astream(initial_state):
                f.write(f"Graph Output: {list(output.keys())}\\n")
                for node_name, state_update in output.items():
                    if isinstance(state_update, dict) and "status" in state_update:
                        await event_bus.emit(investigation_id, "investigation_progress", {
                            "status": state_update.get("status"),
                            "progress": state_update.get("progress", 0)
                        })
                
            f.write("Orchestrator finished astream().\\n")"""

content = content.replace(target, replacement)

with open(filepath, "w") as f:
    f.write(content)

print("Fixed orchestrator.py")
