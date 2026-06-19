import os
import re

directories = [
    "app/agents/core",
    "app/agents/specialists",
    "app/services"
]

files_to_check = []
for d in directories:
    if not os.path.exists(d): continue
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.endswith('.py'):
                files_to_check.append(os.path.join(root, f))

for filepath in files_to_check:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "await self.gemini_service.complete_json" not in content:
        continue
        
    if "agent_id = str(uuid.uuid4())" not in content:
        continue

    # We want to find the LLM call block
    # and the agent_id block, and swap their order.
    # Actually, a safer way is to inject the agent_id block right before the LLM call,
    # and remove the later occurrence.

    # 1. Remove the old block (might be indented)
    pattern_old = re.compile(r'\s*# 1\. Save agent status\s*agent_id = str\(uuid\.uuid4\(\)\)\s*await self\._update_status\(investigation_id, agent_id, "analyzing"\)')
    content_new = pattern_old.sub('', content)

    # 2. Insert it before the LLM call
    # Find: `        result = await self.gemini_service.complete_json(`
    # Replace with:
    # `        import uuid` (if not already imported, but usually it is at top)
    # `        agent_id = str(uuid.uuid4())`
    # `        await self._update_status(investigation_id, agent_id, "analyzing")`
    # `        result = await ...`
    
    pattern_llm = re.compile(r'(\s*)(result = await self\.gemini_service\.complete_json\()')
    
    replacement = r'\1# Emit analyzing status BEFORE LLM call\1agent_id = str(uuid.uuid4())\1await self._update_status(investigation_id, agent_id, "analyzing")\1\2'
    
    content_new2 = pattern_llm.sub(replacement, content_new)
    
    if content != content_new2:
        with open(filepath, 'w') as f:
            f.write(content_new2)
        print(f"Updated {filepath}")
