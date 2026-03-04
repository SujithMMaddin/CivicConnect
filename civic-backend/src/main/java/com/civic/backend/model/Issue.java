package com.civic.backend.model;

import java.time.LocalDateTime;
import java.util.List;

public class Issue {
    private String issueId;
    private String category;
    private String description;
    private double latitude;
    private double longitude;
    private String status;
    private String priority;
    private LocalDateTime createdAt;
    private List<String> imageUrls;

    public Issue() {
    }

    public Issue(String issueId, String category, String description, double latitude, double longitude, String status, String priority, LocalDateTime createdAt) {
        this.issueId = issueId;
        this.category = category;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
    }

    public Issue(String issueId, String category, String description, double latitude, double longitude, String status, String priority, LocalDateTime createdAt, List<String> imageUrls) {
        this.issueId = issueId;
        this.category = category;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.imageUrls = imageUrls;
    }

    // Getters and Setters
    public String getIssueId() {
        return issueId;
    }

    public void setIssueId(String issueId) {
        this.issueId = issueId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
