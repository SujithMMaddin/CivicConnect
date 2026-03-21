# Issue Creation Fix TODO

## Plan Steps:

1. [x] Edit IssueService.createIssue() to add null checks for priority/status defaults (completed)
2. [ ] Rebuild and restart Spring Boot: `cd civic-backend && mvn clean spring-boot:run`
3. [ ] Test issue submission via frontend/Postman
4. [ ] Verify DB: priority='Medium', status='Pending', no 500 errors
5. [ ] Complete - attempt_completion
