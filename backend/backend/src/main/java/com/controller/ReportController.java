package com.aquanex.backend.controller;

import com.aquanex.backend.entity.Report;
import com.aquanex.backend.repository.ReportRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportController {

    private final ReportRepository reportRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ReportController(
            ReportRepository reportRepository) {

        this.reportRepository =
                reportRepository;
    }


    // =====================================================
    // SAVE NEW REPORT
    // =====================================================

    @PostMapping
    public Report createReport(
            @RequestBody Report report) {

        return reportRepository.save(report);
    }


    // =====================================================
    // GET ALL REPORTS
    // =====================================================

    @GetMapping
    public List<Report> getAllReports() {

        return reportRepository.findAll();
    }


    // =====================================================
    // GET REPORTS NEAR A LOCATION
    // =====================================================

    @GetMapping("/nearby")
    public List<Report> getNearbyReports(

            @RequestParam double latitude,

            @RequestParam double longitude,

            @RequestParam(
                defaultValue = "500"
            )
            double radius) {


        List<Report> allReports =
                reportRepository.findAll();


        List<Report> nearbyReports =
                allReports.stream()
                .filter(report -> {

                    if (
                        report.getLatitude() == null ||
                        report.getLongitude() == null
                    ) {

                        return false;
                    }


                    double distance =
                            calculateDistance(

                                latitude,
                                longitude,

                                report.getLatitude(),
                                report.getLongitude()

                            );


                    return distance <= radius;

                })
                .toList();


        return nearbyReports;

    }


    // =====================================================
    // CALCULATE DISTANCE
    // HAVERSINE FORMULA
    // =====================================================

    private double calculateDistance(

            double latitude1,
            double longitude1,

            double latitude2,
            double longitude2) {


        final double EARTH_RADIUS =
                6371000;


        double lat1 =
                Math.toRadians(
                        latitude1
                );


        double lat2 =
                Math.toRadians(
                        latitude2
                );


        double differenceLatitude =
                Math.toRadians(
                        latitude2 -
                        latitude1
                );


        double differenceLongitude =
                Math.toRadians(
                        longitude2 -
                        longitude1
                );


        double a =

                Math.sin(
                    differenceLatitude / 2
                )
                *
                Math.sin(
                    differenceLatitude / 2
                )

                +

                Math.cos(lat1)
                *
                Math.cos(lat2)

                *
                Math.sin(
                    differenceLongitude / 2
                )
                *
                Math.sin(
                    differenceLongitude / 2
                );


        double c =

                2
                *
                Math.atan2(
                    Math.sqrt(a),
                    Math.sqrt(1 - a)
                );


        return EARTH_RADIUS * c;

    }

}