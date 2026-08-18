package com.todoapp.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;

public class ExtentManager {

    private static ExtentReports extent;

    public static ExtentReports getInstance() {

        if (extent == null) {

            ExtentSparkReporter spark =
                    new ExtentSparkReporter(
                            "reports/ExtentReport.html"
                    );

            spark.config().setDocumentTitle(
                    "Todo App Automation Report"
            );

            spark.config().setReportName(
                    "Todo App Test Execution"
            );

            extent = new ExtentReports();

            extent.attachReporter(spark);

            extent.setSystemInfo(
                    "Application",
                    "Todo App"
            );

            extent.setSystemInfo(
                    "Tester",
                    "Bassel Adel"
            );

            extent.setSystemInfo(
                    "Browser",
                    "Chrome"
            );

            extent.setSystemInfo(
                    "Framework",
                    "Selenium + TestNG"
            );
        }

        return extent;
    }
}