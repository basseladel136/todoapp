package com.todoapp.tests.listeners;
import com.aventstack.extentreports.ExtentTest;
import com.todoapp.utils.ExtentManager;

import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import org.testng.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

public class TestListener
        implements ITestListener {

    private static ThreadLocal<ExtentTest>
            extentTest =
            new ThreadLocal<>();


    @Override
    public void onTestStart(
            ITestResult result
    ) {

        ExtentTest test =
                ExtentManager
                        .getInstance()
                        .createTest(
                                result.getMethod()
                                        .getMethodName()
                        );

        extentTest.set(test);
    }


    @Override
    public void onTestSuccess(
            ITestResult result
    ) {

        extentTest
                .get()
                .pass("Test Passed");
    }


    @Override
    public void onTestFailure(
            ITestResult result
    ) {

        extentTest
                .get()
                .fail(
                        result.getThrowable()
                );

        Object instance =
                result.getInstance();

        if (instance instanceof
                com.todoapp.tests.base.BaseTest) {

            WebDriver driver =
                    ((com.todoapp.tests.base.BaseTest)
                            instance)
                            .getDriver();

            String screenshot =
                    takeScreenshot(
                            driver,
                            result.getName()
                    );

            try {

                extentTest
                        .get()
                        .addScreenCaptureFromPath(
                                screenshot
                        );

            } catch (Exception e) {

                e.printStackTrace();
            }
        }
    }


    @Override
    public void onTestSkipped(
            ITestResult result
    ) {

        extentTest
                .get()
                .skip(
                        result.getThrowable()
                );
    }


    private String takeScreenshot(
            WebDriver driver,
            String testName
    ) {

        try {

            Path directory =
                    Paths.get("screenshots");

            Files.createDirectories(
                    directory
            );

            File source =
                    ((TakesScreenshot) driver)
                            .getScreenshotAs(
                                    OutputType.FILE
                            );

            Path destination =
                    directory.resolve(
                            testName +
                                    "_" +
                                    System.currentTimeMillis() +
                                    ".png"
                    );

            Files.copy(
                    source.toPath(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return destination.toString();

        } catch (Exception e) {

            throw new RuntimeException(e);
        }
    }
}