package com.todoapp.tests.base;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.todoapp.utils.ExtentManager;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeMethod;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class BaseTest {

    protected WebDriver driver;

    protected static ExtentReports extent =
            ExtentManager.getInstance();

    protected ExtentTest test;


    // =========================
    // Setup
    // =========================

    @BeforeMethod
    public void setUp() {

        driver = new ChromeDriver();

        driver.manage()
                .window()
                .maximize();

        driver.get(
                "http://localhost:5173"
        );

        // Create Extent test before test starts
        test = extent.createTest(
                getClass().getSimpleName()
        );
    }


    // =========================
    // Get Driver
    // =========================

    public WebDriver getDriver() {
        return driver;
    }


    // =========================
    // Tear Down
    // =========================

    @AfterMethod
    public void tearDown(
            ITestResult result
    ) {

        if (result.getStatus() == ITestResult.SUCCESS) {

            test.pass("Test Passed");
        }


        if (result.getStatus() == ITestResult.FAILURE) {

            test.fail(
                    result.getThrowable()
            );

            String screenshotPath =
                    takeScreenshot(
                            result.getName()
                    );

            try {

                test.addScreenCaptureFromPath(
                        screenshotPath
                );

            } catch (Exception e) {

                e.printStackTrace();
            }
        }


        if (result.getStatus() == ITestResult.SKIP) {

            test.skip(
                    "Test Skipped"
            );
        }


        if (driver != null) {

            driver.quit();
        }
    }


    // =========================
    // Screenshot
    // =========================

    private String takeScreenshot(
            String testName
    ) {

        try {

            Path screenshotDir =
                    Paths.get("screenshots");

            Files.createDirectories(
                    screenshotDir
            );


            File source =
                    ((TakesScreenshot) driver)
                            .getScreenshotAs(
                                    OutputType.FILE
                            );


            String fileName =
                    testName
                            + "_"
                            + System.currentTimeMillis()
                            + ".png";


            Path destination =
                    screenshotDir.resolve(
                            fileName
                    );


            Files.copy(
                    source.toPath(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );


            return destination.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to take screenshot",
                    e
            );
        }
    }


    // =========================
    // Finish Extent Report
    // =========================

    @AfterSuite
    public void finishReport() {

        extent.flush();
    }
}