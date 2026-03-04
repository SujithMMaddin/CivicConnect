package com.civic.backend.controller;

import com.civic.backend.model.Issue;
import com.civic.backend.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    public ResponseEntity<Issue> createIssue(@RequestBody Issue issue) {
        Issue createdIssue = issueService.createIssue(issue);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        List<Issue> issues = issueService.getAllIssues();
        return new ResponseEntity<>(issues, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable String id) {
        Optional<Issue> issue = issueService.getIssueById(id);
        if (issue.isPresent()) {
            return new ResponseEntity<>(issue.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
public ResponseEntity<?> updateIssue(
        @PathVariable String id,
        @RequestBody Map<String, String> updateRequest) {

    String status = updateRequest.get("status");
    String priority = updateRequest.get("priority");

    boolean updated = issueService.updateIssue(id, status, priority);

    if (!updated) {
        return ResponseEntity.badRequest().body("Invalid issue ID or status transition");
    }

    return issueService.getIssueById(id)
        .map(issue -> ResponseEntity.ok(issue))
        .orElse(ResponseEntity.notFound().build());
}

}
