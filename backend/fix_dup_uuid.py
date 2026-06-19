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

pattern = re.compile(r'\s*agent_id = str\(uuid\.uuid4\(\)\)\s*await self\._update_status\(investigation_id, agent_id, "analyzing"\)')

for filepath in files_to_check:
    with open(filepath, 'r') as f:
        content = f.read()
    
    matches = list(pattern.finditer(content))
    if len(matches) > 1:
        # Remove the first match
        first_match = matches[0]
        content_new = content[:first_match.start()] + content[first_match.end():]
        with open(filepath, 'w') as f:
            f.write(content_new)
        print(f"Fixed {filepath}")
