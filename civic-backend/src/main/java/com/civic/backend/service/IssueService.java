package com.civic.backend.service;

import com.civic.backend.model.Issue;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class IssueService {

    private final Map<String, Issue> issues = new ConcurrentHashMap<>();
    private final double DUPLICATE_DISTANCE_METERS = 100.0;

    public Issue createIssue(Issue issue) {
        // Check for duplicates
        Optional<Issue> duplicate = findDuplicate(issue);
        if (duplicate.isPresent()) {
            // Increase priority of existing issue
            Issue existing = duplicate.get();
            escalatePriority(existing);
            return existing;
        }

        // Generate unique ID
        String issueId = UUID.randomUUID().toString();
        issue.setIssueId(issueId);

        // Set defaults
        issue.setStatus("Pending");
        issue.setCreatedAt(LocalDateTime.now());

        // Assign priority
        assignPriority(issue);

        issues.put(issueId, issue);
        return issue;
    }

    public List<Issue> getAllIssues() {
        return new ArrayList<>(issues.values());
    }

    public Optional<Issue> getIssueById(String id) {
        return Optional.ofNullable(issues.get(id));
    }

    public boolean updateIssue(String id, String newStatus, String newPriority) {
        Issue issue = issues.get(id);
        if (issue == null) {
            return false;
        }

        // Validate status transition
        if (!isValidStatusTransition(issue.getStatus(), newStatus)) {
            return false;
        }

        if (newStatus != null) {
            issue.setStatus(newStatus);
        }
        if (newPriority != null) {
            issue.setPriority(newPriority);
        }
        return true;
    }

    private void assignPriority(Issue issue) {
    String category = issue.getCategory().toLowerCase();

    switch (category) {
        case "water":
        case "electricity":
        case "sewage":
            issue.setPriority("High");
            break;

        case "road":
        case "streetlight":
            issue.setPriority("Medium");
            break;

        case "garbage":
        case "cleanliness":
            issue.setPriority("Low");
            break;

        default:
            issue.setPriority("Medium");
    }
}


    private void escalatePriority(Issue issue) {
        String current = issue.getPriority();
        if ("Low".equals(current)) {
            issue.setPriority("Medium");
        } else if ("Medium".equals(current)) {
            issue.setPriority("High");
        }
        // If already High, stay High
    }

    private Optional<Issue> findDuplicate(Issue newIssue) {
        for (Issue existing : issues.values()) {
            double distance = haversineDistance(newIssue.getLatitude(), newIssue.getLongitude(),
                                                existing.getLatitude(), existing.getLongitude());
            // Duplicate only if within 100m AND same category (case-insensitive)
            if (distance <= DUPLICATE_DISTANCE_METERS && existing.getCategory().equalsIgnoreCase(newIssue.getCategory())) {
                return Optional.of(existing);
            }
        }
        return Optional.empty();
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371000; // meters

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    private boolean isValidStatusTransition(String current, String next) {
        if (current == null || next == null) {
            return true; // Allow if not changing
        }
        switch (current) {
            case "Pending":
                return "In Progress".equals(next) || "Resolved".equals(next);
            case "In Progress":
                return "Resolved".equals(next);
            case "Resolved":
                return false; // Cannot change from Resolved
            default:
                return false;
        }
    }
}
