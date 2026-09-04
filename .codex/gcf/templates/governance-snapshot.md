[GOVERNANCE-SNAPSHOT]
Format: gcf-snapshot.v1
Payload Format: TOON
Profile: toon.v1
Scope: interrupted in-flight task continuity only
TTL: fixed 2 hours from `timestamp`
Lifecycle: reusable only while `snapshots/state.json` marks it `active`; single-use on successful reentry
Lifecycle Source: `./snapshots/state.json`
Budget: <= 2048 bytes serialized payload; reject extra fields
Task ID: <task-id>
Goal: <brief-operational-goal>
Step: <brief-current-step>
Files Focus:
- <path-1>
- <path-2>
Next Action: <brief-operational-next-action>
Timestamp: <ISO-8601>
TTL Expires At: <ISO-8601>
Integrity Status: <valid|invalid|tampered>

```toon
task_id: <task-id>
goal: <brief-operational-goal>
step: <brief-current-step>
files_focus[2]: <path-1>,<path-2>
next_action: <brief-operational-next-action>
timestamp: <ISO-8601>
ttl_expires_at: <ISO-8601>
integrity:
  status: <valid|invalid|tampered>
```
[/GOVERNANCE-SNAPSHOT]
