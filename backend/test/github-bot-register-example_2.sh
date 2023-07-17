#!/bin/bash
curl -X POST http://localhost:8090/github-bot-register/ \
  -H 'Content-Type: application/json' \
  -d '{"meta":{"repository":"danikova/example_project_2","run_id":"5557397088"},"tasks":{"task_1":{"execution_time":0.017,"output":"task_1"},"task_2":{"execution_time":0.016,"output":"task_2"},"task_3":{"execution_time":0.016,"output":"task_3"}}}'