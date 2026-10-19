package com.aquanex.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;

    private Double waterLevel;

    private String problemType;

    private String description;

    private Double latitude;

    private Double longitude;

    private String timestamp;


    // Default Constructor
    public Report() {
    }


    // Constructor
    public Report(
            String location,
            Double waterLevel,
            String problemType,
            String description,
            Double latitude,
            Double longitude,
            String timestamp) {

        this.location = location;
        this.waterLevel = waterLevel;
        this.problemType = problemType;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }


    // Get ID
    public Long getId() {
        return id;
    }


    // Get Location
    public String getLocation() {
        return location;
    }


    // Set Location
    public void setLocation(String location) {
        this.location = location;
    }


    // Get Water Level
    public Double getWaterLevel() {
        return waterLevel;
    }


    // Set Water Level
    public void setWaterLevel(Double waterLevel) {
        this.waterLevel = waterLevel;
    }


    // Get Problem Type
    public String getProblemType() {
        return problemType;
    }


    // Set Problem Type
    public void setProblemType(String problemType) {
        this.problemType = problemType;
    }


    // Get Description
    public String getDescription() {
        return description;
    }


    // Set Description
    public void setDescription(String description) {
        this.description = description;
    }


    // Get Latitude
    public Double getLatitude() {
        return latitude;
    }


    // Set Latitude
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }


    // Get Longitude
    public Double getLongitude() {
        return longitude;
    }


    // Set Longitude
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }


    // Get Timestamp
    public String getTimestamp() {
        return timestamp;
    }


    // Set Timestamp
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}