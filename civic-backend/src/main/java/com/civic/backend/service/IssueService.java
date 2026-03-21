package com.civic.backend.service;

import com.civic.backend.model.Issue;
import com.civic.backend.model.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    private final IssueRepository issueRepository;

    @Autowired
public IssueService(IssueRepository issueRepository) {
        this.issueRepository = issueRepository;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371000; // meters

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    public Issue createIssue(Issue issue) {
        List<Issue> existingIssues = issueRepository.findAll();

        for (Issue existing : existingIssues) {
            if (
                existing.getCategory() == null ||
                issue.getCategory() == null ||
                existing.getDescription() == null ||
                issue.getDescription() == null
            ) {
                continue;
            }

            double distance = calculateDistance(
                existing.getLatitude(),
                existing.getLongitude(),
                issue.getLatitude(),
                issue.getLongitude()
            );

            if (
                existing.getCategory().equalsIgnoreCase(issue.getCategory()) &&
                existing.getDescription().equalsIgnoreCase(issue.getDescription()) &&
                distance <= 100
            ) {
                // 🔥 FIXED count logic
                int count = existing.getReportCount() == null ? 0 : existing.getReportCount();
                count++;
                existing.setReportCount(count);

                // 🔥 Priority update
                if (count >= 4) {
                    existing.setPriority("High");
                } else if (count >= 2) {
                    existing.setPriority("Medium");
                } else {
                    existing.setPriority("Low");
                }

                return issueRepository.save(existing);
            }
        }

        // NEW ISSUE
        issue.setReportCount(1);

        if (issue.getPriority() == null) {
            issue.setPriority("Low");
        }

        if (issue.getStatus() == null) {
            issue.setStatus("Pending");
        }

        issue.setCreatedAt(LocalDateTime.now());

        return issueRepository.save(issue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(String id) {
        try {
            Long idLong = Long.parseLong(id);
            return issueRepository.findById(idLong);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    public boolean updateIssue(String id, String newStatus, String newPriority) {
        try {
            Long idLong = Long.parseLong(id);
            Optional<Issue> optIssue = issueRepository.findById(idLong);
            if (optIssue.isEmpty()) {
                return false;
            }
            Issue issue = optIssue.get();
            if (newStatus != null) {
                issue.setStatus(newStatus);
            }
            if (newPriority != null) {
                issue.setPriority(newPriority);
            }
            issueRepository.save(issue);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

}
